'use client'
import Link from 'next/link'
import { LayoutDashboard, HeartPulse, BookOpen, Bell, Calendar, Settings, Users, LogOut, BarChart2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/dashboard',               icon: LayoutDashboard, label: 'Dashboard'      },
  { href: '/dashboard/checkin',       icon: HeartPulse,      label: 'Daily Check-in' },
  { href: '/dashboard/summary',       icon: BarChart2,       label: 'Weekly Summary' },
  { href: '/dashboard/opportunities', icon: Calendar,        label: 'Opportunities'  },
  { href: '/dashboard/resources',     icon: BookOpen,        label: 'Resources'      },
  { href: '/dashboard/notifications', icon: Bell,            label: 'Notifications'  },
  { href: '/dashboard/settings',      icon: Settings,        label: 'Settings'       },
]

interface Props {
  open: boolean
  onClose: () => void
  pathname: string
  user: { full_name: string; role: string; avatar_initials?: string }
  unreadCount: number
}

export default function Sidebar({ open, onClose, pathname, user, unreadCount }: Props) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Primary navigation">
      <div className="sidebar-header">
        <svg className="sidebar-logo" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <circle cx="18" cy="18" r="18" fill="var(--color-primary)"/>
          <circle cx="18" cy="18" r="12" fill="none" stroke="white" strokeWidth="2.5" opacity="0.4"/>
          <circle cx="18" cy="18" r="7"  fill="none" stroke="white" strokeWidth="2.5" opacity="0.7"/>
          <circle cx="18" cy="18" r="2.5" fill="white"/>
        </svg>
        <span className="sidebar-brand">UNI-THRIVE</span>
      </div>

      <nav className="sidebar-nav" aria-label="App navigation">
        <span className="nav-section-label">Student</span>
        {NAV.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={16} aria-hidden="true"/>
              {item.label}
              {item.label === 'Notifications' && unreadCount > 0 && (
                <span className="nav-badge" aria-label={`${unreadCount} unread`}>{unreadCount}</span>
              )}
            </Link>
          )
        })}

        <span className="nav-section-label">Admin</span>
        <Link
          href="/counselor"
          className={`nav-item ${pathname.startsWith('/counselor') ? 'active' : ''}`}
          onClick={onClose}
          aria-current={pathname.startsWith('/counselor') ? 'page' : undefined}
        >
          <Users size={16} aria-hidden="true"/> Counselor View
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="user-avatar" aria-hidden="true">
          {(user.avatar_initials ?? user.full_name.slice(0, 2)).toUpperCase()}
        </div>
        <div className="user-info">
          <div className="user-name">{user.full_name}</div>
          <div className="user-role" style={{textTransform:'capitalize'}}>{user.role}</div>
        </div>
        <button className="topbar-btn" onClick={handleLogout} aria-label="Sign out" title="Sign out">
          <LogOut size={16}/>
        </button>
      </div>
    </aside>
  )
}
