// src/lib/github-webhooks/pr-handler.ts
import { supabaseAdmin } from '../supabase'

export async function handlePullRequestEvent(payload: any) {
  try {
    const repositoryFullName = payload.repository.full_name
    const pullRequest = payload.pull_request
    const action = payload.action // opened, closed, synchronize, etc.

    console.log(`PR ${action}: #${pullRequest.number} in ${repositoryFullName}`)
    console.log(`PR title: ${pullRequest.title}`)
    console.log(`PR branch: ${pullRequest.head.ref}`)

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
      .eq('github_id', pullRequest.head.ref)
      .eq('repository_id', repository.id)
      .single()

    if (!branchReference) {
      // Also check if PR title/body mentions any task IDs
      const taskIds = extractTaskIds(pullRequest.title + ' ' + (pullRequest.body || ''))
      
      if (taskIds.length > 0) {
        console.log(`PR not from tracked branch but mentions tasks: ${taskIds.join(', ')}`)
        // Link PR to each mentioned task
        for (const taskId of taskIds) {
          await linkPullRequestToTask(taskId, repository.id, pullRequest, repositoryFullName, action)
        }
      } else {
        console.log(`PR #${pullRequest.number} not from tracked branch and no task IDs found, skipping`)
      }
      return
    }

    console.log(`PR #${pullRequest.number} is from tracked branch linked to task ${branchReference.task_id}`)

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
  pullRequest: any,
  repositoryFullName: string,
  action: string
) {
  try {
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
    if (pullRequest.state === 'closed') {
      prStatus = pullRequest.merged ? 'merged' : 'closed'
    }

    // Check if PR already linked to this task
    const { data: existingPR } = await supabaseAdmin
      .from('github_references')
      .select('id, metadata')
      .eq('github_type', 'pr')
      .eq('github_id', pullRequest.number.toString())
      .eq('task_id', taskId)
      .single()

    if (existingPR) {
      // Update existing PR status
      const { error: updateError } = await supabaseAdmin
        .from('github_references')
        .update({
          status: prStatus,
          title: pullRequest.title,
          description: pullRequest.body || pullRequest.title,
          metadata: {
            ...existingPR.metadata,
            pr_action: action,
            merged_at: pullRequest.merged_at,
            closed_at: pullRequest.closed_at,
            head_branch: pullRequest.head.ref,
            base_branch: pullRequest.base.ref,
            updated_via_webhook: true
          }
        })
        .eq('id', existingPR.id)

      if (updateError) {
        console.error('Error updating PR reference:', updateError)
        return
      }

      console.log(`Updated PR #${pullRequest.number} status to ${prStatus} for task ${taskId}`)
      return
    }

    // Store new PR reference
    const { data, error } = await supabaseAdmin
      .from('github_references')
      .insert({
        task_id: taskId,
        repository_id: repositoryId,
        github_type: 'pr',
        github_id: pullRequest.number.toString(),
        title: pullRequest.title,
        description: pullRequest.body || pullRequest.title,
        url: pullRequest.html_url,
        status: prStatus,
        author: pullRequest.user.login,
        metadata: {
          pr_action: action,
          pr_state: pullRequest.state,
          merged: pullRequest.merged,
          merged_at: pullRequest.merged_at,
          closed_at: pullRequest.closed_at,
          head_branch: pullRequest.head.ref,
          base_branch: pullRequest.base.ref,
          head_sha: pullRequest.head.sha,
          auto_linked_via_webhook: true,
          additions: pullRequest.additions || 0,
          deletions: pullRequest.deletions || 0,
          changed_files: pullRequest.changed_files || 0
        }
      })
      .select()
      .single()

    if (error) {
      console.error('Error storing PR reference:', error)
      return
    }

    console.log(`Auto-linked PR #${pullRequest.number} to task ${taskId} (${task.title})`)

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