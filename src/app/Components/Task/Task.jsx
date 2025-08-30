"use client"

import { useState } from "react";
import CreateTask from "../CreateTask/CreateTask";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const { useDraggable } = require("@dnd-kit/core");
const { CSS } = require("@dnd-kit/utilities");
const { transform } = require("typescript");

const Task = ({ task, id, onTaskUpdate }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: {
            task
        }
    });

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.3 : 1,
        scale: isDragging ? 0.95 : 1,
        zIndex: isDragging ? 999 : 1,
    } : undefined;

    const handleClick = () => {
        setIsEditMode(true);
    }

    const handleTaskUpdate = (action, data) => {
        if (onTaskUpdate) {
            onTaskUpdate(action, data);
        }
        setIsEditMode(false);
    }

    return (
        <>
            <Card
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                onClick={handleClick}
                className='group bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/30 cursor-move'>
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-blue-400 transition-colors">
                            {task.title || 'Untitled Task'}
                        </h3>
                    </div>
                    {/* Priority Badge */}
                    {task.priority && (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${task.priority === '1' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                            task.priority === '2' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                            'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`}>
                            P{task.priority}
                        </span>
                    )}
                </div>
                
                <p className='text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2'>
                    {task.description || 'No Description'}
                </p>
                
                <div className="flex items-center space-x-3 text-sm">
                    {task.efforts && (
                        <div className="flex items-center text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{task.efforts} SP</span>
                        </div>
                    )}
                </div>
            </Card>

            {isEditMode && (
                <CreateTask
                    isEditMode={true}
                    taskToEdit={task}
                    userId={task.user_id}
                    onClose={() => { setIsEditMode(false) }}
                    onTaskUpdate={handleTaskUpdate}
                />
            )}
        </>
    )
}
export default Task;