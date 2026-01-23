"use client"

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useNotifications } from "@/app/contexts/NotificationContext";

const Subtasks = ({subTasks, taskToEdit, userId, onSubtaskCreated}) => {
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
    const [isAddingSubtask, setIsAddingSubtask] = useState(false);

    const handleAddSubtask = async (taskTitle) => {
        try {
            setIsAddingSubtask(true);
            const { data, error} = await supabase
                .from('tasks')
                .insert([
                    {
                        title: taskTitle.trim(),
                        description: "",
                        priority: "3", // Default to low priority
                        efforts: "1", // Default to 1 story point
                        status: "not_started", // Default status
                        user_id: userId,
                        parent_task_id: taskToEdit.id,
                        cycle_id: taskToEdit.cycle_id
                    }
                ])
                .select();
            
            if (error) throw error;
            setNewSubtaskTitle("");
                
                // Call the parent callback to refresh subtasks
                if (onSubtaskCreated) {
                onSubtaskCreated();
            }
            } catch (error) {
            console.error('Error creating subtask:', error);
        } finally {
            setIsAddingSubtask(false);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
        e.preventDefault();
        handleAddSubtask(newSubtaskTitle);
       }
    };
    return (
        <div>
            <div className="relative ml-5">
            {/* Vertical line spanning all subtasks */}
            <div className="absolute left-0 top-0 bottom-5 w-px bg-neutral-300 dark:bg-neutral-600"></div>
            
            {subTasks.map((subtask, index) => (
                <div key={index} className="relative">
                    {/* Horizontal connector line */}
                    <div className="absolute left-0 top-7 w-4 h-px bg-neutral-300 dark:bg-neutral-600"></div>
                    
                    {/* Connection dot */}
                    <div className="absolute left-3.5 top-6 w-1 h-1 bg-neutral-400 dark:bg-neutral-500 rounded-full"></div>
                    
                    {/* Subtask */}
                    <div className="ml-6 h-14 w-56 my-2 text-sm flex justify-center dark:border-blue-500 bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 hover:border-primary-400 dark:hover:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-neutral-900/20 dark:hover:shadow-neutral-900/30 cursor-move">
                        {subtask.title}
                    </div>
                </div>
             ))}
        </div>
        <div className="my-2 mx-12">
            <input 
                type="text"
                className="w-full py-2 px-3 text-center h-10 text-neutral-500 dark:text-neutral-400 text-sm dark:bg-[#374a68] bg-neutral-100 rounded-md border border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400" 
                placeholder="+ Add sub-tasks"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isAddingSubtask}
            />
        </div>
        </div>
    )
}
export default Subtasks;