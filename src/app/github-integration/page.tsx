'use client'
// src/app/github-integration/page.tsx
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

interface Repository {
  id: number
  full_name: string
  name: string
  owner: string
  private: boolean
  description: string | null
  default_branch: string
  html_url: string
  connected: boolean
}


function RepositoryManager() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(false)
  const [connecting, setConnecting] = useState<string | null>(null)

  const fetchRepositories = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/github/repositories')
      const data = await response.json()
      setRepositories(data.repositories || [])
    } catch (error) {
      console.error('Failed to fetch repositories:', error)
    } finally {
      setLoading(false)
    }
  }

  const connectRepository = async (fullName: string) => {
    setConnecting(fullName)
    try {
      const response = await fetch('/api/github/repositories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName }) // No project_id
      })
      
      if (response.ok) {
        await fetchRepositories() // Refresh the list
      } else {
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

  useEffect(() => {
    fetchRepositories()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Your GitHub Repositories</h3>
        <button
          onClick={fetchRepositories}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading repositories...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {repositories.map((repo) => (
            <div key={repo.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{repo.full_name}</h4>
                    {repo.private && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        Private
                      </span>
                    )}
                    {repo.connected && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        Connected
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Default branch: {repo.default_branch}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    View on GitHub
                  </a>
                  
                  {!repo.connected && (
                    <button
                      onClick={() => connectRepository(repo.full_name)}
                      disabled={connecting === repo.full_name}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      {connecting === repo.full_name ? 'Connecting...' : 'Connect'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BranchCreator() {
  const [taskId, setTaskId] = useState('')
  const [taskTitle, setTaskTitle] = useState('')
  const [repositoryFullName, setRepositoryFullName] = useState('')
  const [baseBranch, setBaseBranch] = useState('main')
  const [creating, setCreating] = useState(false)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)

  console.log('Form state:', { taskId, taskTitle, repositoryFullName, baseBranch }) // Debug log

  const createBranch = async () => {
    console.log('Create branch clicked') // Debug log
    
    if (!taskId || !taskTitle || !repositoryFullName) {
      alert('Please fill in all required fields')
      return
    }

    setCreating(true)
    setResult(null)

    try {
      const response = await fetch('/api/github/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          task_title: taskTitle,
          repository_full_name: repositoryFullName,
          base_branch: baseBranch
        })
      })

      const data = await response.json()
      console.log('API response:', data) // Debug log
      setResult(data)

      if (response.ok) {
        // Clear form on success
        setTaskId('')
        setTaskTitle('')
        setRepositoryFullName('')
        setBaseBranch('main')
      }
    } catch (error) {
      console.error('Create branch error:', error) // Debug log
      setResult({ message: 'Failed to create branch', error: 'Network error' })
    } finally {
      setCreating(false)
    }
  }

  const handleTaskIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Task ID changing to:', e.target.value) // Debug log
    setTaskId(e.target.value)
  }

  const handleTaskTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Task title changing to:', e.target.value) // Debug log
    setTaskTitle(e.target.value)
  }

  const handleRepositoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Repository changing to:', e.target.value) // Debug log
    setRepositoryFullName(e.target.value)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Create Branch for Task</h3>
      
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="taskId">
            Task ID *
          </label>
          <input
            id="taskId"
            type="text"
            value={taskId}
            onChange={handleTaskIdChange}
            placeholder="e.g., 123 or paste a UUID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoComplete="off"
          />
          <p className="text-xs text-gray-500 mt-1">Current value: &quot;{taskId}&quot;</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="taskTitle">
            Task Title *
          </label>
          <input
            id="taskTitle"
            type="text"
            value={taskTitle}
            onChange={handleTaskTitleChange}
            placeholder="e.g., Add user authentication"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoComplete="off"
          />
          <p className="text-xs text-gray-500 mt-1">Current value: &quot;{taskTitle}&quot;</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="repository">
            Repository *
          </label>
          <input
            id="repository"
            type="text"
            value={repositoryFullName}
            onChange={handleRepositoryChange}
            placeholder="e.g., Shree0310/Achievr"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoComplete="off"
          />
          <p className="text-xs text-gray-500 mt-1">Current value: &quot;{repositoryFullName}&quot;</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="baseBranch">
            Base Branch
          </label>
          <input
            id="baseBranch"
            type="text"
            value={baseBranch}
            onChange={(e) => setBaseBranch(e.target.value)}
            placeholder="main"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoComplete="off"
          />
        </div>

        <button
          type="button"
          onClick={createBranch}
          disabled={creating}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {creating ? 'Creating Branch...' : 'Create Branch'}
        </button>

        {/* Debug info */}
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          <strong>Debug Info:</strong><br/>
          Task ID: &quot;{taskId}&quot;<br/>
          Task Title: &quot;{taskTitle}&quot;<br/>
          Repository: &quot;{repositoryFullName}&quot;<br/>
          Base Branch: &quot;{baseBranch}&quot;<br/>
          Form valid: {taskId && taskTitle && repositoryFullName ? 'Yes' : 'No'}
        </div>
      </div>

      {result && (
        <div className={`p-4 rounded border ${
          result.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
        }`}>
          <p className={`font-medium ${result.error ? 'text-red-800' : 'text-green-800'}`}>
            {String(result.message)}
          </p>
          {(result.branch as Record<string, unknown>) && (
            <div className="mt-2 text-sm">
              <p><strong>Branch:</strong> {String((result.branch as Record<string, unknown>).name)}</p>
              <a 
                href={String((result.branch as Record<string, unknown>).url)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View on GitHub →
              </a>
            </div>
          )}
          {(result.error as string) && (
            <p className="text-red-600 text-sm mt-1">{String(result.error)}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function GitHubIntegrationPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600">
            Please sign in to manage GitHub integration.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            GitHub Integration Management
          </h1>
          <p className="text-gray-600 mb-8">
            Connect repositories and create branches for your tasks.
          </p>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <RepositoryManager />
            </div>
            
            <div>
              <BranchCreator />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}