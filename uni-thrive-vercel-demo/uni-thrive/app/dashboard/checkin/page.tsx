'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { sanitizeText, clampScore } from '@/lib/security'
import { analyzeSentiment } from '@/lib/mock/ai-stubs'

const MOODS = [
  { value: 'great',      emoji: '😄', label: 'Great',      desc: 'Energised & positive' },
  { value: 'good',       emoji: '🙂', label: 'Good',       desc: 'Doing well'           },
  { value: 'okay',       emoji: '😐', label: 'Okay',       desc: 'Getting by'           },
  { value: 'low',        emoji: '😔', label: 'Low',        desc: 'Feeling down'         },
  { value: 'struggling', emoji: '😢', label: 'Struggling', desc: 'Need support'         },
]

export default function CheckinPage() {
  const [mood, setMood]         = useState('')
  const [mental, setMental]     = useState(7)
  const [psych, setPsych]       = useState(6)
  const [physical, setPhysical] = useState(8)
  const [note, setNote]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [aiResult, setAiResult] = useState<{ label: string; score: number } | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!mood) return
    setLoading(true)
    const cleanNote = sanitizeText(note, 500)

    if (cleanNote) {
      const sentiment = await analyzeSentiment(cleanNote)
      setAiResult({ label: sentiment.label, score: Math.round(sentiment.score * 100) })
    }

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('checkins').insert({
          user_id:        user.id,
          mood,
          mental_score:   clampScore(mental),
          psych_score:    clampScore(psych),
          physical_score: clampScore(physical),
          note:           cleanNote || null,
        })
      }
    } catch (err) {
      console.error('Check-in save error (demo):', err)
    }

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) return (
    <div className="animate-in" style={{maxWidth:480,margin:'0 auto',textAlign:'center',paddingTop:'var(--space-16)'}}>
      <div style={{fontSize:'3.5rem',marginBottom:'var(--space-4)'}}>✅</div>
      <h1 style={{fontFamily:'var(--font-display)',fontSize:'var(--text-xl)',fontWeight:700,marginBottom:'var(--space-2)'}}>Check-in saved!</h1>
      <p style={{color:'var(--color-text-muted)',marginBottom:'var(--space-6)'}}>Great job staying on top of your wellness today.</p>
      {aiResult && (
        <div style={{background:'var(--color-primary-highlight)',borderRadius:'var(--radius-lg)',padding:'var(--space-3)',marginBottom:'var(--space-4)',fontSize:'var(--text-sm)',color:'var(--color-primary)'}}>
          🤖 <strong>AI Sentiment (mocked):</strong> {aiResult.label} · {aiResult.score}% confidence
        </div>
      )}
      <div style={{display:'flex',gap:'var(--space-3)',justifyContent:'center',flexWrap:'wrap'}}>
        <button className="btn btn-primary" onClick={() => router.push('/dashboard')}>Back to Dashboard</button>
        <button className="btn btn-outline" onClick={() => { setSubmitted(false); setMood(''); setNote(''); setAiResult(null) }}>New Check-in</button>
      </div>
    </div>
  )

  return (
    <div className="animate-in" style={{maxWidth:600,margin:'0 auto'}}>
      <form onSubmit={handleSubmit}>
        <div className="card" style={{marginBottom:'var(--space-4)'}}>
          <div className="card-title" style={{marginBottom:'var(--space-4)'}}>How are you feeling today?</div>
          <div className="checkin-grid" role="radiogroup" aria-label="Select your mood">
            {MOODS.map(m => (
              <div
                key={m.value}
                className={`checkin-option ${mood === m.value ? 'selected' : ''}`}
                onClick={() => setMood(m.value)}
                role="radio"
                aria-checked={mood === m.value}
                tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setMood(m.value)}
              >
                <div className="checkin-emoji">{m.emoji}</div>
                <div className="checkin-label">{m.label}</div>
                <div className="checkin-desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{marginBottom:'var(--space-4)'}}>
          <div className="card-title" style={{marginBottom:'var(--space-4)'}}>Rate each dimension</div>
          {[
            { label: 'Mental',         value: mental,   set: setMental,   color: 'var(--color-mental)'   },
            { label: 'Psychological',  value: psych,    set: setPsych,    color: 'var(--color-psych)'    },
            { label: 'Physical',       value: physical, set: setPhysical, color: 'var(--color-physical)' },
          ].map(({ label, value, set, color }) => (
            <div key={label} className="slider-container">
              <div className="slider-label">
                <span>{label}</span>
                <span style={{color}}>{value} / 10</span>
              </div>
              <input
                type="range" min={1} max={10} value={value}
                onChange={e => set(Number(e.target.value))}
                style={{accentColor: color}}
                aria-label={`${label} score: ${value} out of 10`}
              />
            </div>
          ))}
        </div>

        <div className="card" style={{marginBottom:'var(--space-4)'}}>
          <div className="card-title" style={{marginBottom:'var(--space-3)'}}>Anything on your mind?<span style={{fontSize:'var(--text-xs)',fontWeight:400,color:'var(--color-text-muted)',marginLeft:'var(--space-2)'}}>Optional</span></div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="AI sentiment analysis will run on this note (mocked)"
            aria-label="Optional note"
            style={{width:'100%',padding:'var(--space-3)',border:'1.5px solid var(--color-border)',borderRadius:'var(--radius-md)',background:'var(--color-surface-2)',color:'var(--color-text)',fontSize:'var(--text-sm)',resize:'vertical',outline:'none',transition:'border-color var(--transition)',fontFamily:'var(--font-body)',lineHeight:1.6}}
            onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
            onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
          />
          <div style={{textAlign:'right',fontSize:'var(--text-xs)',color:'var(--color-text-faint)',marginTop:4}} aria-live="polite">{note.length}/500</div>
        </div>

        <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} type="submit" disabled={!mood || loading}>
          {loading ? 'Saving…' : 'Submit Check-in'}
        </button>
      </form>
    </div>
  )
}
