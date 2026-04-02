'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MOCK_RINGS, MOCK_WEEKLY_DATA, MOCK_STREAK, MOCK_ACHIEVEMENTS } from '@/lib/mock/seed'
import { getScoreLabel } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function WellnessRings() {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t) }, [])

  const rings = [
    { ...MOCK_RINGS.mental,   r: 85, circumference: 2 * Math.PI * 85 },
    { ...MOCK_RINGS.psych,    r: 66, circumference: 2 * Math.PI * 66 },
    { ...MOCK_RINGS.physical, r: 48, circumference: 2 * Math.PI * 48 },
  ]

  const overall = Math.round((MOCK_RINGS.mental.score + MOCK_RINGS.psych.score + MOCK_RINGS.physical.score) / 3)

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Wellness Rings</div>
          <div className="card-subtitle">Mental · Psychological · Physical</div>
        </div>
        <Link href="/dashboard/checkin" className="btn btn-primary" style={{fontSize:'var(--text-xs)',padding:'var(--space-2) var(--space-3)'}}>Check In</Link>
      </div>
      <div className="rings-container">
        <div style={{position:'relative',flexShrink:0}}>
          <svg width="220" height="220" viewBox="0 0 220 220" aria-label="Wellness rings visualisation" role="img">
            {rings.map((ring, i) => {
              const offset = ring.circumference * (1 - (animated ? ring.score / 100 : 0))
              return (
                <g key={i}>
                  <circle fill="none" strokeWidth="14" opacity="0.15" cx="110" cy="110" r={ring.r} stroke={ring.color}/>
                  <circle
                    fill="none" strokeWidth="14" strokeLinecap="round"
                    cx="110" cy="110" r={ring.r}
                    stroke={ring.color}
                    strokeDasharray={ring.circumference}
                    strokeDashoffset={animated ? offset : ring.circumference}
                    transform="rotate(-90 110 110)"
                    style={{transition:'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)'}}
                  />
                </g>
              )
            })}
            <text x="110" y="106" textAnchor="middle" style={{fontFamily:'var(--font-display)',fontWeight:700,fill:'var(--color-text)',fontSize:26}}>{overall}</text>
            <text x="110" y="123" textAnchor="middle" style={{fill:'var(--color-text-muted)',fontSize:11}}>Overall</text>
          </svg>
        </div>
        <div className="ring-legends">
          {Object.entries(MOCK_RINGS).map(([key, ring]) => (
            <div key={key} className="ring-legend">
              <div className="ring-legend-dot" style={{background:ring.color}}/>
              <div>
                <div style={{fontWeight:600,fontSize:'var(--text-sm)',color:'var(--color-text)'}}>{ring.label}</div>
                <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)'}}>{ring.desc}</div>
              </div>
              <div className="ring-legend-value" style={{color:ring.color}}>{ring.score}</div>
            </div>
          ))}
          <div style={{borderTop:'1px solid var(--color-divider)',paddingTop:'var(--space-3)',fontSize:'var(--text-xs)',color:'var(--color-text-muted)'}}>
            Status: <strong style={{color:'var(--color-text)'}}>{getScoreLabel(overall)}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

function WeeklyChart() {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">7-Day Trend</div>
          <div className="card-subtitle">Mental · Psych · Physical</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={185}>
        <LineChart data={MOCK_WEEKLY_DATA} margin={{top:4,right:4,bottom:0,left:-20}}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" vertical={false}/>
          <XAxis dataKey="day" tick={{fontSize:11,fill:'var(--color-text-muted)'}} axisLine={false} tickLine={false}/>
          <YAxis domain={[40,100]} tick={{fontSize:11,fill:'var(--color-text-muted)'}} axisLine={false} tickLine={false}/>
          <Tooltip contentStyle={{background:'var(--color-surface)',border:'1px solid var(--color-divider)',borderRadius:'var(--radius-lg)',fontSize:12}} labelStyle={{color:'var(--color-text)'}}/>
          <Line type="monotone" dataKey="mental"   name="Mental"   stroke="#6366f1" strokeWidth={2} dot={false} strokeLinecap="round"/>
          <Line type="monotone" dataKey="psych"    name="Psych"    stroke="#8b5cf6" strokeWidth={2} dot={false} strokeLinecap="round"/>
          <Line type="monotone" dataKey="physical" name="Physical" stroke="#10b981" strokeWidth={2} dot={false} strokeLinecap="round"/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function DashboardPage() {
  const kpis = [
    { label:'Mental Score',    value:MOCK_RINGS.mental.score,   unit:'/ 100', change:'+4 this week', positive:true,  bg:'var(--color-mental-bg)',        icon:'🧠' },
    { label:'Psych Score',     value:MOCK_RINGS.psych.score,    unit:'/ 100', change:'+8 this week', positive:true,  bg:'var(--color-psych-bg)',         icon:'💜' },
    { label:'Physical Score',  value:MOCK_RINGS.physical.score, unit:'/ 100', change:'+2 this week', positive:true,  bg:'var(--color-physical-bg)',      icon:'⚡' },
    { label:'Check-in Streak', value:7,                          unit:'days',  change:'Personal best!', positive:true, bg:'var(--color-primary-highlight)', icon:'🔥' },
  ]

  return (
    <div className="animate-in">
      <div className="grid-4" style={{marginBottom:'var(--space-5)'}}>
        {kpis.map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-icon" style={{background:k.bg}}><span style={{fontSize:'1.1rem'}}>{k.icon}</span></div>
            <div className="kpi-body">
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-value">{k.value}<span style={{fontSize:'var(--text-xs)',fontWeight:500,color:'var(--color-text-muted)',marginLeft:4}}>{k.unit}</span></div>
              <div className={`kpi-change ${k.positive ? 'positive' : 'negative'}`}>{k.change}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{marginBottom:'var(--space-5)'}}>
        <WellnessRings/>
        <WeeklyChart/>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">Check-in Streak</div></div>
          <div className="streak-days">
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} className={`streak-day ${MOCK_STREAK[i] ? (i === 6 ? 'today' : 'completed') : ''}`} aria-label={`${d}: ${MOCK_STREAK[i] ? 'completed' : 'missed'}`}>{d}</div>
            ))}
          </div>
          <p style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>🔥 7-day streak — keep it going!</p>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Achievements</div></div>
          <div style={{display:'flex',flexDirection:'column',gap:'var(--space-2)'}}>
            {MOCK_ACHIEVEMENTS.map(a => (
              <div key={a.label} style={{display:'flex',alignItems:'center',gap:'var(--space-3)',opacity:a.earned?1:0.4}}>
                <span style={{fontSize:'var(--text-base)'}}>{a.earned ? '🏅' : '⬜'}</span>
                <span style={{fontSize:'var(--text-sm)',color:a.earned?'var(--color-text)':'var(--color-text-faint)',fontWeight:a.earned?600:400}}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
