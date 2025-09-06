// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

export const authOptions = {
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
    async jwt({ token, account }: { token: any; account?: any }) {
      // Store GitHub access token in JWT
      if (account) {
        token.accessToken = account.access_token
        token.githubId = account.providerAccountId
      }
      return token
    },
    
    async session({ session, token }: { session: any; token: any }) {
      // Send properties to the client
      session.accessToken = token.accessToken
      session.githubId = token.githubId
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