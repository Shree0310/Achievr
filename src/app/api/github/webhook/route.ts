// app/api/github/webhook/route.ts
import { supabaseAdmin } from '../../../../lib/supabase'
import crypto from 'crypto'

// POST: Handle GitHub webhook events
export async function POST(request: Request) {
  try {
    // Log incoming request details
    console.log('🔍 Webhook request received')
    console.log('📋 Headers:', Object.fromEntries(request.headers.entries()))
    
    const body = await request.text()
    const signature = request.headers.get('x-hub-signature-256')
    const event = request.headers.get('x-github-event')
    
    console.log(`📨 Event type: ${event}`)
    console.log(`🔐 Signature present: ${signature ? 'Yes' : 'No'}`)
    console.log(`📄 Body length: ${body.length}`)

    // Check for empty body
    if (!body || body.trim().length === 0) {
      console.error('❌ Empty request body')
      return Response.json({ message: 'Empty request body' }, { status: 400 })
    }

    // Verify webhook signature (security) - only if secret is configured
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET
    if (webhookSecret) {
      if (!signature) {
        console.error('❌ Missing webhook signature but secret is configured')
        return Response.json({ message: 'Missing webhook signature' }, { status: 401 })
      }
      
      const expectedSignature = `sha256=${crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex')}`
      
      if (signature !== expectedSignature) {
        console.error('❌ Invalid webhook signature')
        console.error(`Expected: ${expectedSignature}`)
        console.error(`Received: ${signature}`)
        return Response.json({ message: 'Invalid signature' }, { status: 401 })
      }
      console.log('✅ Signature verification successful')
    } else {
      console.log('⚠️ No webhook secret configured - skipping signature verification')
    }

    let payload
    try {
      payload = JSON.parse(body)
      console.log('✅ JSON parsing successful')
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError)
      console.error('Body content:', body.substring(0, 200) + '...')
      return Response.json({ message: 'Invalid JSON payload' }, { status: 400 })
    }
    
    console.log(`📨 Received GitHub webhook: ${event}`)

    // Validate required event type
    if (!event) {
      console.error('❌ Missing x-github-event header')
      return Response.json({ message: 'Missing x-github-event header' }, { status: 400 })
    }

    // Basic payload validation
    if (!payload || typeof payload !== 'object') {
      console.error('❌ Invalid payload structure')
      return Response.json({ message: 'Invalid payload structure' }, { status: 400 })
    }

    // Handle push events (when commits are pushed)
    if (event === 'push') {
      console.log('🚀 Processing push event...')
      
      // Validate push payload structure
      if (!payload.repository || !payload.repository.full_name) {
        console.error('❌ Invalid push payload: missing repository information')
        return Response.json({ message: 'Invalid push payload: missing repository' }, { status: 400 })
      }
      
      if (!payload.ref) {
        console.error('❌ Invalid push payload: missing ref information')
        return Response.json({ message: 'Invalid push payload: missing ref' }, { status: 400 })
      }
      
      await handlePushEvent(payload)
    } else if (event === 'ping') {
      console.log('🏓 Received ping event - webhook is working!')
      return Response.json({ message: 'Webhook ping received successfully' })
    } else {
      console.log(`⏭️  Skipping event type: ${event}`)
    }

    console.log('✅ Webhook processed successfully')
    return Response.json({ message: 'Webhook processed successfully' })

  } catch (error: any) {
    console.error('💥 Webhook error:', error)
    console.error('💥 Error stack:', error.stack)
    
    // Return more specific error messages based on error type
    if (error.name === 'SyntaxError') {
      return Response.json(
        { message: 'Invalid JSON payload', error: 'Malformed JSON' },
        { status: 400 }
      )
    }
    
    return Response.json(
      { message: 'Webhook processing failed', error: error.message },
      { status: 500 }
    )
  }
}

async function handlePushEvent(payload: any) {
  try {
    const repositoryFullName = payload.repository.full_name
    const branchName = payload.ref.replace('refs/heads/', '')
    const commits = payload.commits || []

    console.log(`🔄 Push to ${repositoryFullName}:${branchName} with ${commits.length} commits`)

    // Handle branch deletion
    if (payload.deleted) {
      console.log(`🗑️ Branch ${branchName} was deleted, skipping processing`)
      return
    }

    // Handle empty commits (force push or branch creation)
    if (commits.length === 0) {
      console.log(`📭 No commits in this push (likely branch creation or force push)`)
      return
    }

    // Get repository info from database
    const { data: repository, error: repoError } = await supabaseAdmin
      .from('github_repositories')
      .select('id, full_name')
      .eq('full_name', repositoryFullName)
      .single()

    if (repoError) {
      console.error('❌ Error querying repository:', repoError)
      throw new Error(`Failed to query repository: ${repoError.message}`)
    }

    if (!repository) {
      console.log(`📝 Repository ${repositoryFullName} not connected to our system, skipping`)
      return
    }

    // Process each commit and look for task ID patterns
    for (const commit of commits) {
      if (!commit || !commit.id || !commit.message) {
        console.log(`⚠️ Skipping malformed commit:`, commit)
        continue
      }
      
      try {
        await processCommitForTaskReferences(
          commit,
          repository.id,
          repositoryFullName,
          branchName
        )
      } catch (commitError) {
        console.error(`❌ Error processing commit ${commit.id?.substring(0, 7)}:`, commitError)
        // Continue with other commits even if one fails
      }
    }

  } catch (error) {
    console.error('❌ Error handling push event:', error)
    throw error // Re-throw to be caught by main handler
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
      console.error('Error storing commit references:', error)
      return
    }

    console.log(`✅ Auto-linked commit ${commit.id.substring(0, 7)} to task ${taskId} (${task.title})`)

  } catch (error) {
    console.error('Error linking commit to task:', error)
  }
}