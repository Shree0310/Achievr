"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useNotifications } from "@/app/contexts/NotificationContext";

const CommentBox = ({ taskToEdit, userId }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isCommentAdded, setIsCommentAdded] = useState(false);
  const [isCommentDeleted, setIsCommentDeleted] = useState(false);
  const [isReplyAdded, setIsReplyAdded] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [parentCommentId, setParentCommentId] = useState(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (taskToEdit?.id) {
      loadComments(taskToEdit?.id);
    }
  }, [isCommentAdded, isCommentDeleted]);

  const loadComments = async (taskId) => {
    const { data, error } = await supabase
      .from("comments")
      .select("id, content, parent_comment_id, created_at, user_id")
      .eq("task_id", taskId)
      .order("created_at", { ascending: true });
    try {
      if (data && data.length > 0) setComments(data);
      console.log(data);
    } catch {
      console.log(error);
    }
  };

  const onReplyClicked = (comment) => {
    setIsReplyAdded(!isReplyAdded);
    setReplyCommentId(comment.id);
    if (comment.parent_comment_id) {
      setParentCommentId(comment.parent_comment_id);
    } else {
      setParentCommentId(comment.id);
    }
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
        setComments((prevComments) => [data[0], ...prevComments]);
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

    console.log("CommentBox - Adding reply via addReplyComment method");
    console.log("CommentBox - parentCommentId:", parentCommentId);

    try {
      const replyData = {
        content: newReply.trim(),
        created_at: new Date(),
        updated_at: new Date(),
        task_id: taskToEdit.id,
        user_id: userId,
        parent_comment_id: parentCommentId,
      };

      console.log("CommentBox - Reply data to insert:", replyData);

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

  return (
    <>
      <div>
        <div className="p-2 m-2 w-full ">
          <div className="bg-gray-100 overflow-hidden rounded-md shadow-md">
            <textarea
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="write an update and start with @ to mention others"
              className="w-full h-14 p-4 text-gray-600 bg-gray-100 border-none outline-none resize-none"
            />
            <div className="flex justify-between space-x-24 p-2">
              {/* Footer   */}
              <div className="flex items-center space-x-2 text-xs text-gray-500 px-2 bg-gray-100">
                {/* Mention button */}
                <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                  <span>@ Mention</span>
                </button>

                {/* Attach button */}
                <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
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
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                Add Comment
              </button>
            </div>
          </div>
        </div>
        <div>
          {comments && (
            <>
              {comments.map((comment) => (
                <div key={`${comment.id}-${comment.created_at}`}>
                  <div
                    className={`p-2 m-2 h-auto ${
                      comment.parent_comment_id ? "ml-10" : "ml-0"
                    }`}>
                    <div
                      className={`bg-gray-100 rounded-md shadow-md ${
                        comment.parent_comment_id
                          ? "border-l-4 border-blue-300"
                          : ""
                      }`}>
                      <div className="relative w-full h-auto p-4 text-gray-600 bg-gray-100 border-gray-700 ">
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="absolute top-2 right-2">
                          <svg
                            className="h-3 w-3"
                            viewBox="0 0 24 24"
                            fill="none">
                            <path
                              d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        </button>
                        <p className="py-2">{comment.content}</p>
                        <hr className="w-full"></hr>
                        <div className=" bg-gray-100 overflow-hidden pt-2">
                          <button
                            onClick={() => onReplyClicked(comment)}
                            className="flex items-center space-x-2 text-xs text-gray-500 px-2">
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
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reply textarea - positioned right after the comment that was replied to */}
                  {isReplyAdded && replyCommentId === comment.id && (
                    <div
                      className={`p-2 m-2 h-auto ${
                        comment.parent_comment_id ? "ml-10" : "ml-0"
                      }`}>
                      <div className="bg-gray-50 overflow-hidden rounded-md shadow-md border-l-4 border-green-300">
                        <textarea
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          placeholder="write a reply..."
                          className="w-full h-14 p-4 text-gray-600 bg-gray-50 border-none outline-none resize-none"
                        />
                        <div className="flex justify-between space-x-24 p-2">
                          <div className="flex items-center space-x-2 text-xs text-gray-500 px-2 bg-gray-50">
                            <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                              <span>@ Mention</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
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
                              className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors">
                              Cancel
                            </button>
                            <button
                              onClick={addReplyComment}
                              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                              Add Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CommentBox;
