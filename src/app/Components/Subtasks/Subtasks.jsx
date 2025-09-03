"use client"

import { supabase } from "@/utils/supabase/client"

const Subtasks = ({subTasks, taskToEdit, userId}) => {

    const handleAddSubtask = async (taskTitle) => {
        const { data, error} = await supabase
            .from('tasks')
            .insert([
                {
                    title:taskTitle,
                    description:description || null,
                    priority: priority || null,
                    efforts: efforts || null,
                    status: "not started", // Default status
                    user_id: userId,
                    parent_task_id: taskToEdit.id
                }
            ])
            .select()
            
    }
    return (
        <div>
            <div className="relative ml-5">
            {/* Vertical line spanning all subtasks */}
            <div className="absolute left-0 top-0 bottom-5 w-px bg-gray-300 dark:bg-gray-600"></div>
            
            {subTasks.map((subtask, index) => (
                <div key={index} className="relative">
                    {/* Horizontal connector line */}
                    <div className="absolute left-0 top-7 w-4 h-px bg-gray-300 dark:bg-gray-600"></div>
                    
                    {/* Connection dot */}
                    <div className="absolute left-3.5 top-6 w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                    
                    {/* Subtask */}
                    <div className="ml-6 h-14 w-56 my-2 text-sm flex py-2 justify-center dark:border-blue-500 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 hover:border-primary-400 dark:hover:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/30 cursor-move">
                        {subtask.title}
                    </div>
                </div>
             ))}
        </div>
        <div className="my-2 mx-12">
            <textarea className="py-2 text-center h-10 text-gray-500 dark:text-gray-400 text-sm dark:bg-[#374a68] rounded-md " 
            defaultValue="+ Add sub-tasks" 
            onKeyDown={(e)=>handleAddSubtask(e.target.value)}>
            {/* <span className="px-3">+</span>Add sub-task */}
        </textarea>
        </div>
        </div>
    )
}
export default Subtasks;