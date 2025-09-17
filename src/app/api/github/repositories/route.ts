// app/api/github/repositories/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { createOctokit } from '../../../../lib/github'
import { supabase } from '../../../../lib/supabase'

import type { Session } from 'next-auth'

// Extend Session type to include accessToken
type SessionWithToken = Session & { accessToken?: string }

// GET: Fetch user's repositories from GitHub and mark connected ones
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !(session as unknown as Record<string, unknown>).accessToken) {
      return Response.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const octokit = createOctokit((session as unknown as Record<string, unknown>).accessToken as string)
    
    // Get user's repositories from GitHub
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: 100,
      sort: 'updated',
      type: 'all'
    })

    // Get connected repositories from database
    let connectedRepos = null
    if (supabase) {
      const { data, error } = await supabase
        .from('github_repositories')
        .select('*')

      if (error) {
        console.error('Database error:', error)
      } else {
        connectedRepos = data
      }
    }

    // Mark which repos are already connected
    const reposWithStatus = repos.map(repo => ({
      id: repo.id,
      full_name: repo.full_name,
      name: repo.name,
      owner: repo.owner.login,
      private: repo.private,
      description: repo.description,
      default_branch: repo.default_branch,
      html_url: repo.html_url,
      clone_url: repo.clone_url,
      ssh_url: repo.ssh_url,
      updated_at: repo.updated_at,
      connected: connectedRepos?.some(cr => cr.full_name === repo.full_name) || false
    }))

    return Response.json({
      repositories: reposWithStatus,
      total: repos.length
    })

  } catch (error: unknown) {
    console.error('Error fetching repositories:', error)
    return Response.json(
      { message: 'Failed to fetch repositories', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST: Connect a repository to a project
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as SessionWithToken
    
    if (!session || !(session as unknown as Record<string, unknown>).accessToken) {
      return Response.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { full_name, project_id } = body

    if (!full_name) {
      return Response.json(
        { message: 'Repository full_name is required' },
        { status: 400 }
      )
    }

    // Get repository details from GitHub
    const octokit = createOctokit((session as unknown as Record<string, unknown>).accessToken as string)
    const [owner, repo_name] = full_name.split('/')
    
    const { data: repo } = await octokit.rest.repos.get({
      owner,
      repo: repo_name
    })

    // Store repository in database
    if (!supabase) {
      return Response.json(
        { message: 'Database not configured' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('github_repositories')
      .upsert({
        project_id: project_id || null,
        full_name: repo.full_name,
        owner: repo.owner.login,
        repo_name: repo.name,
        private: repo.private,
        description: repo.description,
        default_branch: repo.default_branch,
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        ssh_url: repo.ssh_url,
        updated_at: new Date()
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return Response.json(
        { message: 'Failed to connect repository', error: error.message },
        { status: 500 }
      )
    }

    return Response.json({
      message: 'Repository connected successfully',
      repository: data
    })

  } catch (error: unknown) {
    console.error('Error connecting repository:', error)
    return Response.json(
      { message: 'Failed to connect repository', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}