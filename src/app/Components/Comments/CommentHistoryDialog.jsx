"use client"

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

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
      
      const { data, error } = await supabase
        .from('comment_history')
        .select('*')
        .eq('comment_id', comment.id)  // Filter by specific comment
        .order('created_at', { ascending: false });  // Most recent first
      
      if (error) {
        throw error;
      }
      
      setCommentHistoryData(data || []);
    } catch (error) {
      console.error('Error while fetching the comment history', error);
      setError('Failed to load comment history');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="absolute -top-2 -left-2 -right-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-blue-600 p-4 z-50 shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Comment History
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
            {/* History Content */}
      <div className="space-y-2">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {/* Comment History */}
          <div className="mb-3">
            <h4 className="font-medium text-gray-800 dark:text-white mb-2">Version History:</h4>
            
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Loading history...</p>
              </div>
            ) : error ? (
              <div className="text-red-500 dark:text-red-400 text-center py-4">
                {error}
              </div>
            ) : commentHistoryData.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400 text-center py-4">
                No history available for this comment
              </div>
            ) : (
              <div className="space-y-2">
                {commentHistoryData.map((commentHistory) => (
                  <div key={commentHistory.id} className="p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                    <p className="text-gray-800 dark:text-gray-200 mb-1">{commentHistory.content}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(commentHistory.created_at)}</span>
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