export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf:
     * - /api/auth (NextAuth routes)
     * - /api/setup-admin (création premier admin)
     * - /login (page de connexion)
     * - /inscription (formulaire public)
     * - /setup-admin (page de configuration initiale)
     * - /_next (Next.js internals)
     * - /favicon.ico, /logp_eberay.png etc
     */
    '/((?!api/auth|api/setup-admin|login|inscription|setup-admin|_next|favicon.ico|logp_eberay.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}

