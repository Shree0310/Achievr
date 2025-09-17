// src/lib/github-webhooks/push-handler.ts
import { supabaseAdmin } from '../supabase'

export async function handlePushEvent(payload: Record<string, unknown>) {
  try {
    const repositoryFullName = (payload.repository as Record<string, unknown>)?.full_name as string
    const branchName = (payload.ref as string).replace('refs/heads/', '')
    const commits = (payload.commits as Record<string, unknown>[]) || []

    console.log(`Push to ${repositoryFullName}:${branchName} with ${commits.length} commits`)

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

    // Process each commit and look for task ID patterns
    for (const commit of commits) {
      await processCommitForTaskReferences(
        commit,
        repository.id,
        repositoryFullName,
        branchName
      )
    }

  } catch (error) {
    console.error('Error handling push event:', error)
  }
}

async function processCommitForTaskReferences(
  commit: Record<string, unknown>,
  repositoryId: string,
  repositoryFullName: string,
  branchName: string
) {
  try {
    const commitMessage = (commit.message as string) || ''
    
    // Extract task IDs from commit message using multiple patterns
    const taskIds = extractTaskIds(commitMessage)
    
    if (taskIds.length === 0) {
      console.log(`No task IDs found in commit: ${(commit.id as string).substring(0, 7)} - "${commitMessage}"`)
      return
    }

    console.log(`Found task IDs in commit ${(commit.id as string).substring(0, 7)}: ${taskIds.join(', ')}`)

    // Link commit to each mentioned task
    for (const taskId of taskIds) {
      await linkCommitToTask(taskId, repositoryId, commit, repositoryFullName, branchName)
    }

  } catch (error) {
    console.error('Error processing commit for task references:', error)
  }
}

async function linkCommitToTask(
  taskId: string,
  repositoryId: string,
  commit: Record<string, unknown>,
  repositoryFullName: string,
  branchName: string
) {
  try {
    // Verify task exists in your system
    const { data: task } = await supabaseAdmin
      .from('tasks')
      .select('id, title')
      .eq('id', taskId)
      .single()

    if (!task) {
      console.log(`Task ${taskId} not found in system, skipping commit link`)
      return
    }

    // Check if commit already linked to this task
    const { data: existingCommit } = await supabaseAdmin
      .from('github_references')
      .select('id')
      .eq('github_type', 'commit')
      .eq('github_id', commit.id as string)
      .eq('task_id', taskId)
      .single()

    if (existingCommit) {
      console.log(`Commit ${(commit.id as string).substring(0, 7)} already linked to task ${taskId}`)
      return
    }

    // Store new commit reference
    const { error } = await supabaseAdmin
      .from('github_references')
      .insert({
        task_id: taskId,
        repository_id: repositoryId,
        github_type: 'commit',
        github_id: commit.id as string,
        title: (commit.message as string).substring(0, 255),
        description: commit.message as string,
        url: commit.url as string,
        status: 'committed',
        author: ((commit.author as Record<string, unknown>)?.name || (commit.author as Record<string, unknown>)?.username) as string,
        metadata: {
          author_email: (commit.author as Record<string, unknown>)?.email,
          commit_date: commit.timestamp,
          full_sha: commit.id,
          branch_name: branchName,
          auto_linked_via_pattern: true,
          detected_patterns: extractTaskIds(commit.message as string),
          added_files: (commit.added as string[]) || [],
          modified_files: (commit.modified as string[]) || [],
          removed_files: (commit.removed as string[]) || []
        }
      })
      .select()
      .single()

    if (error) {
      console.error('Error storing commit reference:', error)
      return
    }

    console.log(`Auto-linked commit ${(commit.id as string).substring(0, 7)} to task ${taskId} (${task.title})`)

  } catch (error) {
    console.error('Error linking commit to task:', error)
  }
}

// Shared utility function
function extractTaskIds(commitMessage: string): string[] {
  const taskIds: string[] = []
  
  // Pattern 1: Full UUID format - TASK-uuid or #uuid
  const uuidPattern = /(?:TASK-|#)([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/gi
  let match
  
  while ((match = uuidPattern.exec(commitMessage)) !== null) {
    taskIds.push(match[1])
  }
  
  // Pattern 2: Short task references - TASK-123, #123, fixes #123, closes TASK-456
  const shortPattern = /(?:(?:fixes?|closes?|resolves?|implements?)\s+)?(?:TASK-|#)(\d+)/gi
  
  while ((match = shortPattern.exec(commitMessage)) !== null) {
    // If it's a number, you might want to map it to actual task IDs
    // For now, we'll treat it as a potential task reference
    const shortId = match[1]
    console.log(`Found short task reference: ${shortId} (you may need to map this to actual task IDs)`)
  }
  
  // Pattern 3: Custom patterns - add your own
  // Example: "Related to task abc123" or "For issue def456"
  const customPattern = /(?:related to task|for (?:issue|task))\s+([a-f0-9-]+)/gi
  
  while ((match = customPattern.exec(commitMessage)) !== null) {
    // Validate if it looks like a UUID
    if (match[1].length >= 8) {
      taskIds.push(match[1])
    }
  }
  
  // Remove duplicates
  return [...new Set(taskIds)]
}