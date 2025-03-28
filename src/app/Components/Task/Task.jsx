"use client"

import { useState } from "react";
import CreateTask from "../CreateTask/CreateTask";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const { useDraggable } = require("@dnd-kit/core");
const { CSS } = require("@dnd-kit/utilities");
const { transform } = require("typescript");

const Task = ({ task, id }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: {
            task
        }
    });

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 1,
    } : undefined;

    const handleClick = () => {
        setIsEditMode(true);
    }

    return (
        <>
            <Card
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                onClick={handleClick}
                className='bg-white rounded-lg h-32 max-h-32 overflow-hidden shadow-sm border border-gray-200 mb-2 cursor-move hover:shadow-md transition-shadow touch-manipulation'>
                <CardHeader className="p-3 pb-1">
                    <CardTitle className='text-gray-700 font-medium'>
                        {task.title || 'Untitled Task'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                    <div className="flex space-x-3">
                        {
                            task.efforts && (
                                <p className="text-[12px] h-4 w-12 px-3">
                                    SP 
                                    <span className="bg-white h-1 w-1 text-[12px]">{task.efforts}</span>
                                </p>
                            )
                        }
                        {
                            task.priority && (
                                <p className="text-sm">{task.priority || "priority not set"}</p>
                            )
                        }
                    </div>
                    <p className='text-gray-600 text-sm overflow-hidden line-clamp-3'>
                        {task.description || 'No Description'}
                    </p>
                </CardContent>
            </Card>

            {isEditMode && (
                <CreateTask
                    isEditMode={true}
                    taskToEdit={task}
                    userId={task.user_id}
                    onClose={() => { setIsEditMode(false) }} />
            )}
        </>
    )
}
export default Task;