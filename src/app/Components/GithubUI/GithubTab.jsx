"use client"
import { useState } from "react";
import GithubBranchCreator from "@/app/Components/GithubUI/GithubBranchCreator";
import GithubBranchList from "@/app/Components/GithubUI/GithubBranchList";
import GithubCommitsList from "@/app/Components/GithubUI/GithubCommitsList";

const GithubTab = ({taskToEdit, userId }) => {
    const [isBranchesMode, setIsBranchesMode] = useState(false);
    const [isCommitsMode, setIsCommitsMode] = useState(false);
    const [isPRMode, setIsPRMode] = useState(false);
    const [branches, setBranches] = useState(null);

    const handleBranchesClick = () => {
        setIsBranchesMode(!isBranchesMode);
        if(!isBranchesMode){
            setIsCommitsMode(false);
        }
    }

    const handleCommitsClick = () => {
        setIsCommitsMode(!isCommitsMode);
        if(!isCommitsMode){
            setIsPRMode(false);
        }
    }

    const handlePRClick = () => {
        setIsPRMode(!isPRMode);
        if(!isPRMode){
            setIsCommitsMode(false);
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">GitHub Integration</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage branches, commits, and pull requests for this task</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => handleBranchesClick()}
                        className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            isBranchesMode && !isCommitsMode && !isPRMode
                                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Branches</span>
                    </button>

                    <button
                        onClick={() => handleCommitsClick()}
                        className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            isCommitsMode && !isPRMode
                                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Commits</span>
                    </button>

                    <button
                        onClick={() => handlePRClick()}
                        className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            isPRMode && !isCommitsMode
                                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>Pull Requests</span>
                    </button>
                </nav>
            </div>

            {/* Content Area */}
            <div className="p-6">
                {isBranchesMode && !isCommitsMode && !isPRMode && (
                    <div className="space-y-6">
                        <GithubBranchCreator taskToEdit={taskToEdit} userId={userId} />
                        <GithubBranchList taskId={taskToEdit.id} />
                    </div>
                )}

                {isCommitsMode && !isPRMode && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Commits</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Track commits related to this task</p>
                        <div className="text-sm text-gray-400 dark:text-gray-500">
                            Coming soon...
                        </div>
                        <div>
                            <GithubCommitsList taskId={taskToEdit.id}/>
                        </div>
                    </div>
                )}

                {isPRMode && !isCommitsMode && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Pull Requests</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Manage pull requests for this task</p>
                        <div className="text-sm text-gray-400 dark:text-gray-500">
                            Coming soon...
                        </div>
                    </div>
                )}

                {!isBranchesMode && !isCommitsMode && !isPRMode && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">GitHub Integration</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Select a tab above to get started with GitHub features</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => handleBranchesClick()}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Create Branch</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default GithubTab;