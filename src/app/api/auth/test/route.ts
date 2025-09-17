// app/api/auth/test/route.ts
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('=== AUTH TEST ENDPOINT ===')
    
    // Check environment variables
    const envCheck = {
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV,
      secretLength: process.env.NEXTAUTH_SECRET?.length || 0
    }
    
    console.log('Environment check:', envCheck)
    
    // Check if we can access NextAuth endpoints
    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin
    const signinUrl = `${baseUrl}/api/auth/signin`
    const sessionUrl = `${baseUrl}/api/auth/session`
    
    console.log('NextAuth URLs:', {
      baseUrl,
      signinUrl,
      sessionUrl
    })
    
    return Response.json({
      success: true,
      environment: envCheck,
      urls: {
        baseUrl,
        signinUrl,
        sessionUrl
      },
      message: 'Auth test endpoint working'
    })
    
  } catch (error) {
    console.error('Auth test error:', error)
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
