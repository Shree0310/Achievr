import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()

  // If user is authenticated and trying to access auth page, redirect to board
  if (session && request.nextUrl.pathname === '/auth') {
    console.log('Authenticated user accessing auth page, redirecting to board')
    return NextResponse.redirect(new URL('/board', request.url))
  }

  // If user is not authenticated and trying to access protected pages, redirect to auth
  if (!session && (request.nextUrl.pathname === '/board' || request.nextUrl.pathname === '/cycles-list' || request.nextUrl.pathname === '/task-queue')) {
    console.log('Unauthenticated user accessing protected page, redirecting to auth')
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // If user is authenticated and accessing root page, redirect to board
  if (session && request.nextUrl.pathname === '/') {
    console.log('Authenticated user accessing root page, redirecting to board')
    return NextResponse.redirect(new URL('/board', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (NextAuth routes)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 