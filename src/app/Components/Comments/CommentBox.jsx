"use-client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

const CommentBox = ({ taskToEdit, userId }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isCommentAdded, setIsCommentAdded] = useState(false);
  const [isCommentDeleted, setIsCommentDeleted] = useState(false);
  const [isReplyAdded, setIsReplyAdded] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [replyCommentId, setReplyCommentId] = useState(null);

  useEffect(() => {}, [isCommentAdded, isCommentDeleted]);

  const addComment = async () => {
    if (!newComment.trim()) return;
    setIsCommentAdded(true);
    //insert a comment into comments array
    try {
      const { data, error } = await supabase
        .from("comments")
        .insert([
          {
            content: newComment.trim(),
            created_at: new Date(),
            updated_at: new Date(),
            task_id: taskToEdit.id,
            user_id: userId,
            parent_comment_id: null,
          },
        ])
        .select();
      setComments((prevComments) => [data[0], ...prevComments]);
      setNewComment("");
      setIsCommentAdded(false);
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

  const addReplyComment = async (commentId) => {
    if (!taskToEdit.id) return;
    setIsReplyAdded(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .insert([
          {
            content: newReply.trim(),
            created_at: new Date(),
            updated_at: new Date(),
            task_id: taskToEdit.id,
            user_id: userId,
            parent_comment_id: commentId,
          },
        ])
        .select();

      const parentIndex = comments.findIndex(
        (comment) => comment.id === commentId
      );
      console.log(parentIndex);
      const newReplyUi = {
        content: newReply.trim(),
        created_at: new Date(),
        updated_at: new Date(),
        task_id: taskToEdit.id,
        user_id: userId,
        parent_comment_id: commentId,
      };
      console.log(newReplyUi);
      setComments((prevComments) => {
        const newComments = [...prevComments];
        newComments.splice(parentIndex + 1, 0, newReplyUi);
        return newComments;
      });
      comments.map((comment) => console.log(comment));
      setNewReply("");
      setIsReplyAdded(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onReplyClicked = (commentId) => {
    setIsReplyAdded(!isReplyAdded);
    setReplyCommentId(commentId);
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
                onClick={() => addComment()}
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
                <div
                  key={comment.id}
                  className={`p-2 m-2  h-auto ${
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
                        onClick={() =>
                          deleteComment(comment.id, comment.parent_comment_id)
                        }
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
                      <p key={comment.id} className="py-2">
                        {comment.content}
                      </p>
                      <hr className="w-full"></hr>
                      <div className=" bg-gray-100 overflow-hidden pt-2">
                        <button
                          onClick={() => onReplyClicked(comment.id)}
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
                  <div>
                    {isReplyAdded && replyCommentId === comment.id && (
                      <div
                        className={`p-2 m-2  h-auto ${
                          comment.parent_comment_id ? "ml-10" : "ml-0"
                        }`}>
                        <div className="bg-gray-100 overflow-hidden rounded-md shadow-md">
                          <textarea
                            type="text"
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
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
                            {/* Update button */}
                            <button
                              onClick={() => addReplyComment(comment.id)}
                              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                              Add Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
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
