// app/api/github/branches/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { createOctokit } from '../../../../lib/github'
import { supabaseAdmin } from '../../../../lib/supabase'

// POST: Create a branch for a task
export async function POST(request: Request) {
  try {
    // Log environment variables
    console.log('Environment check:', {
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasGitHubClientId: !!process.env.GITHUB_CLIENT_ID,
      hasGitHubClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
      nodeEnv: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
      githubClientIdLength: process.env.GITHUB_CLIENT_ID?.length || 0,
      githubClientSecretLength: process.env.GITHUB_CLIENT_SECRET?.length || 0
    })

    // Log request headers
    const headers = Object.fromEntries(request.headers.entries())
    console.log('Request headers:', {
      cookie: headers.cookie ? 'Present' : 'Missing',
      authorization: headers.authorization ? 'Present' : 'Missing',
      userAgent: headers['user-agent'],
      origin: headers.origin,
      referer: headers.referer
    })

    const session = await getServerSession(authOptions)
    
    // Comprehensive session debugging
    console.log('Session analysis:', {
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
      expires: session?.expires,
      nodeEnv: process.env.NODE_ENV
    })
    
    if (!session) {
      console.log('❌ No session found')
      return Response.json(
        { 
          message: 'Not authenticated - No session found',
          debug: {
            hasSession: false,
            hasAccessToken: false,
            nodeEnv: process.env.NODE_ENV,
            nextAuthUrl: process.env.NEXTAUTH_URL,
            hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET
          }
        },
        { status: 401 }
      )
    }

    if (!(session as unknown as Record<string, unknown>).accessToken) {
      console.log('❌ No access token in session')
      return Response.json(
        { 
          message: 'Not authenticated - No access token',
          debug: {
            hasSession: true,
            hasAccessToken: false,
            sessionKeys: Object.keys(session),
            userExists: !!session?.user,
            nodeEnv: process.env.NODE_ENV
          }
        },
        { status: 401 }
      )
    }

    console.log('✅ Authentication successful')

    const body = await request.json()
    
    const { task_id, repository_full_name, task_title, base_branch = 'main' } = body

    if (!task_id || !repository_full_name || !task_title) {
      console.log('Missing required fields:', { 
        task_id: !!task_id, 
        repository_full_name: !!repository_full_name, 
        task_title: !!task_title 
      }) // Debug log
      
      return Response.json(
        { message: 'task_id, repository_full_name, and task_title are required' },
        { status: 400 }
      )
    }

    const octokit = createOctokit((session as unknown as Record<string, unknown>).accessToken as string)
    const [owner, repo] = repository_full_name.split('/')

    // Get the base branch SHA
    const { data: baseRef } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${base_branch}`
    })

    // Create branch name from task
    const sanitizedTitle = task_title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50)

    const branchName = `feature/TASK-${task_id}-${sanitizedTitle}`

    // Create new branch on GitHub
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: baseRef.object.sha
    })

    // Get repository ID from database
    if (!supabaseAdmin) {
      return Response.json(
        { message: 'Database not configured' },
        { status: 500 }
      )
    }

    const { data: repository } = await supabaseAdmin
      .from('github_repositories')
      .select('id')
      .eq('full_name', repository_full_name)
      .single()

    if (!repository) {
      return Response.json(
        { message: 'Repository not connected. Please connect it first.' },
        { status: 400 }
      )
    }

    // Store branch reference in database
    const { data: reference, error } = await supabaseAdmin
      .from('github_references')
      .insert({
        task_id,
        repository_id: repository.id,
        github_type: 'branch',
        github_id: branchName,
        title: `Branch for: ${task_title}`,
        url: `https://github.com/${repository_full_name}/tree/${branchName}`,
        status: 'active',
        author: session.user?.name || 'Unknown',
        metadata: {
          base_branch,
          created_from_task: true
        }
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return Response.json(
        { message: 'Branch created but failed to save reference', error: error.message },
        { status: 500 }
      )
    }

    return Response.json({
      message: 'Branch created successfully',
      branch: {
        name: branchName,
        url: `https://github.com/${repository_full_name}/tree/${branchName}`,
        reference: reference
      }
    })

  } catch (error: unknown) {
    console.error('Error creating branch:', error)
    
    // Handle specific GitHub errors
    if (typeof error === 'object' && error !== null && 'status' in error && (error as Record<string, unknown>).status === 422) {
      return Response.json(
        { message: 'Branch already exists or invalid branch name' },
        { status: 400 }
      )
    }

    // Fallback error response
    const errorMessage = 'Failed to create branch'
    let errorDetail: string | undefined = undefined

    if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as Record<string, unknown>).message === 'string') {
      errorDetail = (error as Record<string, unknown>).message as string
    } else if (typeof error === 'string') {
      errorDetail = error
    }

    return Response.json(
      { message: errorMessage, error: errorDetail },
      { status: 500 }
    )
  }
}

// GET: List branches for a task
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const task_id = searchParams.get('task_id')

    if (!task_id) {
      return Response.json(
        { message: 'task_id parameter is required' },
        { status: 400 }
      )
    }

    // Get GitHub references for this task
    if (!supabaseAdmin) {
      return Response.json(
        { message: 'Database not configured' },
        { status: 500 }
      )
    }

    const { data: references, error } = await supabaseAdmin
      .from('github_references')
      .select(`
        *,
        github_repositories (
          full_name,
          owner,
          repo_name
        )
      `)
      .eq('task_id', task_id)
      .eq('github_type', 'branch')

    if (error) {
      console.error('Database error:', error)
      return Response.json(
        { message: 'Failed to fetch branches', error: error.message },
        { status: 500 }
      )
    }

    return Response.json({
      branches: references || [],
      total: references?.length || 0
    })

  } catch (error: unknown) {
    console.error('Error fetching branches:', error)
    return Response.json(
      { message: 'Failed to fetch branches', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}