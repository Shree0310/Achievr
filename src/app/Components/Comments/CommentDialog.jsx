"use client"
const CommentDialog = ({deleteComment}) => {
    return <div>
         <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg dark:shadow-gray-900/50 z-10 border border-gray-200 dark:border-gray-700">
                <ul className="py-1">
                    <li 
                        onClick={deleteComment}
                        className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                        Delete Comment
                    </li>
                    <li className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
>
                        Update Comment
                    </li>
                </ul>
            </div>
    </div>
}
export default CommentDialog;