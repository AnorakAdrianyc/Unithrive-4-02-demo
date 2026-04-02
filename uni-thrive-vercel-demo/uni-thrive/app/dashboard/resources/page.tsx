'use client'
import { useState } from 'react'
import { MOCK_RESOURCES } from '@/lib/mock/seed'

const CATS = ['all', 'mental', 'physical', 'academic', 'career', 'crisis'] as const
const CAT_TAG: Record<string, string> = { mental:'tag-mental', physical:'tag-physical', academic:'tag-academic', career:'tag-career', social:'tag-social', crisis:'tag-crisis' }

export default function ResourcesPage() {
  const [cat, setCat] = useState('all')
  const [q, setQ]     = useState('')

  const filtered = MOCK_RESOURCES.filter(r =>
    (cat === 'all' || r.category === cat) &&
    (!q || r.title.toLowerCase().includes(q.toLowerCase()) || r.description.toLowerCase().includes(q.toLowerCase()))
  )

  return (
    <div className="animate-in">
      {/* Crisis banner */}
      <div style={{background:'var(--color-notification-highlight)',border:'1px solid var(--color-notification)',borderRadius:'var(--radius-xl)',padding:'var(--space-4)',marginBottom:'var(--space-5)',display:'flex',alignItems:'center',gap:'var(--space-3)'}}>
        <span style={{fontSize:'1.4rem'}}>🆘</span>
        <div>
          <div style={{fontWeight:700,color:'var(--color-text)'}}>Need immediate support?</div>
          <div style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Crisis line: <strong>1800-THRIVE</strong> · Available 24/7 · Confidential & free</div>
        </div>
      </div>

      {/* Search + Filter */}
      <div style={{display:'flex',gap:'var(--space-3)',marginBottom:'var(--space-5)',flexWrap:'wrap',alignItems:'center'}}>
        <input
          type="search"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search resources…"
          className="form-input"
          style={{maxWidth:280}}
          aria-label="Search resources"
        />
        <div className="tabs" style={{marginBottom:0}}>
          {CATS.map(c => (
            <button key={c} className={`tab ${cat===c?'active':''}`} onClick={() => setCat(c)} style={{textTransform:'capitalize'}}>
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-3">
        {filtered.map(r => (
          <div key={r.id} className={`resource-card ${r.featured ? 'featured' : ''}`}>
            <div style={{fontSize:'2rem',marginBottom:'var(--space-3)'}}>{r.emoji}</div>
            <div style={{display:'flex',alignItems:'center',gap:'var(--space-2)',marginBottom:'var(--space-3)',flexWrap:'wrap'}}>
              <span className={`badge ${CAT_TAG[r.category] ?? 'badge'}`} style={{textTransform:'capitalize'}}>{r.category}</span>
              {r.featured && <span className="badge" style={{background:'#d19900',color:'white'}}>⭐ Featured</span>}
            </div>
            <h3 style={{fontSize:'var(--text-sm)',fontWeight:700,color:'var(--color-text)',marginBottom:'var(--space-2)'}}>{r.title}</h3>
            <p style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)',marginBottom:'var(--space-4)'}}>{r.description}</p>
            <button className="btn btn-ghost" style={{padding:0}}>View resource →</button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{gridColumn:'1/-1',textAlign:'center',padding:'var(--space-16)',color:'var(--color-text-muted)'}}>
            <div style={{fontSize:'3rem',marginBottom:'var(--space-4)'}}>🔍</div>
            <div style={{fontWeight:600,marginBottom:'var(--space-2)'}}>No resources found</div>
            <p>Try a different search term or category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
