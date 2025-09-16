// src/lib/auth.ts
import type { NextAuthOptions } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import type { Session } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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
    async jwt({ token, account, user }) {
      console.log('JWT callback triggered:', {
        hasToken: !!token,
        hasAccount: !!account,
        hasUser: !!user,
        accountProvider: account?.provider,
        accountType: account?.type,
        hasAccessToken: !!account?.access_token,
        tokenKeys: Object.keys(token),
        nodeEnv: process.env.NODE_ENV
      })

      // Store GitHub access token in JWT
      if (account) {
        (token as JWT & { accessToken?: string; githubId?: string }).accessToken = account.access_token as string
        (token as JWT & { accessToken?: string; githubId?: string }).githubId = account.providerAccountId as string
        
        console.log('Stored in JWT token:', {
          accessTokenLength: account.access_token?.length || 0,
          githubId: account.providerAccountId,
          provider: account.provider
        })
      }
      return token
    },
    
    async session({ session, token }) {
      console.log('Session callback triggered:', {
        hasSession: !!session,
        hasToken: !!token,
        sessionKeys: session ? Object.keys(session) : [],
        tokenKeys: token ? Object.keys(token) : [],
        hasAccessToken: !!(token as JWT & { accessToken?: string; githubId?: string }).accessToken,
        nodeEnv: process.env.NODE_ENV
      })

      // Send properties to the client
      const extendedToken = token as JWT & { accessToken?: string; githubId?: string }
      const extendedSession = session as Session & { accessToken?: string; githubId?: string }
      
      if (extendedToken.accessToken) {
        extendedSession.accessToken = extendedToken.accessToken
        console.log('Added access token to session:', {
          accessTokenLength: extendedToken.accessToken.length,
          githubId: extendedToken.githubId
        })
      }
      if (extendedToken.githubId) {
        extendedSession.githubId = extendedToken.githubId
      }
      
      console.log('Final session:', {
        hasAccessToken: !!extendedSession.accessToken,
        hasGithubId: !!extendedSession.githubId,
        userEmail: extendedSession.user?.email
      })
      
      return session
    },
    
    async signIn({ user, account, profile }) {
      console.log('Sign in callback triggered:', { 
        user: user ? { id: user.id, email: user.email, name: user.name } : null,
        account: account ? { provider: account.provider, type: account.type } : null,
        profile: profile ? { 
          login: (profile as Record<string, unknown>).login, 
          id: (profile as Record<string, unknown>).id 
        } : null,
        nodeEnv: process.env.NODE_ENV
      })
      return true
    }
  },
  
  debug: process.env.NODE_ENV === 'development', // Enable debug mode only in development
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
}
