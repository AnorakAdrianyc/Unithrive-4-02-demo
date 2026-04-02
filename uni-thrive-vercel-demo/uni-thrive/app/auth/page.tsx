'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { isValidEmail } from '@/lib/security'

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project')

async function trySupabaseLogin(email: string, password: string, name: string, mode: 'login' | 'signup') {
  try {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, role: 'student' } } })
      if (error) throw error
      if (data.user && !data.session) throw new Error('Check your email to confirm your account.')
    }
  } catch (err: unknown) {
    throw err
  }
}

export default function AuthPage() {
  const [mode, setMode]       = useState<'login' | 'signup'>('login')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]       = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function enterDemo() {
    // Store demo flag in sessionStorage so the app knows who we are
    try { sessionStorage.setItem('demo_user', JSON.stringify({ full_name: 'Alex Chen', role: 'student' })) } catch {}
    router.push('/dashboard')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!isValidEmail(email)) { setError('Please enter a valid email address.'); return }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return }

    if (DEMO_MODE) {
      // No Supabase — just store user info and navigate
      try { sessionStorage.setItem('demo_user', JSON.stringify({ full_name: name || email.split('@')[0], role: 'student' })) } catch {}
      router.push('/dashboard')
      return
    }

    setLoading(true)
    try {
      await trySupabaseLogin(email, password, name, mode)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card animate-in">
        {/* Logo */}
        <div className="auth-logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-label="UNI-THRIVE">
            <circle cx="18" cy="18" r="18" fill="var(--color-primary)"/>
            <circle cx="18" cy="18" r="12" fill="none" stroke="white" strokeWidth="2.5" opacity="0.4"/>
            <circle cx="18" cy="18" r="7"  fill="none" stroke="white" strokeWidth="2.5" opacity="0.7"/>
            <circle cx="18" cy="18" r="2.5" fill="white"/>
          </svg>
          <div>
            <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:'var(--text-base)',color:'var(--color-text)'}}>UNI-THRIVE</div>
            <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)'}}>Student Wellness Platform</div>
          </div>
        </div>

        {/* Demo banner */}
        <div className="demo-banner" style={{borderRadius:'var(--radius-md)',marginBottom:'var(--space-5)',border:'1px solid var(--color-warning-highlight)'}}>
          ⚡ Running in Demo Mode — all data is local mock data
        </div>

        <div className="tabs" style={{marginBottom:'var(--space-5)'}}>
          <button className={`tab ${mode==='login'?'active':''}`} onClick={()=>{setMode('login');setError('')}}>Sign In</button>
          <button className={`tab ${mode==='signup'?'active':''}`} onClick={()=>{setMode('signup');setError('')}}>Create Account</button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label" htmlFor="fullname">Full Name</label>
              <input id="fullname" className="form-input" type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Alex Chen" maxLength={100}/>
            </div>
          )}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" className="form-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@university.edu" required autoComplete="email"/>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" className="form-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 8 characters" required minLength={8} autoComplete={mode==='login'?'current-password':'new-password'}/>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginBottom:'var(--space-3)'}} type="submit" disabled={loading}>
            {loading ? 'Loading…' : DEMO_MODE ? `${mode==='login'?'Sign In':'Sign Up'} (Demo)` : mode==='login'?'Sign In':'Create Account'}
          </button>
        </form>

        <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)',marginBottom:'var(--space-3)'}}>
          <div style={{flex:1,height:1,background:'var(--color-divider)'}}/>
          <span style={{fontSize:'var(--text-xs)',color:'var(--color-text-faint)'}}>or</span>
          <div style={{flex:1,height:1,background:'var(--color-divider)'}}/>
        </div>

        <button className="btn btn-outline" style={{width:'100%',justifyContent:'center'}} onClick={enterDemo} type="button">
          🚀 Enter Demo — no account needed
        </button>

        {DEMO_MODE && (
          <p style={{fontSize:'var(--text-xs)',color:'var(--color-text-faint)',textAlign:'center',marginTop:'var(--space-4)'}}>
            Demo mode active — Supabase is optional. All features work with seeded mock data.
          </p>
        )}
      </div>
    </div>
  )
}
