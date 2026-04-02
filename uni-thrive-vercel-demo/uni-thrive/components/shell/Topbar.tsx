'use client'
import { Bell, Menu, Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':               { title: 'Dashboard',         subtitle: 'Your wellness overview'           },
  '/dashboard/checkin':       { title: 'Daily Check-in',    subtitle: 'How are you feeling today?'       },
  '/dashboard/summary':       { title: 'Weekly Summary',    subtitle: 'Insights for Week 13'             },
  '/dashboard/opportunities': { title: 'Opportunities',     subtitle: 'Events & recommendations'         },
  '/dashboard/resources':     { title: 'Resource Library',  subtitle: 'Guides, support & tools'          },
  '/dashboard/notifications': { title: 'Notifications',     subtitle: 'Updates and alerts'               },
  '/dashboard/settings':      { title: 'Settings',          subtitle: 'Account & preferences'            },
  '/counselor':               { title: 'Counselor Dashboard', subtitle: 'Student wellness at a glance'   },
}

interface Props {
  onMenuClick: () => void
  onNotifClick: () => void
  unreadCount: number
  pathname: string
}

export default function Topbar({ onMenuClick, onNotifClick, unreadCount, pathname }: Props) {
  const [dark, setDark] = useState(false)
  const meta = PAGE_META[pathname] ?? { title: 'UNI-THRIVE', subtitle: '' }

  useEffect(() => {
    let stored: string | null = null
    try { stored = localStorage.getItem('theme') } catch {}
    const prefersDark = typeof window !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored ? stored === 'dark' : prefersDark
    setDark(isDark)
  }, [])

  function toggleTheme() {
    const next = dark ? 'light' : 'dark'
    setDark(!dark)
    document.documentElement.setAttribute('data-theme', next)
    try { localStorage.setItem('theme', next) } catch {}
  }

  return (
    <header className="topbar" role="banner">
      <div className="topbar-left">
        <button className="topbar-btn hamburger" onClick={onMenuClick} aria-label="Open navigation menu" aria-expanded="false">
          <Menu size={18}/>
        </button>
        <div>
          <div className="topbar-title">{meta.title}</div>
          {meta.subtitle && <div className="topbar-subtitle">{meta.subtitle}</div>}
        </div>
      </div>
      <div className="topbar-right">
        <button className="topbar-btn" onClick={toggleTheme} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}>
          {dark ? <Sun size={18}/> : <Moon size={18}/>}
        </button>
        <button className="topbar-btn" onClick={onNotifClick} aria-label={`Notifications — ${unreadCount} unread`}>
          <Bell size={18}/>
          {unreadCount > 0 && <span className="notification-dot" aria-hidden="true"/>}
        </button>
      </div>
    </header>
  )
}
