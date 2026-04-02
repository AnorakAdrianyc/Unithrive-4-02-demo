'use client'
import { X } from 'lucide-react'
import { timeAgo } from '@/lib/utils'

const ICONS: Record<string, string> = { info: '📬', warning: '⚠️', success: '✅', alert: '🚨' }

interface Notif { id: string; title: string; body?: string; type: string; is_read: boolean; created_at: string }
interface Props  { open: boolean; notifications: Notif[]; onClose: () => void }

export default function NotificationPanel({ open, notifications, onClose }: Props) {
  return (
    <div className={`notif-panel ${open ? 'open' : ''}`} role="dialog" aria-label="Notifications panel" aria-modal="true">
      <div className="notif-header">
        <span>Notifications</span>
        <button className="topbar-btn" onClick={onClose} aria-label="Close notifications panel">
          <X size={16}/>
        </button>
      </div>
      <ul className="notif-list" role="list">
        {notifications.map(n => (
          <li key={n.id} className={`notif-item ${!n.is_read ? 'unread' : ''}`}>
            <div className="notif-icon">{ICONS[n.type] ?? '📬'}</div>
            <div className="notif-text">
              <strong>{n.title}</strong>
              {n.body && <p style={{marginTop:2,color:'var(--color-text-muted)',fontSize:'var(--text-xs)'}}>{n.body}</p>}
              <div className="notif-time">{timeAgo(n.created_at)}</div>
            </div>
            {!n.is_read && <div style={{width:7,height:7,borderRadius:'50%',background:'var(--color-notification)',flexShrink:0,marginTop:6}} aria-hidden="true"/>}
          </li>
        ))}
      </ul>
    </div>
  )
}
