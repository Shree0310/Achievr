// src/lib/github.ts
import { Octokit } from '@octokit/rest'

export function createOctokit(accessToken: string) {
  return new Octokit({
    auth: accessToken
  })
}

export async function testGitHubConnection(accessToken: string) {
  try {
    const octokit = createOctokit(accessToken)
    
    // Get authenticated user info
    const { data: user } = await octokit.rest.users.getAuthenticated()
    
    // Get user's repositories
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: 5,
      sort: 'updated',
      type: 'all'
    })
    
    return {
      success: true,
      user: user,
      repositories: repos
    }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Helper function to create a branch for a task
export async function createTaskBranch(
  accessToken: string, 
  repo: string, 
  owner: string, 
  taskId: string, 
  taskTitle: string,
  baseBranch: string = 'main'
) {
  try {
    const octokit = createOctokit(accessToken)
    
    // Get the base branch SHA
    const { data: baseRef } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${baseBranch}`
    })
    
    // Create branch name from task
    const branchName = `feature/TASK-${taskId}-${taskTitle
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50)}`
    
    // Create new branch
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: baseRef.object.sha
    })
    
    return {
      success: true,
      branchName,
      url: `https://github.com/${owner}/${repo}/tree/${branchName}`
    }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}