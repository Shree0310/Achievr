"use client"

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import DiffChecker from "@/app/Components/DiffChecker/DiffChecker";

const CommentHistoryDialog = ({ comment, isOpen, onClose, formatDateTime }) => {
  if (!isOpen) return null;

  const [commentHistoryData, setCommentHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchCommentHistory();
    }
  }, [isOpen])

  const fetchCommentHistory = async() => {
  try {
    setIsLoading(true);
    setError(null);
    
    // Then fetch the history
    const { data, error } = await supabase
      .from('comment_history')
      .select('*')
      .eq('comment_id', comment.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    setCommentHistoryData(data || []);
  } catch (error) {
    console.error('Error while fetching the comment history', error);
    setError('Failed to load comment history');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="absolute -top-2 -left-2 -right-2 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-lg border border-neutral-200 dark:border-blue-600 p-4 z-50 shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
          Comment History
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors"
        >
          <svg className="w-5 h-5 text-neutral-500 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
            {/* History Content */}
      <div className="space-y-2">
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          {/* Comment History */}
          <div className="mb-3">
            <h4 className="font-medium text-neutral-800 dark:text-white mb-2">Version History:</h4>
            
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-neutral-500 dark:text-neutral-400 mt-2">Loading history...</p>
              </div>
            ) : error ? (
              <div className="text-red-500 dark:text-red-400 text-center py-4">
                {error}
              </div>
            ) : commentHistoryData.length === 0 ? (
              <div className="text-neutral-500 dark:text-neutral-400 text-center py-4">
                No history available for this comment
              </div>
            ) : (
              <div className="space-y-2">
                {/* Current Comment Version (not in history yet) */}
                <div className="p-3 border-2 border-blue-200 dark:border-blue-600 rounded-md bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Current Version
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      {formatDateTime(new Date())}
                    </span>
                  </div>
                  <p className="text-neutral-800 dark:text-neutral-200">{comment.content}</p>
                </div>
                
                {/* Historical Versions */}
                {commentHistoryData.map((commentHistory, index) => (
                  <div key={commentHistory.id} className="p-3 border border-neutral-200 dark:border-neutral-600 rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        Version {commentHistory.version_no}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {formatDateTime(commentHistory.changed_at)}
                      </span>
                    </div>
                    
                    {/* Show diff if there's a previous version */}
                    {index < commentHistoryData.length - 1 ? (
                      <div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">Changes from previous version:</p>
                        <DiffChecker
                          oldText={commentHistoryData[index + 1].content}
                          newText={commentHistory.content}
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">Version content:</p>
                        <p className="text-neutral-800 dark:text-neutral-200">{commentHistory.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default CommentHistoryDialog;