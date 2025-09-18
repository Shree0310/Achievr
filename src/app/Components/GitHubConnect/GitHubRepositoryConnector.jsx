"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase/client'

const GitHubRepositoryConnector = () => {
  console.log('GitHubRepositoryConnector: Component rendered')
  
  const [repositories, setRepositories] = useState([])
  const [loading, setLoading] = useState(false)
  const [connecting, setConnecting] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [user, setUser] = useState(null)
  const [hasAuth, setHasAuth] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    // Check for authentication (Supabase or demo mode only)
    const checkAuth = async () => {
      console.log('GitHubRepositoryConnector: Starting authentication check...')
      
      // Check for demo user first (highest priority)
      const demoUser = localStorage.getItem('demoUser')
      if (demoUser) {
        const parsedDemoUser = JSON.parse(demoUser)
        if (parsedDemoUser.user_metadata?.access_token) {
          console.log('GitHubRepositoryConnector: Demo user with GitHub token found')
          setHasAuth(true)
          return
        } else {
          console.log('GitHubRepositoryConnector: Demo user found but no GitHub token')
        }
      }
      
      // Check for Supabase user with GitHub data
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        if (user.user_metadata?.github_access_token) {
          console.log('GitHubRepositoryConnector: Supabase user with GitHub token found:', user.email)
          setUser(user)
          setHasAuth(true)
          return
        } else {
          console.log('GitHubRepositoryConnector: Supabase user found but no GitHub token:', user.email)
        }
      }
      
      console.log('GitHubRepositoryConnector: No authentication found')
      setHasAuth(false)
    }
    
    // Debug logging
    console.log('GitHubRepositoryConnector: Checking authentication...')
    
    checkAuth().finally(() => {
      setIsCheckingAuth(false)
    })

    // Listen for localStorage changes (demo login)
    const handleStorageChange = (e) => {
      if (e.key === 'demoUser') {
        checkAuth()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for same-tab changes
    const handleCustomStorageChange = () => {
      checkAuth()
    }
    
    window.addEventListener('demoUserChanged', handleCustomStorageChange)
    
    // Check for authentication changes periodically (useful after OAuth redirects)
    const authCheckInterval = setInterval(() => {
      if (!hasAuth) {
        checkAuth()
      }
    }, 2000) // Check every 2 seconds if not authenticated
    
    // Check for GitHub OAuth callback in URL
    const checkForGitHubCallback = () => {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has('github_token_ready') || urlParams.has('github_connected')) {
        console.log('GitHub OAuth callback detected, checking authentication...')
        // Delay slightly to allow the OAuth callback to complete
        setTimeout(() => {
          checkAuth()
        }, 1000)
      }
    }
    
    // Check immediately and on URL changes
    checkForGitHubCallback()
    window.addEventListener('popstate', checkForGitHubCallback)
    
    // Also check on page visibility change (when user comes back from OAuth)
    const handleVisibilityChange = () => {
      if (!document.hidden && !hasAuth) {
        console.log('Page became visible, checking authentication...')
        checkAuth()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('demoUserChanged', handleCustomStorageChange)
      window.removeEventListener('popstate', checkForGitHubCallback)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(authCheckInterval)
    }
  }, [])

  const fetchRepositories = async () => {
    setLoading(true)
    try {
      // Check for demo user first (localStorage)
      const demoUser = localStorage.getItem('demoUser')
      let response
      
      if (demoUser) {
        const githubToken = JSON.parse(demoUser).user_metadata?.access_token
        if (githubToken) {
          // Use demo mode with Authorization header
          response = await fetch('/api/github/repositories', {
            headers: {
              'Authorization': `Bearer ${githubToken}`
            }
          })
        } else {
          console.log('No GitHub token in demo user')
          return
        }
      } else if (user) {
        // Use Supabase authentication
        response = await fetch('/api/github/repositories')
      } else {
        console.log('No authentication found (neither demo user nor Supabase user)')
        return
      }
      
      if (response && response.ok) {
        const data = await response.json()
        setRepositories(data.repositories || [])
      } else if (response) {
        const error = await response.json()
        console.error('Failed to fetch repositories:', error)
        // If it's a 401, show a message to connect GitHub
        if (response.status === 401) {
          setRepositories([])
        }
      }
    } catch (error) {
      console.error('Failed to fetch repositories:', error)
    } finally {
      setLoading(false)
    }
  }

  const connectRepository = async (fullName) => {
    setConnecting(fullName)
    try {
      // Check for demo user first (localStorage)
      const demoUser = localStorage.getItem('demoUser')
      let response
      
      if (demoUser) {
        const githubToken = JSON.parse(demoUser).user_metadata?.access_token
        if (githubToken) {
          // Use demo mode with Authorization header
          response = await fetch('/api/github/repositories', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${githubToken}`
            },
            body: JSON.stringify({ full_name: fullName })
          })
        } else {
          alert('No GitHub token found. Please connect your GitHub account first.')
          return
        }
      } else if (user) {
        // Use Supabase authentication
        response = await fetch('/api/github/repositories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name: fullName })
        })
      } else {
        alert('Please authenticate first')
        return
      }
      
      if (response && response.ok) {
        await fetchRepositories() // Refresh the list
      } else if (response) {
        const error = await response.json()
        alert(`Failed to connect repository: ${error.message}`)
      }
    } catch (error) {
      console.error('Failed to connect repository:', error)
      alert('Failed to connect repository')
    } finally {
      setConnecting(null)
    }
  }

  const disconnectRepository = async (fullName) => {
    try {
      // Check for demo user first (localStorage)
      const demoUser = localStorage.getItem('demoUser')
      let response
      
      if (demoUser) {
        const githubToken = JSON.parse(demoUser).user_metadata?.access_token
        if (githubToken) {
          // Use demo mode with Authorization header
          response = await fetch('/api/github/repositories', {
            method: 'DELETE',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${githubToken}`
            },
            body: JSON.stringify({ full_name: fullName })
          })
        } else {
          alert('No GitHub token found. Please connect your GitHub account first.')
          return
        }
      } else if (user) {
        // Use Supabase authentication
        response = await fetch('/api/github/repositories', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name: fullName })
        })
      } else {
        alert('Please authenticate first')
        return
      }
      
      if (response && response.ok) {
        await fetchRepositories() // Refresh the list
      } else if (response) {
        const error = await response.json()
        alert(`Failed to disconnect repository: ${error.message}`)
      }
    } catch (error) {
      console.error('Failed to disconnect repository:', error)
      alert('Failed to disconnect repository')
    }
  }

  // Load repositories when dropdown opens
  const handleDropdownToggle = () => {
    if (!showDropdown && repositories.length === 0) {
      fetchRepositories()
    }
    setShowDropdown(!showDropdown)
  }

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors text-gray-600 dark:text-white w-full">
        <svg
          className="mr-3 h-5 w-5 text-gray-400 dark:text-white animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="flex-1 text-left">Loading...</span>
      </div>
    )
  }

  if (!hasAuth) {
    console.log('GitHubRepositoryConnector: No authentication found, hiding component')
    return null // Don't show if user is not authenticated
  }
  
  console.log('GitHubRepositoryConnector: Authentication found, showing component')

  const connectedRepos = repositories.filter(repo => repo.connected)
  const unconnectedRepos = repositories.filter(repo => !repo.connected)

  return (
    <div className="relative">
      <button
        onClick={handleDropdownToggle}
        className="group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-white dark:hover:text-gray-900 dark:hover:bg-gray-700 w-full"
      >
        <svg
          className="mr-3 h-5 w-5 text-gray-400 dark:text-white group-hover:text-gray-900 dark:group-hover:text-gray-900"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
        </svg>
        <span className="flex-1 text-left">GitHub Repos</span>
        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {connectedRepos.length}
        </span>
        <svg
          className={`ml-2 h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Connected Repositories</h3>
          </div>
          
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading repositories...</p>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {/* Connected Repositories */}
              {connectedRepos.length > 0 && (
                <div className="p-2">
                  {connectedRepos.map((repo) => (
                    <div key={repo.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {repo.full_name}
                        </p>
                        {repo.private && (
                          <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
                        )}
                      </div>
                      <button
                        onClick={() => disconnectRepository(repo.full_name)}
                        className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded"
                        title="Disconnect"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Unconnected Repositories */}
              {unconnectedRepos.length > 0 && (
                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 mb-2 px-2">Available to connect:</p>
                  {unconnectedRepos.slice(0, 5).map((repo) => (
                    <div key={repo.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {repo.full_name}
                        </p>
                      </div>
                      <button
                        onClick={() => connectRepository(repo.full_name)}
                        disabled={connecting === repo.full_name}
                        className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 rounded disabled:opacity-50"
                        title="Connect"
                      >
                        {connecting === repo.full_name ? '...' : '+'}
                      </button>
                    </div>
                  ))}
                  {unconnectedRepos.length > 5 && (
                    <p className="text-xs text-gray-400 px-2 py-1">
                      +{unconnectedRepos.length - 5} more repositories
                    </p>
                  )}
                </div>
              )}

              {repositories.length === 0 && !loading && (
                <div className="p-4 text-center text-gray-500">
                  <p className="text-sm">No repositories found</p>
                  <p className="text-xs mt-1">Connect your GitHub account to see repositories</p>
                  <a 
                    href="/api/github/oauth/initiate"
                    className="text-xs text-blue-500 hover:text-blue-700 mt-2 inline-block"
                  >
                    Connect GitHub →
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={fetchRepositories}
              className="text-xs text-blue-500 hover:text-blue-700 w-full text-left"
            >
              Refresh repositories
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GitHubRepositoryConnector
