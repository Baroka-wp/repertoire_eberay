import NextAuth from 'next-auth'

// Configuration NextAuth pour Edge Runtime (middleware)
// Ne peut pas importer Prisma car Edge Runtime ne supporte pas Node.js modules
export const { auth: authEdge } = NextAuth({
  providers: [],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
})

