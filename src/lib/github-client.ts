// Client-side GitHub API wrapper
import { supabase } from '@/utils/supabase/client'

export class GitHubClient {
  private async getAuthHeaders() {
    // Check if we're in demo mode
    if (typeof window !== 'undefined') {
      const demoMode = localStorage.getItem('demoMode')
      const demoUser = localStorage.getItem('demoUser')
      
      console.log('Demo mode check:', { demoMode, demoUser })
      
      if (demoMode === 'true' && demoUser) {
        const user = JSON.parse(demoUser)
        console.log('Demo user data:', user)
        console.log('User metadata:', user.user_metadata)
        
        const githubToken = user.user_metadata?.github_access_token || user.user_metadata?.access_token
        
        if (githubToken) {
          console.log('Using demo mode with GitHub token:', githubToken.substring(0, 10) + '...')
          return {
            'Authorization': `Bearer ${githubToken}`,
            'Content-Type': 'application/json'
          }
        } else {
          console.log('No GitHub token found in demo user metadata')
        }
      }
    }
    
    // Try to get Supabase session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user?.user_metadata?.github_access_token) {
      console.log('Using Supabase session with GitHub token')
      return {
        'Authorization': `Bearer ${session.user.user_metadata.github_access_token}`,
        'Content-Type': 'application/json'
      }
    }
    
    throw new Error('No GitHub access token found')
  }
  
  async createBranch(data: {
    task_id: string
    repository_full_name: string
    task_title: string
    base_branch?: string
  }) {
    try {
      const headers = await this.getAuthHeaders()
      
      const response = await fetch('/api/github/branches', {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type')
        console.log('Error response content type:', contentType)
        
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json()
          console.log('Error response JSON:', error)
          throw new Error(error.message || 'Failed to create branch')
        } else {
          const errorText = await response.text()
          console.log('Error response text:', errorText.substring(0, 500))
          throw new Error(`Server error: ${response.status} ${response.statusText}`)
        }
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error creating branch:', error)
      throw error
    }
  }
  
  async listBranches(task_id: string) {
    try {
      const headers = await this.getAuthHeaders()
      
      const response = await fetch(`/api/github/branches?task_id=${task_id}`, {
        method: 'GET',
        headers
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to list branches')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error listing branches:', error)
      throw error
    }
  }
  
  async testConnection() {
    try {
      const headers = await this.getAuthHeaders()
      
      const response = await fetch('/api/github/test', {
        method: 'GET',
        headers
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to test connection')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error testing connection:', error)
      throw error
    }
  }
}

export const githubClient = new GitHubClient()
