"use client"

import { useState } from "react";
import CreateTask from "../CreateTask/CreateTask";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const { useDraggable } = require("@dnd-kit/core");
const { CSS } = require("@dnd-kit/utilities");
const { transform } = require("typescript");

const Task = ({ task, id, onTaskUpdate, commentCount = 0, onToggleSubtasks, showSubtasks, subTasksCount,subTasks  }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    
    // Debug logging
    console.log(`Task ${task.id} received subtask count:`, subTasksCount);
    
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

    const handleSubtasksClick = (e) => {
        e.stopPropagation(); // Prevent task edit dialog from opening
        if (onToggleSubtasks) {
            onToggleSubtasks();
        }
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
                <div className="flex justify-between space-y-2">
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
                    <div className="flex justify-between items-start space-x-6 text-gray-500">
                        {/* Comments with count */}
                        <button className="flex items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-label="comments">
                                <path d="M10.4339 1.95001C11.5975 1.94802 12.7457 2.2162 13.7881 2.73345C14.8309 3.25087 15.7392 4.0034 16.4416 4.93172C17.1439 5.86004 17.6211 6.93879 17.8354 8.08295C18.0498 9.22712 17.9955 10.4054 17.6769 11.525C17.3582 12.6447 16.7839 13.675 15.9992 14.5348C15.2144 15.3946 14.2408 16.0604 13.1549 16.4798C12.0689 16.8991 10.9005 17.0606 9.74154 16.9514C8.72148 16.8553 7.73334 16.5518 6.83716 16.0612L4.29488 17.2723C3.23215 17.7786 2.12265 16.6693 2.6287 15.6064L3.83941 13.0637C3.26482 12.0144 2.94827 10.8411 2.91892 9.64118C2.88616 8.30174 3.21245 6.97794 3.86393 5.80714C4.51541 4.63635 5.46834 3.66124 6.62383 2.98299C7.77896 2.30495 9.09445 1.9483 10.4339 1.95001ZM10.4339 1.95001C10.4343 1.95001 10.4347 1.95001 10.4351 1.95001L10.434 2.70001L10.4326 1.95001C10.433 1.95001 10.4334 1.95001 10.4339 1.95001ZM13.1214 4.07712C12.2867 3.66294 11.3672 3.44826 10.4354 3.45001L10.4329 3.45001C9.3608 3.44846 8.30778 3.73387 7.38315 4.2766C6.45852 4.81934 5.69598 5.59963 5.17467 6.5365C4.65335 7.47337 4.39226 8.53268 4.41847 9.6045C4.44469 10.6763 4.75726 11.7216 5.32376 12.6319C5.45882 12.8489 5.47405 13.1198 5.36416 13.3506L4.28595 15.6151L6.54996 14.5366C6.78072 14.4266 7.05158 14.4418 7.26863 14.5768C8.05985 15.0689 8.95456 15.3706 9.88225 15.458C10.8099 15.5454 11.7452 15.4162 12.6145 15.0805C13.4837 14.7448 14.2631 14.2119 14.8912 13.5236C15.5194 12.8354 15.9791 12.0106 16.2341 11.1144C16.4892 10.2182 16.5327 9.27504 16.3611 8.35918C16.1895 7.44332 15.8075 6.57983 15.2453 5.83674C14.6831 5.09366 13.9561 4.49129 13.1214 4.07712Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                            </svg>
                            {commentCount > 0 && (
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                    {commentCount}
                                </span>
                            )}
                        </button>
                        
                        {/* Subtasks icon */}
                        <button 
                            className={`flex items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors ${showSubtasks ? 'bg-blue-100 dark:bg-blue-900/20' : ''}`}
                            onClick={handleSubtasksClick}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="subtasks">
                                <path d="M2 2.75C2 2.33579 2.33579 2 2.75 2H6.75C7.16421 2 7.5 2.33579 7.5 2.75C7.5 3.16421 7.16421 3.5 6.75 3.5H5.4502V7.25H9V6.5C9 5.94772 9.44772 5.5 10 5.5H17C17.5523 5.5 18 5.94772 18 6.5V9.5C18 10.0523 17.5523 10.5 17 10.5H10C9.44772 10.5 9 10.0523 9 9.5V8.75H5.4502V14.5C5.4502 14.6381 5.56212 14.75 5.7002 14.75H9V14C9 13.4477 9.44772 13 10 13H17C17.5523 13 18 13.4477 18 14V17C18 17.5523 17.5523 18 17 18H10C9.44772 18 9 17.5523 9 17V16.25H5.7002C4.7337 16.25 3.9502 15.4665 3.9502 14.5V3.5H2.75C2.33579 3.5 2 3.16421 2 2.75ZM10.5 7V9H16.5V7H10.5ZM10.5 16.5V14.5H16.5V16.5H10.5Z" fillRule="evenodd" clipRule="evenodd"/>
                            </svg>
                            {subTasksCount > 0 && (
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                    {subTasksCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
                
            </Card>

            {isEditMode && (
                <CreateTask
                    isEditMode={true}
                    taskToEdit={task}
                    userId={task.user_id}
                    onClose={() => { setIsEditMode(false) }}
                    onTaskUpdate={handleTaskUpdate}
                    commentCount={commentCount}
                    subTasksCount={subTasksCount}
                    subTasks={subTasks}
                />
            )}
        </>
    )
}
export default Task;