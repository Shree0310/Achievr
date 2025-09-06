// app/api/github/branches/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { createOctokit } from '../../../../lib/github'
import { supabase } from '../../../../lib/supabase'

// POST: Create a branch for a task
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.accessToken) {
      return Response.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('Received body:', body) // Debug log
    
    const { task_id, repository_full_name, task_title, base_branch = 'main' } = body

    console.log('Extracted values:', { task_id, repository_full_name, task_title, base_branch }) // Debug log

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

    const octokit = createOctokit(session.accessToken)
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
    const { data: repository } = await supabase
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
    const { data: reference, error } = await supabase
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

  } catch (error: any) {
    console.error('Error creating branch:', error)
    
    // Handle specific GitHub errors
    if (error.status === 422) {
      return Response.json(
        { message: 'Branch already exists or invalid branch name' },
        { status: 400 }
      )
    }

    return Response.json(
      { message: 'Failed to create branch', error: error.message },
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
    const { data: references, error } = await supabase
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

  } catch (error: any) {
    console.error('Error fetching branches:', error)
    return Response.json(
      { message: 'Failed to fetch branches', error: error.message },
      { status: 500 }
    )
  }
}