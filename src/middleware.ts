import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const { pathname } = request.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/login', '/register', '/']
  
  // Si la ruta es pública, permitir acceso
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Si no hay token y la ruta no es pública, redirigir a login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}