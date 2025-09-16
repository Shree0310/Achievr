// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '../../../../lib/auth'

// Debug logging for production
console.log('NextAuth route loaded:', {
  hasSecret: !!process.env.NEXTAUTH_SECRET,
  hasUrl: !!process.env.NEXTAUTH_URL,
  nodeEnv: process.env.NODE_ENV,
  secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
  url: process.env.NEXTAUTH_URL
})

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error('❌ NEXTAUTH_SECRET is missing!')
}

if (!process.env.NEXTAUTH_URL) {
  console.error('❌ NEXTAUTH_URL is missing!')
}

if (!process.env.GITHUB_CLIENT_ID) {
  console.error('❌ GITHUB_CLIENT_ID is missing!')
}

if (!process.env.GITHUB_CLIENT_SECRET) {
  console.error('❌ GITHUB_CLIENT_SECRET is missing!')
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }