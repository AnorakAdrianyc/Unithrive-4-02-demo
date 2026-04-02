'use client'
import { useState } from 'react'
import { MOCK_STUDENTS } from '@/lib/mock/seed'
import { getRiskColor, getRiskBg, formatDate } from '@/lib/utils'

type RiskFilter = 'all' | 'crisis' | 'high' | 'moderate' | 'low'

export default function CounselorPage() {
  const [filter, setFilter] = useState<RiskFilter>('all')

  const students = MOCK_STUDENTS.filter(s => filter === 'all' || s.risk === filter)
  const counts = {
    all:      MOCK_STUDENTS.length,
    crisis:   MOCK_STUDENTS.filter(s => s.risk === 'crisis').length,
    high:     MOCK_STUDENTS.filter(s => s.risk === 'high').length,
    moderate: MOCK_STUDENTS.filter(s => s.risk === 'moderate').length,
    low:      MOCK_STUDENTS.filter(s => s.risk === 'low').length,
  }

  return (
    <div className="animate-in">
      {/* Alert banner */}
      {(counts.crisis > 0 || counts.high > 0) && (
        <div style={{background:'var(--color-notification-highlight)',border:'1px solid var(--color-notification)',borderRadius:'var(--radius-xl)',padding:'var(--space-4)',marginBottom:'var(--space-5)',display:'flex',alignItems:'center',gap:'var(--space-3)',flexWrap:'wrap'}}>
          <span style={{fontSize:'1.4rem'}}>🚨</span>
          <div style={{flex:1}}>
            <strong style={{color:'var(--color-notification)'}}>{counts.crisis} crisis · {counts.high} high-risk</strong>
            <p style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)',marginTop:2,marginBottom:0}}>Immediate outreach recommended for flagged students.</p>
          </div>
          <span className="ai-module-badge mock">🤖 Alarm Detection: Mocked</span>
        </div>
      )}

      {/* KPI row */}
      <div className="grid-4" style={{marginBottom:'var(--space-5)'}}>
        {([
          { label:'Total Students', value:counts.all,    bg:'var(--color-primary-highlight)',      color:'var(--color-primary)'      },
          { label:'Crisis',         value:counts.crisis, bg:'var(--color-notification-highlight)', color:'var(--color-notification)' },
          { label:'High Risk',      value:counts.high,   bg:'var(--color-error-highlight)',        color:'var(--color-error)'        },
          { label:'Low Risk',       value:counts.low,    bg:'var(--color-success-highlight)',      color:'var(--color-success)'      },
        ]).map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-icon" style={{background:k.bg}}><div style={{width:10,height:10,borderRadius:'50%',background:k.color}}/></div>
            <div className="kpi-body">
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-value" style={{color:k.color}}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header" style={{flexWrap:'wrap',gap:'var(--space-3)'}}>
          <div className="card-title">Student Wellness Overview</div>
          <div className="tabs" style={{marginBottom:0}}>
            {(['all','crisis','high','moderate','low'] as RiskFilter[]).map(f => (
              <button key={f} className={`tab ${filter===f?'active':''}`} onClick={() => setFilter(f)} style={{textTransform:'capitalize'}}>
                {f} {f !== 'all' && counts[f] > 0 && <span className="nav-badge" style={{marginLeft:4,position:'static',background:f==='crisis'||f==='high'?'var(--color-notification)':'var(--color-text-faint)'}}>{counts[f]}</span>}
              </button>
            ))}
          </div>
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Dept</th>
                <th>Mental</th>
                <th>Psych</th>
                <th>Physical</th>
                <th>Risk Level</th>
                <th>Last Check-in</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong><div style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)'}}>Year {s.year}</div></td>
                  <td style={{color:'var(--color-text-muted)'}}>{s.dept}</td>
                  <td><span style={{color:'var(--color-mental)',fontWeight:600,fontVariantNumeric:'tabular-nums'}}>{s.mental}</span></td>
                  <td><span style={{color:'var(--color-psych)',fontWeight:600,fontVariantNumeric:'tabular-nums'}}>{s.psych}</span></td>
                  <td><span style={{color:'var(--color-physical)',fontWeight:600,fontVariantNumeric:'tabular-nums'}}>{s.physical}</span></td>
                  <td>
                    <span className="badge" style={{background:getRiskBg(s.risk),color:getRiskColor(s.risk),textTransform:'capitalize'}}>
                      {s.risk === 'crisis' ? '🚨' : s.risk === 'high' ? '⚠️' : s.risk === 'moderate' ? '🟡' : '✅'} {s.risk}
                    </span>
                  </td>
                  <td style={{color:'var(--color-text-muted)',fontSize:'var(--text-xs)'}}>{formatDate(s.last_checkin)}</td>
                  <td>
                    <button className="btn btn-ghost" style={{color:s.risk==='crisis'||s.risk==='high'?'var(--color-notification)':'var(--color-primary)'}}>
                      {s.risk === 'crisis' || s.risk === 'high' ? '📞 Contact' : '👁 View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
