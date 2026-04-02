'use client'
import { useState } from 'react'
import { MOCK_OPPORTUNITIES } from '@/lib/mock/seed'
import { formatDate } from '@/lib/utils'

const CATS = ['all', 'career', 'physical', 'academic', 'social', 'mental'] as const
const CAT_TAG: Record<string, string> = { career:'tag-career', physical:'tag-physical', academic:'tag-academic', social:'tag-social', mental:'tag-mental' }

export default function OpportunitiesPage() {
  const [cat, setCat] = useState('all')

  const filtered = MOCK_OPPORTUNITIES.filter(o => cat === 'all' || o.category === cat)

  return (
    <div className="animate-in">
      <div className="tabs" style={{marginBottom:'var(--space-5)'}}>
        {CATS.map(c => (
          <button key={c} className={`tab ${cat===c?'active':''}`} onClick={() => setCat(c)} style={{textTransform:'capitalize'}}>
            {c === 'all' ? 'All' : c}
          </button>
        ))}
      </div>

      <div className="grid-3">
        {filtered.map(o => (
          <div key={o.id} className="resource-card">
            <div style={{fontSize:'2.5rem',marginBottom:'var(--space-3)',background:'var(--color-surface-offset)',borderRadius:'var(--radius-lg)',width:56,height:56,display:'flex',alignItems:'center',justifyContent:'center'}}>{o.emoji}</div>
            <span className={`badge ${CAT_TAG[o.category] ?? 'badge'}`} style={{textTransform:'capitalize',marginBottom:'var(--space-2)',display:'inline-flex'}}>{o.category}</span>
            <h3 style={{fontSize:'var(--text-sm)',fontWeight:700,color:'var(--color-text)',margin:'var(--space-2) 0'}}>{o.title}</h3>
            <p style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)',marginBottom:'var(--space-3)'}}>{o.description}</p>
            <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-faint)',display:'flex',flexDirection:'column',gap:2,marginBottom:'var(--space-4)'}}>
              {o.date && <span>📅 {formatDate(o.date)}</span>}
              {o.location && <span>📍 {o.location}</span>}
            </div>
            <button className="btn btn-primary" style={{fontSize:'var(--text-xs)',padding:'var(--space-2) var(--space-3)'}}>Register Interest</button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{gridColumn:'1/-1',textAlign:'center',padding:'var(--space-16)',color:'var(--color-text-muted)'}}>
            <div style={{fontSize:'3rem',marginBottom:'var(--space-4)'}}>📭</div>
            <div style={{fontWeight:600}}>No opportunities in this category yet</div>
          </div>
        )}
      </div>
    </div>
  )
}
