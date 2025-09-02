"use client"
const Subtasks = () => {
    return (
        <div className="relative ml-5">
            {/* Vertical line spanning all subtasks */}
            <div className="absolute left-0 top-0 bottom-5 w-px bg-gray-300 dark:bg-gray-600"></div>
            
            {/* {subtasks.map((subtask, index) => ( */}
                <div className="relative">
                    {/* Horizontal connector line */}
                    <div className="absolute left-0 top-7 w-4 h-px bg-gray-300 dark:bg-gray-600"></div>
                    
                    {/* Connection dot */}
                    <div className="absolute left-3.5 top-6 w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                    
                    {/* Subtask */}
                    <div className="ml-6 h-14 w-56 my-4 dark:border-blue-500 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 hover:border-primary-400 dark:hover:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/30 cursor-move">
                        Subtask
                    </div>
                </div>
            {/* // ))} */}
        </div>
    )
}
export default Subtasks;