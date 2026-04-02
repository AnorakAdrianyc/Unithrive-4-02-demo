'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/shell/Sidebar'
import Topbar  from '@/components/shell/Topbar'
import NotificationPanel from '@/components/shell/NotificationPanel'
import { MOCK_NOTIFICATIONS } from '@/lib/mock/seed'

export default function CounselorLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen]     = useState(false)
  const [user, setUser] = useState({ full_name: 'Dr. Lam Wei', role: 'counselor', avatar_initials: 'LW' })
  const pathname = usePathname()

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('demo_user')
      if (stored) {
        const u = JSON.parse(stored) as { full_name: string; role: string }
        setUser({ ...u, avatar_initials: u.full_name.split(' ').map((w:string)=>w[0]).join('').slice(0,2).toUpperCase() })
      }
    } catch {}
  }, [])

  return (
    <>
      <a href="#main-content" style={{position:'absolute',left:'-9999px',width:1,height:1,overflow:'hidden'}}>Skip to main content</a>
      <div className="app-shell">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} pathname={pathname} user={user} unreadCount={0}/>
        {sidebarOpen && <div style={{position:'fixed',inset:0,background:'oklch(0.1 0 0 / 0.45)',zIndex:30}} onClick={() => setSidebarOpen(false)} aria-hidden="true"/>}
        <div className="main-content">
          <div className="demo-banner" role="status">⚡ Counselor Demo — Alarm detection mocked · No Supabase required</div>
          <Topbar onMenuClick={() => setSidebarOpen(true)} onNotifClick={() => setNotifOpen(o=>!o)} unreadCount={0} pathname={pathname}/>
          <main className="page-content" id="main-content" tabIndex={-1}>{children}</main>
        </div>
        <NotificationPanel open={notifOpen} notifications={MOCK_NOTIFICATIONS} onClose={() => setNotifOpen(false)}/>
      </div>
    </>
  )
}
