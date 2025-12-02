import { authEdge } from './lib/auth-edge'
import { NextResponse } from 'next/server'

export default authEdge((req) => {
  const { pathname } = req.nextUrl

  // Routes publiques
  const publicPaths = [
    '/api/auth',
    '/api/setup-admin',
    '/api/check-admin',
    '/login',
    '/inscription',
    '/inscription/merci',
    '/setup-admin',
  ]

  // Fichiers statiques
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/logp_eberay.png') ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Vérifier si la route est publique
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Si pas de session, rediriger vers login
  if (!req.auth) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

