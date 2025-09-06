// src/lib/github-webhooks/push-handler.ts
import { supabaseAdmin } from '../supabase'

export async function handlePushEvent(payload: any) {
  try {
    const repositoryFullName = payload.repository.full_name
    const branchName = payload.ref.replace('refs/heads/', '')
    const commits = payload.commits || []

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
  commit: any,
  repositoryId: string,
  repositoryFullName: string,
  branchName: string
) {
  try {
    const commitMessage = commit.message || ''
    
    // Extract task IDs from commit message using multiple patterns
    const taskIds = extractTaskIds(commitMessage)
    
    if (taskIds.length === 0) {
      console.log(`No task IDs found in commit: ${commit.id.substring(0, 7)} - "${commitMessage}"`)
      return
    }

    console.log(`Found task IDs in commit ${commit.id.substring(0, 7)}: ${taskIds.join(', ')}`)

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
  commit: any,
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
      .eq('github_id', commit.id)
      .eq('task_id', taskId)
      .single()

    if (existingCommit) {
      console.log(`Commit ${commit.id.substring(0, 7)} already linked to task ${taskId}`)
      return
    }

    // Store new commit reference
    const { data, error } = await supabaseAdmin
      .from('github_references')
      .insert({
        task_id: taskId,
        repository_id: repositoryId,
        github_type: 'commit',
        github_id: commit.id,
        title: commit.message.substring(0, 255),
        description: commit.message,
        url: commit.url,
        status: 'committed',
        author: commit.author.name || commit.author.username,
        metadata: {
          author_email: commit.author.email,
          commit_date: commit.timestamp,
          full_sha: commit.id,
          branch_name: branchName,
          auto_linked_via_pattern: true,
          detected_patterns: extractTaskIds(commit.message),
          added_files: commit.added || [],
          modified_files: commit.modified || [],
          removed_files: commit.removed || []
        }
      })
      .select()
      .single()

    if (error) {
      console.error('Error storing commit reference:', error)
      return
    }

    console.log(`Auto-linked commit ${commit.id.substring(0, 7)} to task ${taskId} (${task.title})`)

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