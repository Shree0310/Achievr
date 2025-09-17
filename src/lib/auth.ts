// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import type { JWT } from 'next-auth/jwt'
import type { Session } from 'next-auth'

// Extend the types
interface ExtendedToken extends JWT {
  accessToken?: string
  githubId?: string
}

interface ExtendedSession extends Session {
  accessToken?: string
  githubId?: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'repo read:user user:email'
        }
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, account }) {
      if (account && typeof account.access_token === 'string') {
        const extendedToken = token as ExtendedToken
        extendedToken.accessToken = account.access_token
        extendedToken.githubId = account.providerAccountId
      }
      return token
    },
    
    async session({ session, token }) {
      const extendedToken = token as ExtendedToken
      const extendedSession = session as ExtendedSession
      
      extendedSession.accessToken = extendedToken.accessToken
      extendedSession.githubId = extendedToken.githubId
      
      return session
    },
    
    async signIn({ user, account, profile }) {
      console.log('Sign in attempt:', { user, account, profile })
      return true
    }
  },
  
  debug: process.env.NODE_ENV === 'development',
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
}