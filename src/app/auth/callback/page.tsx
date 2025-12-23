'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🚀 Auth callback started, current URL:', window.location.href)
        
        // Check for auth error in URL
         const searchParams = new URLSearchParams(window.location.search)
        const hashString = typeof window !== 'undefined' && window.location.hash.startsWith('#') ? window.location.hash.slice(1) : ''
        const hashParams = new URLSearchParams(hashString)
        const getParam = (key: string) => searchParams.get(key) ?? hashParams.get(key)
        
         // Check for auth error in URL
        const error = getParam('error')
        const errorDescription = getParam('error_description')
        
        if (error) {
          console.error('OAuth error in callback:', error, errorDescription)
          router.push('/auth?error=oauth_error&description=' + encodeURIComponent(errorDescription || error))
          return
        }
        
        /// Check if we're coming from Supabase callback (has access_token in URL or hash)
        const accessToken = getParam('access_token')
        const refreshToken = getParam('refresh_token')
        
        if (accessToken && refreshToken) {
          console.log('Detected Supabase callback with tokens, setting session...')
          // Set the session manually
          const { data, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          
          if (setSessionError) {
            console.error('Error setting session:', setSessionError)
            router.push('/auth?error=session_error')
            return
          }
          
          console.log('Session set successfully:', data)
        }
        
        const { data, error: sessionError } = await supabase.auth.getSession()
        
        console.log('Auth callback session check:', {
          hasSession: !!data.session,
          hasUser: !!data.session?.user,
          userEmail: data.session?.user?.email,
          sessionError: sessionError?.message
        })
        
        if (sessionError) {
          console.error('Auth callback session error:', sessionError)
          router.push('/auth?error=auth_callback_failed')
          return
        }

        if (data.session) {
          // User is authenticated, check for temporary GitHub data
          console.log('User authenticated in callback, checking for GitHub data...')
          await applyTemporaryGitHubData(data.session.user)
          
          // Wait a moment for the GitHub data to be applied
          setTimeout(() => {
            // Force redirect to localhost board if running locally
            if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
              window.location.href = 'http://localhost:3000/board'
            } else {
              router.push('/board')
            }
          }, 1000)
        } else {
          // No session, redirect to auth page
          console.log('No session found in callback, redirecting to auth')
          if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            window.location.href = 'http://localhost:3000/auth'
          } else {
            router.push('/auth')
          }
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error)
        router.push('/auth?error=unexpected_error')
      }
    }

    // Function to apply temporary GitHub data after authentication
    const applyTemporaryGitHubData = async () => {
      try {
        // Check for pending GitHub data first (from Google OAuth flow)
        let tempData = localStorage.getItem('pending_github_data')
        
        // Fallback to temp_github_data (from direct GitHub OAuth)
        if (!tempData) {
          tempData = localStorage.getItem('temp_github_data')
        }
        if (!tempData) {
          tempData = sessionStorage.getItem('temp_github_data')
        }
        
        // Also check URL parameters as backup
        const urlParams = new URLSearchParams(window.location.search)
        const githubTokenReady = urlParams.get('github_token_ready')
        
        if (!tempData && githubTokenReady === 'true') {
          // Reconstruct GitHub data from URL parameters
          tempData = JSON.stringify({
            access_token: urlParams.get('github_access_token'),
            github_id: urlParams.get('github_id'),
            github_username: urlParams.get('github_username'),
            github_name: urlParams.get('github_name'),
            github_avatar_url: urlParams.get('github_avatar_url'),
          })
          console.log('Reconstructed GitHub data from URL parameters:', tempData)
        }
        
        console.log('Checking for temp GitHub data in callback:', tempData)
        if (!tempData) {
          console.log('No temporary GitHub data found in callback')
          return // No temporary data to apply
        }

        const githubData = JSON.parse(tempData)
        console.log('Applying GitHub data in callback:', githubData)

        // Update user metadata with GitHub data
        const { data: updateData, error } = await supabase.auth.updateUser({
          data: {
            github_access_token: githubData.access_token,
            github_id: githubData.github_id,
            github_username: githubData.github_username,
            github_name: githubData.github_name,
            github_avatar_url: githubData.github_avatar_url,
          }
        })

        if (error) {
          console.error('Failed to update user metadata in callback:', error)
        } else {
          console.log('GitHub data applied successfully in callback')
          console.log('Updated user data:', updateData)
          // Clear all temporary data
          localStorage.removeItem('temp_github_data')
          localStorage.removeItem('pending_github_data')
          sessionStorage.removeItem('temp_github_data')
        }
      } catch (error) {
        console.error('Error applying temporary GitHub data in callback:', error)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}
