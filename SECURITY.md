# Uni-Thrive — Cybersecurity Ruleset

> **Audience:** Partners & Investors  
> **Version:** 1.0 — April 2026  
> **Stack:** Next.js 16 · TypeScript · Supabase · Vercel

This document defines the security posture of the Uni-Thrive platform. It is organised into seven domains that together deliver defence-in-depth across the full stack — from the CDN edge down to the database row.

---

## Table of Contents

1. [HTTPS & Transport Security](#1-https--transport-security)
2. [Authentication & Session Management](#2-authentication--session-management)
3. [Role-Based Authorization](#3-role-based-authorization)
4. [Input Validation & Injection Prevention](#4-input-validation--injection-prevention)
5. [HTTP Security Headers & Client-Side Protections](#5-http-security-headers--client-side-protections)
6. [DDoS Mitigation & Rate Limiting](#6-ddos-mitigation--rate-limiting)
7. [Secret Management & Supply-Chain Security](#7-secret-management--supply-chain-security)
8. [Incident Response](#8-incident-response)

---

## 1. HTTPS & Transport Security

### Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| TLS-01 | All traffic **must** use TLS 1.2 or higher. TLS 1.0/1.1 are disabled. | Vercel enforces TLS 1.2+ globally on every deployment; no configuration required. |
| TLS-02 | HTTP requests **must** be permanently redirected to HTTPS (301). | Vercel's edge performs automatic HTTP → HTTPS redirection for every project on every environment (Production, Preview, Development tunnels). |
| TLS-03 | HSTS **must** be sent with a `max-age` of at least one year and must include `includeSubDomains`. | Set in `next.config.js` headers (see §5). |
| TLS-04 | Custom domains **must** use Vercel-managed TLS certificates (auto-renewed via Let's Encrypt). | Configured in the Vercel project dashboard under *Domains*. |
| TLS-05 | Internal service-to-service calls (Next.js Server Components → Supabase REST API) **must** use HTTPS endpoints only. | Supabase project URLs are always `https://`. Never use the Supabase direct Postgres connection string from client-side code. |

### Why this matters

Vercel's globally distributed edge network terminates TLS before traffic ever reaches the Next.js runtime. This means HTTPS enforcement requires zero application code changes and is not bypassable even by developer misconfiguration.

---

## 2. Authentication & Session Management

### Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| AUTH-01 | Authentication **must** use Supabase Auth (email + password minimum). Third-party OAuth providers (Google, GitHub) may be added via the Supabase dashboard. | `lib/supabase/client.ts` and `lib/supabase/server.ts` using `@supabase/ssr`. |
| AUTH-02 | Session tokens **must** be stored in **HttpOnly, Secure, SameSite=Lax** cookies — never in `localStorage`. | `@supabase/ssr` manages cookie lifecycle automatically. Never call `supabase.auth.setSession()` with a token stored in `localStorage`. |
| AUTH-03 | Every server-side request handler and middleware **must** re-validate the session with `supabase.auth.getUser()` before accessing protected data. | `middleware.ts` calls `getUser()` on every request to `/dashboard/*` and `/counselor/*`. |
| AUTH-04 | Unauthenticated requests to protected routes **must** receive a `302` redirect to `/auth`, not a `401` leak. | Enforced in `middleware.ts`. |
| AUTH-05 | Passwords **must not** be stored or logged by the application. Supabase stores only bcrypt-hashed passwords server-side. | No password handling in application code; delegated entirely to Supabase Auth. |
| AUTH-06 | Session expiry **must** be configured to ≤ 24 hours of inactivity. Configure in the Supabase dashboard under *Auth → JWT expiry*. | Default Supabase JWT TTL is 1 hour with automatic silent refresh. |
| AUTH-07 | Demo/mock mode (`NEXT_PUBLIC_DEMO_MODE=true`) **must never** be enabled in the Production Vercel environment. It is permitted only for local development and preview branches. | Enforce via Vercel environment variable scoping: set `NEXT_PUBLIC_DEMO_MODE=false` only on the *Production* environment. |

### Session lifecycle (diagram)

```
Browser ──HTTPS──▶ Vercel Edge ──▶ Next.js Middleware
                                        │
                               supabase.auth.getUser()
                                        │
                             ┌──────────┴──────────┐
                           Valid                 Invalid
                             │                     │
                      Continue to               Redirect
                       Route Handler           to /auth
```

---

## 3. Role-Based Authorization

### Roles

| Role | Access Scope |
|------|-------------|
| `student` | `/dashboard/*` only |
| `counselor` | `/counselor/*` and read-only aggregate views |
| *(future)* `admin` | Full platform administration |

### Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| RBAC-01 | Role must be stored in the Supabase `users` table as a non-nullable `role` column and **never** derived from a client-supplied header or query parameter. | Store role in `auth.users` metadata or a `profiles` table with Row-Level Security enabled. |
| RBAC-02 | Route-level role enforcement **must** occur in `middleware.ts` (server-side), not only in client-side component rendering. | Extend `middleware.ts` to read `user.role` from the Supabase session and redirect on mismatch. |
| RBAC-03 | Database access **must** be constrained by **Row-Level Security (RLS)** policies in Supabase. No RLS = no production deployment. | Enable RLS on every table. Sample policy: `CREATE POLICY "Students see own rows" ON check_ins FOR SELECT USING (auth.uid() = user_id);` |
| RBAC-04 | The Supabase **`anon` key** (public) must only allow the operations explicitly permitted by RLS policies. The **`service_role` key** (admin bypass) **must never** be exposed to the browser or committed to source control. | Keep `service_role` in server-only environment variables, never prefixed with `NEXT_PUBLIC_`. |
| RBAC-05 | Counselors may only access aggregate/anonymised student data unless explicit written consent exists. This is a regulatory requirement under FERPA and applicable data protection laws. | Enforce at the Supabase RLS layer; counselor queries must join through a consent table. |

---

## 4. Input Validation & Injection Prevention

### Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| INJ-01 | All user-supplied strings **must** be sanitised with `sanitizeText()` before being stored or rendered. | `lib/security.ts` — strips HTML tags, encodes `< > & " ' \`` characters, and enforces a maximum length. |
| INJ-02 | All database queries **must** use Supabase's parameterised query builder. Raw SQL string interpolation is **prohibited**. | Use `supabase.from('table').select().eq('id', userId)` — never `supabase.rpc('SELECT ... WHERE id = ' + userId)`. |
| INJ-03 | Numeric inputs (e.g. wellness scores) **must** be validated and clamped server-side before persistence. | `lib/security.ts` — `clampScore(val, 1, 10)` prevents out-of-range integers. |
| INJ-04 | Email addresses **must** be validated with `isValidEmail()` before being passed to Supabase Auth. | `lib/security.ts` — `isValidEmail()` function. |
| INJ-05 | File uploads (if introduced) **must** validate MIME type and file size on the server side. Allowed types must be explicitly whitelisted. | Implement in a Next.js Route Handler, not via client-side `File.type` alone. |
| INJ-06 | Error messages returned to the client **must not** include stack traces, SQL errors, or internal system paths. | Catch errors server-side; return only generic messages (`"An error occurred"`) to the browser. |

### Supabase's built-in SQL injection defence

Supabase's JavaScript client uses the PostgREST API, which translates all `.eq()`, `.filter()`, `.insert()` calls into parameterised SQL statements automatically. Direct SQL injection through the Supabase client library is not possible when using the standard query builder. Custom `rpc()` calls must still use `$1`-style parameter binding in the underlying Postgres function definition.

---

## 5. HTTP Security Headers & Client-Side Protections

Configured in `next.config.js`:

```js
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      // Prevent framing / clickjacking
      { key: 'X-Frame-Options',          value: 'SAMEORIGIN' },
      // Prevent MIME-type sniffing
      { key: 'X-Content-Type-Options',   value: 'nosniff' },
      // Limit referrer information
      { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
      // Disable unused browser APIs
      { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
      // Force HTTPS for 2 years (HSTS)
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      // Content Security Policy
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline'",   // tighten to nonce-based in production
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
          "font-src 'self'",
          "frame-ancestors 'self'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; ')
      },
    ],
  }]
}
```

### Rules

| Rule ID | Rule |
|---------|------|
| HDR-01 | `Strict-Transport-Security` **must** be present on all responses with `max-age ≥ 63072000` (2 years). |
| HDR-02 | `Content-Security-Policy` **must** be defined and must not contain `unsafe-eval`. |
| HDR-03 | `X-Frame-Options: SAMEORIGIN` or CSP `frame-ancestors 'self'` **must** be present to block clickjacking. |
| HDR-04 | `X-Content-Type-Options: nosniff` **must** be present on all responses. |
| HDR-05 | CSRF protection is provided by Supabase's cookie `SameSite=Lax` attribute combined with the `Authorization: Bearer` header required for Supabase API calls. No additional CSRF token is needed for this architecture. |

---

## 6. DDoS Mitigation & Rate Limiting

### Defence layers

Uni-Thrive inherits multiple layers of DDoS protection by virtue of its deployment on Vercel's infrastructure:

#### Layer 1 — Vercel Edge Network (Automatic)

Vercel's Anycast edge spans 100+ PoPs globally. Volumetric DDoS traffic (OSI Layers 3–4: UDP floods, SYN floods) is absorbed and mitigated at the network level before reaching application infrastructure. This is transparent and requires no configuration.

#### Layer 2 — Vercel Firewall (WAF)

Vercel's built-in Web Application Firewall inspects HTTP traffic at the edge. Rules applicable to Uni-Thrive:

| Rule | Setting |
|------|---------|
| Bot protection | Enable Vercel's *Bot Protection* in the project *Security* tab to block malicious automated traffic |
| IP blocking | Use Vercel's *IP Blocking* (Security tab) to block abusive IPs or CIDR ranges |
| Attack Challenge Mode | Enable *Attack Challenge Mode* during an active incident to challenge all visitors with a Managed Challenge |

#### Layer 3 — Application-Level Rate Limiting

Rules to implement in Next.js Route Handlers and the Supabase Auth configuration:

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| DDOS-01 | Authentication endpoints (`/auth/sign-in`, `/auth/sign-up`) **must** be rate-limited to **5 requests per IP per minute**. | Configure in *Supabase Dashboard → Auth → Rate Limits*. Supabase enforces this natively. |
| DDOS-02 | API Route Handlers that write to the database **must** implement a sliding-window rate limit of **30 requests per user per minute**. | Use Vercel KV (Redis) or Upstash with the `@upstash/ratelimit` library in the Route Handler. |
| DDOS-03 | Static assets (`/_next/static/*`, `/public/*`) **must** be served from Vercel's CDN cache. No origin compute should be consumed for static file requests. | Default Vercel/Next.js behaviour — no changes needed. |
| DDOS-04 | Webhook endpoints (if introduced) **must** validate the `X-Signature` header before processing the request body. | Reject unsigned webhooks with `400 Bad Request` before executing any logic. |
| DDOS-05 | Wellness check-in submissions **must** be limited to **1 submission per user per day** enforced at the database layer. | Add a unique index on `(user_id, DATE(created_at))` in Supabase and handle the conflict gracefully. |

#### Layer 4 — Supabase Connection Pooling (PgBouncer)

Supabase uses PgBouncer in transaction-pooling mode to protect the underlying Postgres instance from connection exhaustion. This prevents a burst of authenticated requests from overwhelming the database even if the application layer is bypassed.

---

## 7. Secret Management & Supply-Chain Security

### Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| SEC-01 | **No secrets may be committed to source control.** `.env.local` is in `.gitignore`. Only `.env.local.example` (with placeholder values) is tracked. | See `.env.local.example`. |
| SEC-02 | `NEXT_PUBLIC_` variables are **public** — visible in browser bundles. Only the Supabase `anon` key and project URL may use this prefix. | Never prefix `SUPABASE_SERVICE_ROLE_KEY` or any database password with `NEXT_PUBLIC_`. |
| SEC-03 | Production secrets **must** be stored in Vercel Environment Variables (encrypted at rest) and scoped to the *Production* environment only. | Set in Vercel Dashboard → Settings → Environment Variables. |
| SEC-04 | Dependencies **must** be audited with `npm audit` on every CI run. Critical/High severity vulnerabilities **must** be resolved before merging to `main`. | Add `npm audit --audit-level=high` to the CI pipeline. |
| SEC-05 | The Next.js framework and all production dependencies **must** be updated to their latest stable patch releases at least monthly. | See upgrade workflow — Next.js was last upgraded to v16.2.2. |
| SEC-06 | GitHub repository **must** have Dependabot alerts enabled and configured to auto-create PRs for security updates. | Enable in GitHub → Settings → Security → *Dependabot security updates*. |
| SEC-07 | Only the minimum required Supabase scopes must be granted. The `anon` key must not have write access to sensitive tables beyond what RLS permits. | Audit via Supabase Dashboard → Table Editor → RLS policies. |

---

## 8. Incident Response

### Severity Classification

| Level | Description | Response Time |
|-------|-------------|---------------|
| P1 — Critical | Active data breach, authentication bypass, production outage | 1 hour |
| P2 — High | Vulnerability in production with known exploit, significant service degradation | 4 hours |
| P3 — Medium | Vulnerability without active exploit, non-critical service disruption | 24 hours |
| P4 — Low | Security misconfiguration, informational finding | 72 hours |

### Response Procedure

1. **Detect** — Monitor Vercel observability logs, Supabase Auth logs, and GitHub Security Alerts.
2. **Contain** — Use Vercel's *Attack Challenge Mode* or IP blocking to immediately stop active attacks. Revoke compromised Supabase API keys via the dashboard.
3. **Assess** — Determine the blast radius: which data was accessed, which user accounts are affected.
4. **Remediate** — Deploy a hotfix via the standard CI/CD pipeline. Force-invalidate all active sessions if authentication was compromised (`supabase.auth.admin.signOut(userId)`).
5. **Notify** — Inform affected users within 72 hours as required by GDPR/applicable data protection law.
6. **Review** — Conduct a post-mortem within 5 business days and update this ruleset accordingly.

### Responsible Disclosure

Security vulnerabilities should be reported privately to the engineering team before public disclosure. Do not open a public GitHub Issue for a security vulnerability.

---

## Compliance Alignment

| Standard / Regulation | Relevant Controls |
|-----------------------|-------------------|
| **OWASP Top 10 (2021)** | A01 Broken Access Control → RBAC-01–05; A03 Injection → INJ-01–06; A05 Security Misconfiguration → HDR-01–05; A07 Auth Failures → AUTH-01–07 |
| **GDPR / PDPA** | Data minimisation (only collect required wellness data); encryption in transit (TLS-01–05); breach notification (§8) |
| **FERPA** | Student education records protected via RLS-enforced data access (RBAC-05) |
| **NIST CSF** | Identify (asset inventory), Protect (all rules above), Detect (Vercel/Supabase logs), Respond (§8), Recover (Vercel instant rollback) |

---

*This ruleset is a living document. It must be reviewed and updated following any significant architecture change, security incident, or major dependency upgrade.*
