"use client"
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

const GithubCommitsList = ({ taskId }) => {
    const [commits, setCommits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (taskId) {
        fetchCommits();
        }
    }, [taskId]);

    const fetchCommits = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const { data: commits, error } = await supabase
                .from('github_references')
                .select(`
                    *,
                    github_repositories (
                    full_name,
                    owner,
                        repo_name,
                        html_url
                    )
                `)
                .eq('task_id', taskId)
                .eq('github_type', 'commit')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            setCommits(commits || []);
            
            // Debug logging
            console.log("Fetched commits:", commits);
            if (commits && commits.length > 0) {
                commits.forEach((commit, index) => {
                    console.log(`Commit ${index + 1}:`, commit);
                });
            }
        } catch (error) {
            console.error("Error while fetching the commits", error);
            setError('Failed to load commits');
        } finally {
            setIsLoading(false);
        }
    }
   
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const truncateMessage = (message, maxLength = 100) => {
        if (message.length <= maxLength) return message;
        return message.substring(0, maxLength) + '...';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-500 dark:text-gray-400">Loading commits...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Commits</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
                <button
                    onClick={fetchCommits}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (commits.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Commits Found</h3>
                <p className="text-gray-500 dark:text-gray-400">No GitHub commits have been linked to this task yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    GitHub Commits ({commits.length})
                </h3>
                <button
                    onClick={fetchCommits}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                    Refresh
                </button>
            </div>

            <div className="space-y-3">
                {commits.map((commit) => (
                    <div
                        key={commit.id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                {/* Commit Info */}
                                <div className="flex items-start space-x-3 mb-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {commit.github_id ? commit.github_id.substring(0, 8) : 'Unknown'}
                                            </h4>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                                {commit.github_id}
                                            </span>
                                        </div>
                                        {commit.title && (
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                                {truncateMessage(commit.title)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Repository Info */}
                                {commit.github_repositories && (
                                    <div className="flex items-center space-x-2 mb-3">
                                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            {commit.github_repositories.full_name}
                                        </span>
                                    </div>
                                )}

                                {/* Metadata */}
                                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center space-x-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>{commit.author || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{formatDate(commit.created_at)}</span>
                                    </div>
                                    {commit.metadata?.branch && (
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>on {commit.metadata.branch}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col items-end space-y-2">
                                {commit.url && (
                                    <a
                                        href={commit.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        <span>View on GitHub</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
    </div>
    );
}
export default GithubCommitsList;