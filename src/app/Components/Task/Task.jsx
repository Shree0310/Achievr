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
                className='bg-white rounded-lg shadow-sm border border-gray-200 mb-2 cursor-move hover:shadow-md transition-shadow touch-manipulation'>
                <CardHeader>
                    <CardTitle className='text-gray-700 font-medium'>
                        {task.title || 'Untitled Task'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-gray-600 text-sm'>
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