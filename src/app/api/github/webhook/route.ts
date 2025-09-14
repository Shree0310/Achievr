// app/api/github/webhook/route.ts
import { supabaseAdmin } from '../../../../lib/supabase'
import { handlePushEvent } from '../../../../lib/github-webhooks/push-handler'
import { handlePullRequestEvent } from '../../../../lib/github-webhooks/pr-handler'
import crypto from 'crypto'

// GET: Test endpoint to verify webhook is working
export async function GET() {
  console.log('🧪 Webhook test endpoint called')
  
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase client is not initialized');
    }
    // Test Supabase connection
    const { error } = await supabaseAdmin
      .from('github_repositories')
      .select('count')
      .limit(1);
    if (error) {
      console.error('❌ Supabase test failed:', error)
      return Response.json(
        { 
          message: 'Webhook test failed', 
          error: error.message,
          supabaseError: true 
        }, 
        { status: 500 }
      )
    }
    
    console.log('✅ Supabase connection test successful')
    return Response.json({ 
      message: 'Webhook is working!', 
      supabaseConnected: true,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: unknown) {
    console.error('💥 Webhook test error:', error)
    return Response.json(
      { 
        message: 'Webhook test failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}

// POST: Handle GitHub webhook events
export async function POST(request: Request) {
  console.log('🚀 Webhook endpoint called')
  
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
      console.log('⚠️ No webhooks secret configured - skipping signature verification')
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

    // Handle different GitHub events
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
      
    } else if (event === 'pull_request') {
      console.log('🔀 Processing pull request event...')
      
      // Validate PR payload structure
      if (!payload.repository || !payload.repository.full_name) {
        console.error('❌ Invalid PR payload: missing repository information')
        return Response.json({ message: 'Invalid PR payload: missing repository' }, { status: 400 })
      }
      
      if (!payload.pull_request) {
        console.error('❌ Invalid PR payload: missing pull request information')
        return Response.json({ message: 'Invalid PR payload: missing pull request' }, { status: 400 })
      }
      
      await handlePullRequestEvent(payload)
      
    } else if (event === 'ping') {
      console.log('🏓 Received ping event - webhook is working!')
      return Response.json({ message: 'Webhook ping received successfully' })
    } else {
      console.log(`⏭️  Skipping event type: ${event}`)
    }

    console.log('✅ Webhook processed successfully')
    return Response.json({ message: 'Webhook processed successfully' })

  } catch (error: unknown) {
    console.error('💥 Webhook error:', error)
    console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorName = error instanceof Error ? error.name : 'Unknown'
    
    console.error('💥 Error name:', errorName)
    console.error('💥 Error message:', errorMessage)
    
    // Check if it's a Supabase connection error
    if (errorMessage.includes('supabase') || errorMessage.includes('database')) {
      console.error('💥 Database connection error detected')
      return Response.json(
        { message: 'Database connection failed', error: errorMessage },
        { status: 503 }
      )
    }
    
    // Return more specific error messages based on error type
    if (errorName === 'SyntaxError') {
      return Response.json(
        { message: 'Invalid JSON payload', error: 'Malformed JSON' },
        { status: 400 }
      )
    }
    
    return Response.json(
      { message: 'Webhook processing failed', error: errorMessage },
      { status: 500 }
    )
  }
}
