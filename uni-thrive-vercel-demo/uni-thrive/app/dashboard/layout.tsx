'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/shell/Sidebar'
import Topbar  from '@/components/shell/Topbar'
import NotificationPanel from '@/components/shell/NotificationPanel'
import { MOCK_NOTIFICATIONS } from '@/lib/mock/seed'

const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen]     = useState(false)
  const [user, setUser] = useState({ full_name: 'Alex Chen', role: 'student', avatar_initials: 'AC' })
  const pathname = usePathname()

  useEffect(() => {
    // Try sessionStorage first (demo login)
    try {
      const stored = sessionStorage.getItem('demo_user')
      if (stored) {
        const u = JSON.parse(stored) as { full_name: string; role: string }
        const initials = u.full_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
        setUser({ ...u, avatar_initials: initials })
        return
      }
    } catch {}

    // Try Supabase if configured
    if (!DEMO_MODE) {
      import('@/lib/supabase/client').then(({ createClient }) => {
        createClient().auth.getUser().then(({ data }) => {
          if (data.user?.user_metadata?.full_name) {
            const name = data.user.user_metadata.full_name as string
            setUser({
              full_name: name,
              role: (data.user.user_metadata.role as string) ?? 'student',
              avatar_initials: name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
            })
          }
        })
      })
    }
  }, [])

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.is_read).length

  return (
    <>
      <a href="#main-content" style={{position:'absolute',left:'-9999px',top:'auto',width:1,height:1,overflow:'hidden'}} className="sr-only">Skip to main content</a>
      <div className="app-shell">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} pathname={pathname} user={user} unreadCount={unreadCount}/>
        {sidebarOpen && (
          <div style={{position:'fixed',inset:0,background:'oklch(0.1 0 0 / 0.45)',zIndex:30}} onClick={() => setSidebarOpen(false)} aria-hidden="true"/>
        )}
        <div className="main-content">
          <div className="demo-banner" role="status">
            ⚡ Demo mode — mock data · {DEMO_MODE ? 'No Supabase needed' : 'Supabase connected'} · AI modules mocked
          </div>
          <Topbar onMenuClick={() => setSidebarOpen(true)} onNotifClick={() => setNotifOpen(o => !o)} unreadCount={unreadCount} pathname={pathname}/>
          <main className="page-content" id="main-content" tabIndex={-1}>
            {children}
          </main>
        </div>
        <NotificationPanel open={notifOpen} notifications={MOCK_NOTIFICATIONS} onClose={() => setNotifOpen(false)}/>
      </div>
    </>
  )
}
