import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const { pathname } = request.nextUrl

  console.log('Middleware: Checking path:', pathname, 'Token exists:', !!token)

  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/login', '/register', '/']
  
  // Si la ruta es pública, permitir acceso
  if (publicPaths.includes(pathname)) {
    // Si el usuario tiene token y está intentando acceder a login, redirigir al dashboard
    if (token && pathname === '/login') {
      console.log('Middleware: Authenticated user trying to access login, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Para rutas protegidas, verificar token
  if (!token) {
    console.log('Middleware: No token found, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // TODO: Aquí podrías validar el token JWT si quieres (opcional)
  // Por ahora, simplemente verificamos que existe

  console.log('Middleware: Token found, allowing access to', pathname)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}