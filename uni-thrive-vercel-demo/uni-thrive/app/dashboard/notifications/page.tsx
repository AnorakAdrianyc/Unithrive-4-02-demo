'use client'
import { useState } from 'react'
import { MOCK_NOTIFICATIONS } from '@/lib/mock/seed'
import { timeAgo } from '@/lib/utils'

const ICONS: Record<string, string> = { info:'📬', warning:'⚠️', success:'✅', alert:'🚨' }

export default function NotificationsPage() {
  const [items, setItems] = useState(MOCK_NOTIFICATIONS)

  function markAllRead() {
    setItems(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const unread = items.filter(n => !n.is_read).length

  return (
    <div className="animate-in" style={{maxWidth:640}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'var(--space-5)'}}>
        <div>
          <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>
            {unread > 0 ? `${unread} unread notification${unread>1?'s':''}` : 'All caught up'}
          </span>
        </div>
        {unread > 0 && (
          <button className="btn btn-ghost" onClick={markAllRead}>Mark all read</button>
        )}
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:'var(--space-3)'}}>
        {items.map(n => (
          <div key={n.id} className={`card ${!n.is_read ? 'notif-item unread' : ''}`} style={{borderRadius:'var(--radius-xl)',padding:'var(--space-4)',display:'flex',gap:'var(--space-3)',cursor:'pointer'}} onClick={() => setItems(prev => prev.map(x => x.id === n.id ? {...x, is_read: true} : x))}>
            <div style={{width:40,height:40,borderRadius:'var(--radius-lg)',background:'var(--color-surface-offset)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>{ICONS[n.type] ?? '📬'}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'var(--space-2)'}}>
                <strong style={{fontSize:'var(--text-sm)',color:'var(--color-text)'}}>{n.title}</strong>
                {!n.is_read && <div style={{width:7,height:7,borderRadius:'50%',background:'var(--color-notification)',flexShrink:0,marginTop:4}} aria-label="Unread"/>}
              </div>
              {n.body && <p style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)',marginTop:2,marginBottom:0}}>{n.body}</p>}
              <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-faint)',marginTop:4}}>{timeAgo(n.created_at)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
