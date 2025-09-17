// app/api/github/oauth/apply-temp-data/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Get Supabase client
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
        },
      }
    )

    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session?.user) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get temporary GitHub data from cookie
    const tempGitHubData = cookieStore.get('temp_github_data')
    console.log('Looking for temp GitHub data cookie:', tempGitHubData)
    
    if (!tempGitHubData) {
      console.log('No temporary GitHub data found in cookies')
      return NextResponse.json(
        { message: 'No temporary GitHub data found' },
        { status: 404 }
      )
    }

    const githubData = JSON.parse(tempGitHubData.value)

    // Update user metadata with GitHub access token
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        github_access_token: githubData.access_token,
        github_id: githubData.github_id,
        github_username: githubData.github_username,
        github_name: githubData.github_name,
        github_avatar_url: githubData.github_avatar_url,
      }
    })

    if (updateError) {
      console.error('Failed to update user metadata:', updateError)
      return NextResponse.json(
        { message: 'Failed to save GitHub connection', error: updateError.message },
        { status: 500 }
      )
    }

    // Clear the temporary cookie
    const response = NextResponse.json({ message: 'GitHub data applied successfully' })
    response.cookies.delete('temp_github_data')

    return response

  } catch (error) {
    console.error('Apply temporary GitHub data error:', error)
    return NextResponse.json(
      { message: 'Failed to apply GitHub data', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
