import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const { pathname } = request.nextUrl

  console.log('Middleware: Checking path:', pathname, 'Token exists:', !!token)

  const publicPaths = ['/login', '/register', '/']
  
  // Si la ruta es pública
  if (publicPaths.includes(pathname)) {
    // Si el usuario tiene token y está en login → ir a dashboard
    if (token && pathname === '/login') {
      console.log('Middleware: User authenticated, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // Si el usuario tiene token y está en register → ir a dashboard
    if (token && pathname === '/register') {
      console.log('Middleware: User authenticated, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Para rutas protegidas sin token
  if (!token) {
    console.log('Middleware: No token found, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  console.log('Middleware: Token found, allowing access to', pathname)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}