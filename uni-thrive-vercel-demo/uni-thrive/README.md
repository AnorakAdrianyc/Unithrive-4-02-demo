# UNI-THRIVE — Student Wellness Platform

> **"Fitbit for your academic and personal development"**

A Vercel-deployable Next.js demo showcasing the UNI-THRIVE student wellness platform with Supabase Auth, PostgreSQL, and Realtime.

---

## 🚀 Quick Deploy to Vercel

1. **Fork / push** this repo to GitHub
2. **Create a Supabase project** at [supabase.com](https://supabase.com)
3. **Run the migration**: Paste `supabase/migrations/001_init.sql` into the Supabase SQL editor and run it
4. **Import to Vercel** and add these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_DEMO_MODE=true
```

5. **Deploy!** Click "Enter Demo" on the auth page — no sign-up required.

---

## 🗂 Project Structure

```
uni-thrive/
├── app/
│   ├── auth/page.tsx              ← Login + demo bypass
│   ├── dashboard/
│   │   ├── layout.tsx             ← Shell (sidebar + topbar)
│   │   ├── page.tsx               ← Wellness rings + KPIs
│   │   ├── checkin/page.tsx       ← Daily mood check-in
│   │   ├── summary/page.tsx       ← Weekly insights
│   │   ├── resources/page.tsx     ← Resource library
│   │   ├── opportunities/page.tsx ← Events & recommendations
│   │   ├── notifications/page.tsx ← Notification centre
│   │   └── settings/page.tsx      ← Settings + module status
│   └── counselor/
│       ├── layout.tsx
│       └── page.tsx               ← Admin/counselor dashboard
├── components/shell/              ← Sidebar, Topbar, NotificationPanel
├── lib/
│   ├── supabase/                  ← client.ts, server.ts, realtime.ts
│   ├── mock/
│   │   ├── seed.ts                ← All demo data
│   │   └── ai-stubs.ts            ← Mocked AI service interfaces
│   ├── security.ts                ← Input sanitisation helpers
│   └── utils.ts                   ← cn(), formatDate(), timeAgo()
├── styles/globals.css             ← Design tokens + all component styles
├── middleware.ts                  ← Route protection (Supabase SSR)
└── supabase/migrations/001_init.sql
```

---

## 🏗 Architecture

| Layer | Technology | Status |
|---|---|---|
| Frontend | Next.js 14 App Router | ✅ Live |
| Auth | Supabase Auth (email/password) | ✅ Live |
| Database | Supabase PostgreSQL + RLS | ✅ Live |
| Realtime | Supabase Realtime subscriptions | ✅ Live |
| AI: Sentiment | Python FastAPI stub | 🤖 Mocked |
| AI: Alarm Detection | Cognitive node stub | 🤖 Mocked |
| AI: Insights | Weekly insight generator stub | 🤖 Mocked |
| Mobile | Kotlin Android app | 🔮 Future |
| Storage | Alibaba Cloud / Supabase Storage | 🔮 Future |

### Swapping mock AI for real services

Each stub in `lib/mock/ai-stubs.ts` has a stable TypeScript interface. To replace:

```typescript
// Before (mock):
import { analyzeSentiment } from '@/lib/mock/ai-stubs'

// After (real FastAPI):
async function analyzeSentiment(text: string) {
  const res = await fetch('https://your-fastapi.com/ai/sentiment', {
    method: 'POST', body: JSON.stringify({ text }),
    headers: { 'Content-Type': 'application/json' }
  })
  return res.json()
}
```

No UI changes required.

---

## 🔒 Security

- **RLS policies** on every Supabase table — users only access their own data
- **Input sanitisation** via `lib/security.ts` (strip HTML, escape special chars, max length)
- **Route protection** via `middleware.ts` (server-side Supabase session check)
- **Security headers** in `next.config.js` (X-Frame-Options, nosniff, Referrer-Policy)
- **Form validation** — email regex, password min-length, score clamping
- **No secrets in client** — anon key only (safe for public); service key never exposed

---

## 🌿 3 Rings

| Ring | Colour | Measures |
|---|---|---|
| Mental | Indigo `#6366f1` | Mood, stress, anxiety |
| Psychological | Purple `#8b5cf6` | Resilience, emotional regulation |
| Physical | Emerald `#10b981` | Sleep, activity, nutrition |

---

## Local Development

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase credentials
npm run dev                         # → http://localhost:3000
```
