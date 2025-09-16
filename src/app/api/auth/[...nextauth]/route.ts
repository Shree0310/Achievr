// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '../../../../lib/auth'

// Debug logging for production
console.log('NextAuth route loaded:', {
  hasSecret: !!process.env.NEXTAUTH_SECRET,
  hasUrl: !!process.env.NEXTAUTH_URL,
  nodeEnv: process.env.NODE_ENV
})

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }