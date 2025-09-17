// app/api/github/test/route.ts
import { testGitHubConnection } from '../../../../lib/github'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // Get Supabase session
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session?.user) {
      return Response.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get GitHub access token from user metadata
    const githubAccessToken = session.user.user_metadata?.github_access_token
    
    if (!githubAccessToken) {
      return Response.json(
        { message: 'No GitHub access token. Please connect your GitHub account.' },
        { status: 401 }
      )
    }

    const result = await testGitHubConnection(githubAccessToken)
    
    if (result.success) {
      return Response.json({
        message: 'GitHub connection successful',
        user: result.user ? {
          login: result.user.login,
          name: result.user.name,
          public_repos: result.user.public_repos
        } : null,
        recent_repos: (result.repositories ?? []).map((repo: Record<string, unknown>) => ({
          name: repo.name,
          full_name: repo.full_name,
          private: repo.private,
          updated_at: repo.updated_at
        }))
      }, { status: 200 })
    } else {
      return Response.json({
        message: 'GitHub connection failed',
        error: result.error
      }, { status: 400 })
    }
  } catch (error: unknown) {
    console.error('GitHub test error:', error)
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}