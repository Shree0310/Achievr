// app/api/github/oauth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      console.error('GitHub OAuth error:', error)
      return NextResponse.redirect(new URL('/auth?error=github_oauth_failed', request.url))
    }

    if (!code) {
      return NextResponse.redirect(new URL('/auth?error=no_code', request.url))
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/github/oauth/callback`,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      console.error('Token exchange error:', tokenData)
      return NextResponse.redirect(new URL('/auth?error=token_exchange_failed', request.url))
    }

    const accessToken = tokenData.access_token

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    const userData = await userResponse.json()

    if (!userData.id) {
      console.error('Failed to get GitHub user data:', userData)
      return NextResponse.redirect(new URL('/auth?error=user_data_failed', request.url))
    }

    // Get Supabase client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
        },
      }
    )

    // Check if user exists in Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('No Supabase user found:', userError)
      // Store GitHub data in URL parameters and redirect to login
      const redirectUrl = new URL('/auth', request.url)
      redirectUrl.searchParams.set('github_token_ready', 'true')
      redirectUrl.searchParams.set('github_access_token', accessToken)
      redirectUrl.searchParams.set('github_id', userData.id.toString())
      redirectUrl.searchParams.set('github_username', userData.login)
      redirectUrl.searchParams.set('github_name', userData.name || '')
      redirectUrl.searchParams.set('github_avatar_url', userData.avatar_url || '')
      
      console.log('Redirecting to auth with GitHub data:', redirectUrl.toString())
      return NextResponse.redirect(redirectUrl.toString())
    }

    // Update user metadata with GitHub access token
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        github_access_token: accessToken,
        github_id: userData.id.toString(),
        github_username: userData.login,
        github_name: userData.name,
        github_avatar_url: userData.avatar_url,
      }
    })

    if (updateError) {
      console.error('Failed to update user metadata:', updateError)
      return NextResponse.redirect(new URL('/auth?error=metadata_update_failed', request.url))
    }

    console.log('✅ GitHub OAuth successful for user:', user.id)
    return NextResponse.redirect(new URL('/board?github_connected=true', request.url))

  } catch (error) {
    console.error('GitHub OAuth callback error:', error)
    return NextResponse.redirect(new URL('/auth?error=unexpected_error', request.url))
  }
}
