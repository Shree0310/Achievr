// app/api/github/oauth/initiate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Generate state parameter for security
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    // Store state in a cookie for verification
    const response = NextResponse.redirect(
      new URL('https://github.com/login/oauth/authorize', request.url)
    )
    
    response.cookies.set('github_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600 // 10 minutes
    })

    // Build GitHub OAuth URL
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    const redirectUri = `${baseUrl}/api/github/oauth/callback`
    console.log('Environment:', process.env.NODE_ENV)
    console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)
    console.log('GitHub OAuth redirect URI:', redirectUri)
    
    const githubOAuthUrl = new URL('https://github.com/login/oauth/authorize')
    githubOAuthUrl.searchParams.set('client_id', process.env.GITHUB_CLIENT_ID!)
    githubOAuthUrl.searchParams.set('redirect_uri', redirectUri)
    githubOAuthUrl.searchParams.set('scope', 'repo read:user user:email')
    githubOAuthUrl.searchParams.set('state', state)

    console.log('Full GitHub OAuth URL:', githubOAuthUrl.toString())
    return NextResponse.redirect(githubOAuthUrl.toString())

  } catch (error) {
    console.error('GitHub OAuth initiation error:', error)
    return NextResponse.json(
      { message: 'Failed to initiate GitHub OAuth', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
