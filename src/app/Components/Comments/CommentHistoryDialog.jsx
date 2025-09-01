"use client"

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const CommentHistoryDialog = ({ comment, isOpen, onClose, formatDateTime }) => {
  if (!isOpen) return null;

  const [commentHistoryData, setCommentHistoryData] = useState([]);

  useEffect(() => {
    fetchCommentHistory();
  })

  const fetchCommentHistory = async() => {
    try{
        const { data, error } = await supabase
        .from('comment_history')
        .select('*');
        setCommentHistoryData(data);
        if(error){
            throw error;}
        }
    catch(error) {
        console.error('Error while fetching the comment history', error);
    }
  }

  return (
    <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200 dark:border-gray-600 p-4 z-50">
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
          {/* <p><strong>Original Comment:</strong> {comment.content}</p>
          <p><strong>Created:</strong> {formatDateTime(comment.created_at)}</p>
          {comment.updated_at && comment.updated_at !== comment.created_at && (
            <p><strong>Last Updated:</strong> {formatDateTime(comment.updated_at)}</p>
          )}
          <p><strong>Comment ID:</strong> {comment.id}</p> */}
        {commentHistoryData.map((commentHistory) => {
            <div key={commentHistory.id}>
                 <p>{commentHistory.content}</p>
                 <span>{commentHistory.created_at}</span>
            </div>
        })}
        </div>
      </div>
    </div>
  );
};

export default CommentHistoryDialog;