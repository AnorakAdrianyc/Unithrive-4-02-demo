import { NextResponse, type NextRequest } from 'next/server'

const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Demo mode — no Supabase configured — allow all routes freely
  if (!hasSupabase) {
    return NextResponse.next()
  }

  // Supabase is configured — enforce auth
  const { createServerClient } = await import('@supabase/ssr')
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: Record<string, unknown>) {
          request.cookies.set({ name, value, ...options } as Parameters<typeof request.cookies.set>[0])
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options } as Parameters<typeof response.cookies.set>[0])
        },
        remove(name: string, options: Record<string, unknown>) {
          request.cookies.set({ name, value: '', ...options } as Parameters<typeof request.cookies.set>[0])
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options } as Parameters<typeof response.cookies.set>[0])
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && (pathname.startsWith('/dashboard') || pathname.startsWith('/counselor'))) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  if (user && pathname === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/counselor/:path*', '/auth'],
}
