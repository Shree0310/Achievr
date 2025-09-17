// app/api/github/test/route.ts
import { getServerSession, Session } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { testGitHubConnection } from '../../../../lib/github'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Type assertion to include accessToken
    const accessToken = (session as Session & { accessToken?: string })?.accessToken

    if (!session || !accessToken) {
      return Response.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const result = await testGitHubConnection(accessToken)
    
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