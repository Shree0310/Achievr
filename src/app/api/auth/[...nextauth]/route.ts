// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import type { JWT } from 'next-auth/jwt'
import type { Session } from 'next-auth'

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
    async jwt({ token, account }: { token: JWT; account?: any }) {
      // Store GitHub access token in JWT
      if (account) {
        (token as JWT & { accessToken?: string; githubId?: string }).accessToken = account.access_token as string
        (token as JWT & { accessToken?: string; githubId?: string }).githubId = account.providerAccountId as string
      }
      return token
    },
    
    async session({ session, token }: { session: Session; token: JWT }) {
      // Send properties to the client
      const extendedToken = token as JWT & { accessToken?: string; githubId?: string }
      const extendedSession = session as Session & { accessToken?: string; githubId?: string }
      
      if (extendedToken.accessToken) {
        extendedSession.accessToken = extendedToken.accessToken
      }
      if (extendedToken.githubId) {
        extendedSession.githubId = extendedToken.githubId
      }
      
      return session
    },
    
    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
      // Temporarily disable Supabase operations for testing
      console.log('Sign in attempt:', { user, account, profile })
      return true
    }
  },
  
  debug: true, // Enable debug mode
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }