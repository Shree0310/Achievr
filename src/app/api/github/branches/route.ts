// app/api/github/branches/route.ts
import { createOctokit } from '../../../../lib/github'
import { supabaseAdmin } from '../../../../lib/supabase'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// POST: Create a new branch for a task
export async function POST(request: Request) {
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
    
    console.log('GitHub branches API - Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: session?.user?.email,
      userMetadata: session?.user?.user_metadata,
      sessionError: sessionError?.message
    })
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return Response.json(
        { message: 'Authentication error', error: sessionError.message },
        { status: 401 }
      )
    }

    // Get GitHub access token from user metadata or Authorization header
    let githubAccessToken = session?.user?.user_metadata?.github_access_token
    
    // Check Authorization header for demo mode or direct token
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      githubAccessToken = authHeader.substring(7)
      console.log('Using GitHub token from Authorization header')
    }
    
    if (!githubAccessToken) {
      console.log('❌ No GitHub access token found')
      return Response.json(
        { 
          message: 'Not authenticated - No GitHub access token. Please connect your GitHub account.',
          debug: {
            hasSession: !!session,
            hasUser: !!session?.user,
            hasGitHubToken: false,
            nodeEnv: process.env.NODE_ENV
          }
        },
        { status: 401 }
      )
    }

    console.log('✅ Supabase authentication successful')

    const body = await request.json()
    
    const { task_id, repository_full_name, task_title, base_branch: initial_base_branch = 'main' } = body
    let base_branch = initial_base_branch

    console.log('Branch creation request:', {
      task_id,
      repository_full_name,
      task_title,
      base_branch,
      hasGithubToken: !!githubAccessToken
    })

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

    const octokit = createOctokit(githubAccessToken)
    const [owner, repo] = repository_full_name.split('/')

    console.log('Creating Octokit client and splitting repo:', { owner, repo })

    // Get the base branch SHA
    console.log('Getting base branch SHA for:', `heads/${base_branch}`)
    console.log('Repository details:', { owner, repo, full_name: repository_full_name })
    
    let baseRef
    try {
      const result = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${base_branch}`
      })
      baseRef = result.data
      console.log('Base branch SHA:', baseRef.object.sha)
    } catch (refError) {
      console.error('Error getting base branch:', refError)
      
      // Try to get the default branch first
      try {
        console.log('Trying to get repository info to find default branch...')
        const { data: repoInfo } = await octokit.rest.repos.get({
          owner,
          repo
        })
        
        console.log('Repository info:', { default_branch: repoInfo.default_branch })
        
        // Try with the default branch
        const result = await octokit.rest.git.getRef({
          owner,
          repo,
          ref: `heads/${repoInfo.default_branch}`
        })
        
        baseRef = result.data
        console.log('Using default branch SHA:', baseRef.object.sha)
        // Update base_branch for the rest of the function
        base_branch = repoInfo.default_branch
      } catch (repoError) {
        console.error('Error getting repository info:', repoError)
        throw refError
      }
    }

    // Create branch name from task
    const sanitizedTitle = task_title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50)

    const branchName = `feature/TASK-${task_id}-${sanitizedTitle}`
    console.log('Generated branch name:', branchName)

    // Create new branch on GitHub
    console.log('Creating branch on GitHub...')
    const branchResult = await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: baseRef.object.sha
    })
    
    console.log('Branch created on GitHub:', branchResult.data)

    // Get repository ID from database
    if (!supabaseAdmin) {
      return Response.json(
        { message: 'Database not configured' },
        { status: 500 }
      )
    }

    console.log('Looking up repository in database:', repository_full_name)
    const { data: repository, error: repoError } = await supabaseAdmin
      .from('github_repositories')
      .select('id')
      .eq('full_name', repository_full_name)
      .single()

    console.log('Repository lookup result:', { repository, repoError })

    if (!repository) {
      console.log('Repository not found in database')
      return Response.json(
        { message: 'Repository not connected. Please connect it first.' },
        { status: 400 }
      )
    }

    // Store branch reference in database
    console.log('Storing branch reference in database...')
    const referenceData = {
      task_id,
      repository_id: repository.id,
      github_type: 'branch',
      github_id: branchName,
      title: `Branch for: ${task_title}`,
      url: `https://github.com/${repository_full_name}/tree/${branchName}`,
      status: 'active',
        author: session?.user?.user_metadata?.full_name || session?.user?.email || 'Demo User',
      metadata: {
        base_branch,
        created_from_task: true
      }
    }
    
    console.log('Reference data to insert:', referenceData)
    
    const { data: reference, error } = await supabaseAdmin
      .from('github_references')
      .insert(referenceData)
      .select()
      .single()

    console.log('Database insert result:', { reference, error })

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