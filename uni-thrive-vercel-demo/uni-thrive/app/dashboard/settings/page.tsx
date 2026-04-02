'use client'
import { useState } from 'react'

export default function SettingsPage() {
  const [toggles, setToggles] = useState({
    checkinReminders: true,
    weeklyReport: true,
    counselorAccess: false,
    anonymousData: true,
  })

  function toggle(key: keyof typeof toggles) {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="animate-in" style={{maxWidth:560}}>
      {/* Profile */}
      <div className="card" style={{marginBottom:'var(--space-5)'}}>
        <div className="card-title" style={{marginBottom:'var(--space-4)'}}>Profile</div>
        <div style={{display:'flex',alignItems:'center',gap:'var(--space-4)',marginBottom:'var(--space-5)'}}>
          <div className="user-avatar" style={{width:56,height:56,fontSize:'var(--text-lg)'}}>AC</div>
          <div>
            <div style={{fontWeight:700,color:'var(--color-text)'}}>Alex Chen</div>
            <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)'}}>Year 2 · Computer Science · demo@uni-thrive.app</div>
          </div>
          <button className="btn btn-outline" style={{marginLeft:'auto'}}>Edit</button>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="dept">Department</label>
          <input id="dept" className="form-input" type="text" defaultValue="Computer Science" readOnly/>
        </div>
        <div className="form-group" style={{marginBottom:0}}>
          <label className="form-label" htmlFor="year">Year of Study</label>
          <input id="year" className="form-input" type="number" defaultValue={2} min={1} max={6} readOnly/>
        </div>
      </div>

      {/* Notifications */}
      <div className="card" style={{marginBottom:'var(--space-5)'}}>
        <div className="card-title" style={{marginBottom:'var(--space-4)'}}>Notifications</div>
        {[
          { key:'checkinReminders' as const, label:'Daily check-in reminders', desc:'Get reminded to check in each day' },
          { key:'weeklyReport'     as const, label:'Weekly summary emails',     desc:'Receive your wellness report every Monday' },
        ].map(s => (
          <div key={s.key} className="setting-row" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'var(--space-3) 0',borderBottom:'1px solid var(--color-divider)'}}>
            <div>
              <div style={{fontSize:'var(--text-sm)',fontWeight:600,color:'var(--color-text)'}}>{s.label}</div>
              <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)',marginTop:2}}>{s.desc}</div>
            </div>
            <div
              role="switch"
              aria-checked={toggles[s.key]}
              aria-label={s.label}
              tabIndex={0}
              onClick={() => toggle(s.key)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggle(s.key)}
              style={{width:40,height:22,borderRadius:'var(--radius-full)',background:toggles[s.key]?'var(--color-primary)':'var(--color-surface-dynamic)',cursor:'pointer',position:'relative',transition:'background var(--transition)',flexShrink:0}}
            >
              <div style={{position:'absolute',top:2,left:toggles[s.key]?20:2,width:18,height:18,borderRadius:'50%',background:'white',transition:'left var(--transition)',boxShadow:'var(--shadow-sm)'}}/>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy */}
      <div className="card" style={{marginBottom:'var(--space-5)'}}>
        <div className="card-title" style={{marginBottom:'var(--space-4)'}}>Privacy & Data</div>
        {[
          { key:'counselorAccess' as const, label:'Allow counsellor access', desc:'Counsellors can view your anonymised wellness data' },
          { key:'anonymousData'   as const, label:'Contribute to research',  desc:'Share anonymous aggregated data to improve UNI-THRIVE' },
        ].map(s => (
          <div key={s.key} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'var(--space-3) 0',borderBottom:'1px solid var(--color-divider)'}}>
            <div>
              <div style={{fontSize:'var(--text-sm)',fontWeight:600,color:'var(--color-text)'}}>{s.label}</div>
              <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)',marginTop:2}}>{s.desc}</div>
            </div>
            <div
              role="switch"
              aria-checked={toggles[s.key]}
              aria-label={s.label}
              tabIndex={0}
              onClick={() => toggle(s.key)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggle(s.key)}
              style={{width:40,height:22,borderRadius:'var(--radius-full)',background:toggles[s.key]?'var(--color-primary)':'var(--color-surface-dynamic)',cursor:'pointer',position:'relative',transition:'background var(--transition)',flexShrink:0}}
            >
              <div style={{position:'absolute',top:2,left:toggles[s.key]?20:2,width:18,height:18,borderRadius:'50%',background:'white',transition:'left var(--transition)',boxShadow:'var(--shadow-sm)'}}/>
            </div>
          </div>
        ))}
      </div>

      {/* Module status */}
      <div className="card">
        <div className="card-title" style={{marginBottom:'var(--space-4)'}}>Module Status</div>
        {[
          { label:'Supabase Auth',       status:'live',   note:'Email/password + demo bypass'    },
          { label:'Supabase Postgres',   status:'live',   note:'RLS policies on all tables'      },
          { label:'Supabase Realtime',   status:'live',   note:'Notification subscription active'},
          { label:'Sentiment Analysis',  status:'mock',   note:'lib/mock/ai-stubs.ts'            },
          { label:'Alarm Detection',     status:'mock',   note:'Risk score from check-in inputs' },
          { label:'Cognitive Insights',  status:'mock',   note:'Static insight templates'        },
          { label:'FastAPI AI Service',  status:'future', note:'Replace stubs with HTTP calls'   },
        ].map(m => (
          <div key={m.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'var(--space-2) 0',borderBottom:'1px solid var(--color-divider)'}}>
            <span style={{fontSize:'var(--text-sm)',color:'var(--color-text)'}}>{m.label}</span>
            <div style={{display:'flex',alignItems:'center',gap:'var(--space-2)'}}>
              <span style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)'}}>{m.note}</span>
              <span className="badge" style={{
                background: m.status==='live' ? 'var(--color-success-highlight)' : m.status==='mock' ? 'var(--color-surface-dynamic)' : 'var(--color-warning-highlight)',
                color:       m.status==='live' ? 'var(--color-success)'           : m.status==='mock' ? 'var(--color-text-faint)'      : 'var(--color-warning)',
              }}>
                {m.status==='live'?'✅ Live':m.status==='mock'?'🤖 Mock':'🔮 Future'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
