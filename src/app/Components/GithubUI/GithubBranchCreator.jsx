"use client"
import { useState } from "react";
function GithubBranchCreator({taskToEdit, userId}) {
  const [taskId, setTaskId] = useState('')
  const [taskTitle, setTaskTitle] = useState('')
  const [repositoryFullName, setRepositoryFullName] = useState('')
  const [baseBranch, setBaseBranch] = useState('main')
  const [creating, setCreating] = useState(false)
  const [result, setResult] = useState(null)

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
          task_id: taskToEdit.id,
          task_title: taskToEdit.title,
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

  const handleTaskIdChange = (e) => {
    console.log('Task ID changing to:', e.target.value) // Debug log
    setTaskId(e.target.value)
  }

  const handleTaskTitleChange = (e) => {
    console.log('Task title changing to:', e.target.value) // Debug log
    setTaskTitle(e.target.value)
  }

  const handleRepositoryChange = (e) => {
    console.log('Repository changing to:', e.target.value) // Debug log
    setRepositoryFullName(e.target.value)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create GitHub Branch</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Link this task to a new GitHub branch</p>
        </div>
      </div>

      {/* Task Info Card */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <span className="text-orange-600 dark:text-orange-400 font-medium text-sm">T</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Task #{taskToEdit.id}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{taskToEdit.title}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="repository">
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              <span>Repository</span>
              <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            id="repository"
            type="text"
            value={repositoryFullName}
            onChange={handleRepositoryChange}
            placeholder="username/repository-name"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors"
            autoComplete="off"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Enter the full repository name (e.g., Shree0310/Achievr)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="baseBranch">
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Base Branch</span>
            </span>
          </label>
          <input
            id="baseBranch"
            type="text"
            value={baseBranch}
            onChange={(e) => setBaseBranch(e.target.value)}
            placeholder="main"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors"
            autoComplete="off"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            The branch to create your new branch from
          </p>
        </div>

        <button
          type="button"
          onClick={createBranch}
          disabled={creating || !repositoryFullName.trim()}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
        >
          {creating ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creating Branch...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create Branch</span>
            </>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className={`mt-6 p-4 rounded-lg border ${
          result.error 
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
            : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        }`}>
          <div className="flex items-start space-x-3">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
              result.error ? 'bg-red-100 dark:bg-red-900/40' : 'bg-green-100 dark:bg-green-900/40'
            }`}>
              {result.error ? (
                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${result.error ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}`}>
                {result.message}
              </p>
              {result.branch && (
                <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Branch: <span className="font-mono text-blue-600 dark:text-blue-400">{result.branch.name}</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Successfully created and ready for development
                      </p>
                    </div>
                    <a 
                      href={result.branch.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span>View on GitHub</span>
                    </a>
                  </div>
                </div>
              )}
              {result.error && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-2">{result.error}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GithubBranchCreator;