// src/lib/github-webhooks/pr-handler.ts
import { supabaseAdmin } from '../supabase'

export async function handlePullRequestEvent(payload: unknown) {
  try {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid payload structure')
    }
    
    const p = payload as Record<string, unknown> // Type assertion for GitHub webhook payload
    const repositoryFullName = (p.repository as Record<string, unknown>)?.full_name as string
    const pullRequest = p.pull_request as Record<string, unknown>
    const action = p.action as string // opened, closed, synchronize, etc.

    console.log(`PR ${action}: #${(pullRequest.number as number)} in ${repositoryFullName}`)
    console.log(`PR title: ${pullRequest.title as string}`)
    console.log(`PR branch: ${(pullRequest.head as Record<string, unknown>)?.ref as string}`)

    // Get repository info from database
    const { data: repository } = await supabaseAdmin
      .from('github_repositories')
      .select('id, full_name')
      .eq('full_name', repositoryFullName)
      .single()

    if (!repository) {
      console.log(`Repository ${repositoryFullName} not connected to our system, skipping`)
      return
    }

    // Check if the PR branch is linked to any task
    const { data: branchReference } = await supabaseAdmin
      .from('github_references')
      .select('task_id, id')
      .eq('github_type', 'branch')
      .eq('github_id', (pullRequest.head as Record<string, unknown>)?.ref as string)
      .eq('repository_id', repository.id)
      .single()

    if (!branchReference) {
      // Also check if PR title/body mentions any task IDs
      const taskIds = extractTaskIds((pullRequest.title as string) + ' ' + ((pullRequest.body as string) || ''))
      
      if (taskIds.length > 0) {
        console.log(`PR not from tracked branch but mentions tasks: ${taskIds.join(', ')}`)
        // Link PR to each mentioned task
        for (const taskId of taskIds) {
          await linkPullRequestToTask(taskId, repository.id, pullRequest, repositoryFullName, action)
        }
      } else {
        console.log(`PR #${pullRequest.number as number} not from tracked branch and no task IDs found, skipping`)
      }
      return
    }

    console.log(`PR #${pullRequest.number as number} is from tracked branch linked to task ${branchReference.task_id}`)

    // Link PR to the task
    await linkPullRequestToTask(
      branchReference.task_id,
      repository.id,
      pullRequest,
      repositoryFullName,
      action
    )

  } catch (error) {
    console.error('Error handling pull request event:', error)
  }
}

async function linkPullRequestToTask(
  taskId: string,
  repositoryId: string,
  pullRequest: unknown,
  repositoryFullName: string,
  action: string
) {
  try {
    if (!pullRequest || typeof pullRequest !== 'object') {
      throw new Error('Invalid pull request structure')
    }
    
    const pr = pullRequest as Record<string, unknown> // Type assertion for GitHub pull request
    
    // Verify task exists in your system
    const { data: task } = await supabaseAdmin
      .from('tasks')
      .select('id, title')
      .eq('id', taskId)
      .single()

    if (!task) {
      console.log(`Task ${taskId} not found in system, skipping PR link`)
      return
    }

    // Determine PR status based on action and state
    let prStatus = 'open'
    if (pr.state === 'closed') {
      prStatus = pr.merged ? 'merged' : 'closed'
    }

    // Check if PR already linked to this task
    const { data: existingPR } = await supabaseAdmin
      .from('github_references')
      .select('id, metadata')
      .eq('github_type', 'pr')
      .eq('github_id', (pr.number as number)?.toString())
      .eq('task_id', taskId)
      .single()

    if (existingPR) {
      // Update existing PR status
      const { error: updateError } = await supabaseAdmin
        .from('github_references')
        .update({
          status: prStatus,
          title: pr.title as string,
          description: (pr.body as string) || (pr.title as string),
          metadata: {
            ...existingPR.metadata,
            pr_action: action,
            merged_at: pr.merged_at as string,
            closed_at: pr.closed_at as string,
            head_branch: (pr.head as Record<string, unknown>)?.ref as string,
            base_branch: (pr.base as Record<string, unknown>)?.ref as string,
            updated_via_webhook: true
          }
        })
        .eq('id', existingPR.id)

      if (updateError) {
        console.error('Error updating PR reference:', updateError)
        return
      }

      console.log(`Updated PR #${pr.number as number} status to ${prStatus} for task ${taskId}`)
      return
    }

    // Store new PR reference
    const { error } = await supabaseAdmin
      .from('github_references')
      .insert({
        task_id: taskId,
        repository_id: repositoryId,
        github_type: 'pr',
        github_id: (pr.number as number).toString(),
        title: pr.title as string,
        description: (pr.body as string) || (pr.title as string),
        url: pr.html_url as string,
        status: prStatus,
        author: (pr.user as Record<string, unknown>)?.login as string,
        metadata: {
          pr_action: action,
          pr_state: pr.state as string,
          merged: pr.merged as boolean,
          merged_at: pr.merged_at as string,
          closed_at: pr.closed_at as string,
          head_branch: (pr.head as Record<string, unknown>)?.ref as string,
          base_branch: (pr.base as Record<string, unknown>)?.ref as string,
          head_sha: (pr.head as Record<string, unknown>)?.sha as string,
          auto_linked_via_webhook: true,
          additions: (pr.additions as number) || 0,
          deletions: (pr.deletions as number) || 0,
          changed_files: (pr.changed_files as number) || 0
        }
      })
      .select()
      .single()

    if (error) {
      console.error('Error storing PR reference:', error)
      return
    }

    console.log(`Auto-linked PR #${pr.number as number} to task ${taskId} (${task.title})`)

  } catch (error) {
    console.error('Error linking PR to task:', error)
  }
}

// Shared utility - you might want to move this to a common utils file
function extractTaskIds(text: string): string[] {
  const taskIds: string[] = []
  
  // Pattern: Full UUID format - TASK-uuid or #uuid
  const uuidPattern = /(?:TASK-|#)([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/gi
  let match
  
  while ((match = uuidPattern.exec(text)) !== null) {
    taskIds.push(match[1])
  }
  
  return [...new Set(taskIds)]
}