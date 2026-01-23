"use client"
const CommentDialog = ({deleteComment, updateCommentMode}) => {
    return (
        <div className="absolute right-0 mt-6 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg dark:shadow-neutral-900/50 z-10 border border-neutral-200 dark:border-neutral-700">
            <ul className="py-1">
                <li 
                    onClick={deleteComment}
                    className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
                >
                    Delete Comment
                </li>
                <li 
                    onClick={updateCommentMode}
                    className="block px-4 py-2 text-sm text-neutral-800 dark:text-neutral-300 hover:bg-neutral-700 dark:hover:bg-neutral-600 cursor-pointer transition-colors"
                >
                    Update Comment
                </li>
            </ul>
        </div>
    );
};
export default CommentDialog;