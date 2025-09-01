"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { useNotifications } from "@/app/contexts/NotificationContext";
import CommentDialog from "@/app/Components/Comments/CommentDialog"
import CommentHistoryDialog from "@/app/Components/Comments/CommentHistoryDialog"

const CommentBox = ({ taskToEdit, userId }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isCommentAdded, setIsCommentAdded] = useState(false);
  const [isCommentDeleted, setIsCommentDeleted] = useState(false);
  const [isReplyAdded, setIsReplyAdded] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [parentCommentId, setParentCommentId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [updateCommentMode, setUpdateCommentMode] = useState(null);
  const [newUpdatedComment, setNewUpdatedComment] = useState("");

  const [openCommentHistory, setOpenCommentHistory] = useState(null);
  const { addNotification } = useNotifications();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (taskToEdit?.id) {
      loadComments(taskToEdit?.id);
    }
    if(openMenuId){
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    //Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isCommentAdded, isCommentDeleted]);

  const handleClickOutside = useCallback((event) => {
      if(dialogRef.current && !dialogRef.current.contains(event.target)){
        setOpenMenuId(false);
      }
    },[])

  const loadComments = async (taskId) => {
    const { data, error } = await supabase
      .from("comments")
      .select("id, content, parent_comment_id, created_at, updated_at, user_id")
      .eq("task_id", taskId)
      .order("created_at", { ascending: true });
    try {
      if (data && data.length > 0) setComments(data);
      console.log(data);
    } catch {
      console.log(error);
    }
  };

  const updateComment = async (comment) => {
    setOpenMenuId(null);
    if (!newUpdatedComment.trim()) {
      addNotification('Comment cannot be empty', 'error');
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .update({
          content: newUpdatedComment.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', comment.id);

      if (error) throw error;
      
      // Reload comments and reset state
      await loadComments(taskToEdit.id);
      setUpdateCommentMode(null);
      setNewUpdatedComment("");
      addNotification('Comment updated successfully', 'success');
    } catch (error) {
      addNotification('Failed to update comment', 'error');
      console.error('Error while updating comment:', error);
    }
  };

  // Build nested comment tree structure
  const buildCommentTree = (comments) => {
    const commentMap = new Map();
    const rootComments = [];

    // First pass: create a map of all comments
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, children: [] });
    });

    // Second pass: build the tree structure
    comments.forEach(comment => {
      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          parent.children.push(commentMap.get(comment.id));
        }
      } else {
        rootComments.push(commentMap.get(comment.id));
      }
    });

    return rootComments;
  };

  //Format Date and Time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  // Recursive function to render comments with proper nesting
  const renderCommentTree = (comment, depth = 0) => {
    const indentLevel = depth * 40; // 40px per nesting level

    return (
      <div key={`${comment.id}-${comment.created_at}`}>
        <div
          className="p-2 m-2 h-auto"
          style={{ marginLeft: `${indentLevel}px` }}>
          <div
            className={`bg-gray-100 dark:bg-gray-800 rounded-md shadow-md dark:shadow-gray-900/20 border border-transparent dark:border-blue-300/60 ${
              comment.parent_comment_id
                ? "border-l-4"
                : ""
            }`}>
            <div className="relative w-full h-auto p-4 text-gray-600 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border-gray-700 dark:border-gray-600 ">
              <div className="flex justify-end gap-4 absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                {updateCommentMode !== comment.id && (
                  <div className="flex items-center gap-2">
                <p className="text-xs">{formatDateTime(comment.created_at)}</p>
                <button
                  onClick={() => setOpenMenuId(openMenuId === comment.id ? null: comment.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <svg
                    className="w-3 h-3 text-gray-500 dark:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
                </div>)}
                {openMenuId === comment.id && 
                  <CommentDialog ref={dialogRef} 
                                 deleteComment={() => deleteComment(comment.id)}
                                 updateCommentMode={() => {
                                   if (updateCommentMode === comment.id) {
                                     setUpdateCommentMode(null);
                                     setNewUpdatedComment("");
                                   } else {
                                     setUpdateCommentMode(comment.id);
                                     setNewUpdatedComment(comment.content);
                                     setOpenMenuId(null); // Close the menu when entering edit mode
                                   }
                                 }}/>}
            </div>
              {updateCommentMode === comment.id ? (
                <div className="py-2">
                  <textarea
                    value={newUpdatedComment}
                    onChange={(e) => setNewUpdatedComment(e.target.value)}
                    placeholder={comment.content}
                    className="w-full h-20 p-3 text-gray-600 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md outline-none resize-none placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{newUpdatedComment.length} characters</span>
                      <span>•</span>
                      <span>{newUpdatedComment.trim() === comment.content ? 'No changes' : 'Modified'}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setUpdateCommentMode(null);
                          setNewUpdatedComment("");
                        }}
                        className="px-3 py-1.5 bg-gray-500 dark:bg-gray-600 text-white text-sm rounded hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors">
                        Cancel
                      </button>
                      <button
                        onClick={() => updateComment(comment)} 
                        disabled={!newUpdatedComment.trim() || newUpdatedComment.trim() === comment.content}
                        className="px-3 py-1.5 bg-blue-500 dark:bg-blue-600 text-white text-sm rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Update Comment
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <p>{comment.content}</p>
                  {comment.updated_at && comment.updated_at !== comment.created_at && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                      (edited)
                    </p>
                  )}
                </div>
              )}
              <hr className="w-full border-gray-300 dark:border-gray-600"></hr>
              <div className="flex bg-gray-100 dark:bg-gray-800 pt-2">
                <button
                  onClick={() => onReplyClicked(comment)}
                  className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 px-2 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none">
                    <path
                      d="M3 10h10a8 8 0 0 1 8 8v2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 6L3 10l4 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Reply</span>
                </button>
                {comment.updated_at && comment.updated_at !== comment.created_at && (
                  <p className="text-xs text-gray-500 dark:text-gray-200 px-4">
                    Updated: {formatDateTime(comment.updated_at)}
                  </p>
                )}
                <button className="text-xs text-gray-500 dark:text-gray-200 hover:text-blue-400"
                        onClick={() => setOpenCommentHistory(openCommentHistory === comment.id ? null : comment.id )}>Show History</button>
              </div>
              
              {/* CommentHistoryDialog - controlled component */}
              <CommentHistoryDialog
                comment={comment}
                isOpen={openCommentHistory === comment.id}
                onClose={() => setOpenCommentHistory(null)}
                formatDateTime={formatDateTime}
              />
            </div>
          </div>
        </div>


        {/* Reply textarea - positioned right after the comment that was replied to */}
        {isReplyAdded && replyCommentId === comment.id && (
          <div
            className="p-2 m-2 h-auto"
            style={{ marginLeft: `${indentLevel}px` }}>
                                  <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden rounded-md shadow-md dark:shadow-gray-900/20 border border-transparent dark:border-blue-300/60 border-l-4 border-l-green-300 dark:border-l-green-500">
                        <textarea
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          placeholder="write a reply..."
                          className="w-full h-14 p-4 text-gray-600 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border-none outline-none resize-none placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <div className="flex justify-between space-x-24 p-2">
                          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 px-2 bg-gray-50 dark:bg-gray-700">
                            <button className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                              <span>@ Mention</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none">
                                <path
                                  d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span>Attach</span>
                            </button>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setIsReplyAdded(false);
                                setReplyCommentId(null);
                                setParentCommentId(null);
                                setNewReply("");
                              }}
                              className="px-3 py-1 bg-gray-500 dark:bg-gray-600 text-white text-sm rounded hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors">
                              Cancel
                            </button>
                            <button
                              onClick={addReplyComment}
                              className="px-3 py-1 bg-blue-500 dark:bg-blue-600 text-white text-sm rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
                              Add Reply
                            </button>
                          </div>
                        </div>
                      </div>
          </div>
        )}

        {/* Recursively render child comments */}
        {comment.children && comment.children.length > 0 && (
          <div className="">
            {comment.children.map(childComment => 
              renderCommentTree(childComment, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const onReplyClicked = (comment) => {
    setIsReplyAdded(!isReplyAdded);
    setReplyCommentId(comment.id);
    // Always set the parent to the current comment being replied to
    setParentCommentId(comment.id);
  };

  const addComment = async (commentId) => {
    if (!newComment.trim()) return;
    setIsCommentAdded(true);
    const commentObj = {
      content: newComment.trim(),
      created_at: new Date(),
      updated_at: new Date(),
      task_id: taskToEdit.id,
      user_id: userId,
      parent_comment_id: null,
    };

    const replyObj = {
      content: newReply.trim(),
      created_at: new Date(),
      updated_at: new Date(),
      task_id: taskToEdit.id,
      user_id: userId,
      parent_comment_id: commentId,
    };
    //insert a comment into comments array
    try {
      if (replyCommentId) {
        const { data, error } = await supabase
          .from("comments")
          .insert([replyObj])
          .select();
        setComments((prevComments) => [...prevComments, data[0]]);
        setNewComment("");
        setIsCommentAdded(false);
        setReplyCommentId(null);

        // Directly trigger notification for reply
        addNotification({
          type: "info",
          title: "New Reply Added",
          message: `A new reply was added to a comment on task "${taskToEdit.title}"`,
        });
      } else {
        const { data, error } = await supabase
          .from("comments")
          .insert([commentObj])
          .select();
        setComments((prevComments) => [data[0], ...prevComments]);
        setNewComment("");
        setIsCommentAdded(false);

        // Directly trigger notification display
        addNotification({
          type: "info",
          title: "New Comment Added",
          message: `A new comment was added on task "${taskToEdit.title}"`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = async (commentId) => {
    console.log("deleting comment");
    if (!taskToEdit.id) return;
    setIsCommentDeleted(true);

    try {
      const { data, error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      setIsCommentDeleted(false);
    } catch (error) {
      console.log(error);
    }
  };

  const addReplyComment = async () => {
    if (!taskToEdit.id || !parentCommentId) return;
    setIsReplyAdded(true);

    try {
      const replyData = {
        content: newReply.trim(),
        created_at: new Date(),
        updated_at: new Date(),
        task_id: taskToEdit.id,
        user_id: userId,
        parent_comment_id: parentCommentId,
      };

      const { data, error } = await supabase
        .from("comments")
        .insert([replyData])
        .select();

      if (error) throw error;

      // Add the new reply to the comments array
      setComments((prevComments) => [...prevComments, data[0]]);
      setNewReply("");
      setIsReplyAdded(false);
      setReplyCommentId(null);
      setParentCommentId(null);

      // Directly trigger notification for reply
      addNotification({
        type: "info",
        title: "New Reply Added",
        message: `A new reply was added to a comment on task "${taskToEdit.title}"`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Build the comment tree for rendering
  const commentTree = buildCommentTree(comments);

  return (
    <>
      <div>
        <div className="p-2 m-2 w-full ">
          <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-md shadow-md border border-transparent dark:border-blue-300/60">
            <textarea
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="write an update and start with @ to mention others"
              className="w-full h-14 p-4 text-gray-600 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border-none outline-none resize-none placeholder-gray-500 dark:placeholder-gray-400"
            />
            <div className="flex justify-between space-x-24 p-2">
              {/* Footer   */}
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 px-2 bg-gray-100 dark:bg-gray-800">
                {/* Mention button */}
                <button className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                  <span>@ Mention</span>
                </button>

                {/* Attach button */}
                <button className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Attach</span>
                </button>
              </div>
              {/* Update button */}
              <button
                onClick={addComment} // Fixed: removed the comment.id parameter
                className="px-3 py-1 bg-blue-500 dark:bg-blue-600 text-white text-sm rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
                Add Comment
              </button>
            </div>
          </div>
        </div>
        <div>
          {commentTree && commentTree.length > 0 && (
            <>
              {commentTree.map((comment) => renderCommentTree(comment))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CommentBox;
