'use client'
// src/app/github-test/page.tsx
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'

interface TestResult {
  message: string
  user?: {
    login: string
    name: string
    public_repos: number
  }
  recent_repos?: Array<{
    name: string
    full_name: string
    private: boolean
    updated_at: string
  }>
  error?: string
}

function GitHubAuth() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  if (session) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={session.user?.image || ''} 
              alt="Profile" 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-green-800">
                Signed in as {session.user?.name}
              </p>
              <p className="text-sm text-green-600">
                {session.user?.email}
              </p>
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
      <p className="mb-4 text-gray-600">Sign in with GitHub to test the integration</p>
      <button 
        onClick={() => signIn('github')}
        className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
        </svg>
        Sign in with GitHub
      </button>
    </div>
  )
}

function GitHubConnectionTest() {
  const { data: session } = useSession()
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setTestResult(null)
    
    try {
      const response = await fetch('/api/github/test')
      const data = await response.json()
      setTestResult(data)
    } catch (error: unknown) {
      setTestResult({ 
        message: 'Test failed', 
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">Please sign in first to test GitHub API connection</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">GitHub API Connection Test</h3>
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Testing...
            </div>
          ) : (
            'Test GitHub Connection'
          )}
        </button>
      </div>

      {testResult && (
        <div className={`border rounded-lg p-4 ${
          testResult.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
        }`}>
          <h4 className={`font-medium mb-2 ${
            testResult.error ? 'text-red-800' : 'text-green-800'
          }`}>
            Test Results:
          </h4>
          
          {testResult.error ? (
            <div className="text-red-600">
              <p><strong>Error:</strong> {testResult.error}</p>
              <p className="text-sm mt-1">{testResult.message}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-green-600">
                <p><strong>Status:</strong> {testResult.message}</p>
              </div>
              
              {testResult.user && (
                <div className="bg-white rounded p-3 border">
                  <h5 className="font-medium text-gray-800 mb-2">GitHub User Info:</h5>
                  <div className="text-sm space-y-1">
                    <p><strong>Username:</strong> {testResult.user.login}</p>
                    <p><strong>Name:</strong> {testResult.user.name}</p>
                    <p><strong>Public Repos:</strong> {testResult.user.public_repos}</p>
                  </div>
                </div>
              )}
              
              {testResult.recent_repos && testResult.recent_repos.length > 0 && (
                <div className="bg-white rounded p-3 border">
                  <h5 className="font-medium text-gray-800 mb-2">Recent Repositories:</h5>
                  <div className="space-y-2">
                    {testResult.recent_repos.map((repo, index) => (
                      <div key={index} className="text-sm border-l-2 border-blue-200 pl-3">
                        <p className="font-medium">{repo.full_name}</p>
                        <p className="text-gray-600">
                          {repo.private ? '🔒 Private' : '🌍 Public'} • 
                          Updated: {new Date(repo.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function GitHubTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            GitHub Integration Test
          </h1>
          <p className="text-gray-600 mb-8">
            Test your GitHub OAuth setup and API connection for the task management integration.
          </p>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                1. Authentication Status
              </h2>
              <GitHubAuth />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                2. API Connection Test
              </h2>
              <GitHubConnectionTest />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}