// app/api/auth/session-test/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'

export async function GET() {
  try {
    console.log('=== SESSION TEST ENDPOINT ===')
    
    // Log environment variables
    console.log('Environment check:', {
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV
    })

    const session = await getServerSession(authOptions)
    
    console.log('Session test result:', {
      sessionExists: !!session,
      sessionType: typeof session,
      sessionKeys: session ? Object.keys(session) : [],
      userExists: !!session?.user,
      userKeys: session?.user ? Object.keys(session.user) : [],
      userEmail: session?.user?.email,
      userName: session?.user?.name,
      accessTokenExists: !!(session as unknown as Record<string, unknown>)?.accessToken,
      accessTokenType: typeof (session as unknown as Record<string, unknown>)?.accessToken,
      accessTokenLength: (session as unknown as Record<string, unknown>)?.accessToken ? 
        ((session as unknown as Record<string, unknown>).accessToken as string).length : 0,
      githubIdExists: !!(session as unknown as Record<string, unknown>)?.githubId,
      githubId: (session as unknown as Record<string, unknown>)?.githubId,
      expires: session?.expires
    })

    return Response.json({
      success: true,
      session: {
        exists: !!session,
        user: session?.user ? {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image
        } : null,
        hasAccessToken: !!(session as unknown as Record<string, unknown>)?.accessToken,
        accessTokenLength: (session as unknown as Record<string, unknown>)?.accessToken ? 
          ((session as unknown as Record<string, unknown>).accessToken as string).length : 0,
        githubId: (session as unknown as Record<string, unknown>)?.githubId,
        expires: session?.expires
      },
      environment: {
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        nodeEnv: process.env.NODE_ENV
      }
    })

  } catch (error) {
    console.error('Session test error:', error)
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
