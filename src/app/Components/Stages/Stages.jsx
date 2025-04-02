'use client'

import { useState, useEffect, useMemo } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { supabase } from "@/utils/supabase/client";
import Task from '../Task/Task';
import DroppableColumn from '../DroppableColumn/DroppableColumn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Stages = ({ className = "" }) => {
    const [tasks, setTasks] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeId, setActiveId] = useState(null);
    const [activeDragData, setActiveDragData] = useState(null);

    // ✅ IMPORTANT: Always define sensors in the same way - don't change order or structure
    const sensors = useSensors(
        useSensor(PointerSensor, {
            //requires The pointer to move 10 pixels before activating
            activationConstraint: {
                distance: 5,
            },
        })
    );

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('tasks')
                .select('*')

            if (error) {
                throw error;
            }

            setTasks(data || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Handle new task created
    const handleTaskCreated = (newTask) => {
        setTasks(prevTasks => [...(prevTasks || []), newTask]);
    };

    // Filter tasks by status - wrapped in useMemo to prevent recalculation
    const filteredTasks = useMemo(() => {
        const columns = {
            notStarted: [],
            inProgress: [],
            underReview: [],
            completed: []
        };

        if (!tasks) {
            return columns;
        }

        tasks.forEach(task => {
            const status = task.status?.toString().toLowerCase() || '';

            if (status === 'not started') {
                columns.notStarted.push(task);
            } else if (status === 'in progress') {
                columns.inProgress.push(task);
            } else if (status === 'under review') {
                columns.underReview.push(task);
            } else if (status === 'completed') {
                columns.completed.push(task);
            } else {
                // Default to not started for any unknown status
                columns.notStarted.push(task);
            }
        });
        return columns;
    }, [tasks]);

    // Destructure for easier access
    const { notStarted, inProgress, underReview, completed } = filteredTasks;

    // Handle drag start - defined as regular functions, not inside conditional blocks
    function handleDragStart(event) {
        const { active } = event;
        if (active) {
            setActiveId(active.id);
            if (active.data?.current?.task) {
                setActiveDragData(active.data.current.task);
            }
        }
    }

    // Handle drag end
    async function handleDragEnd(event) {
        const { active, over } = event;

        if (!over || !active) {
            setActiveId(null);
            setActiveDragData(null);
            return;
        }

        // Get the column the task was dropped in
        const newStatus = over.id;

        // Get the task that was dragged
        const taskId = active.id;

        // Different formatting based on column id
        let statusText;
        switch (newStatus) {
            case 'notStarted':
                statusText = 'not started';
                break;
            case 'inProgress':
                statusText = 'in progress';
                break;
            case 'underReview':
                statusText = 'under review';
                break;
            case 'completed':
                statusText = 'completed';
                break;
            default:
                statusText = 'not started';
        }

        // Update in UI immediately for responsiveness
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, status: statusText } : task
            )
        );

        // Update in database
        try {
            const { data, error } = await supabase
                .from('tasks')
                .update({ status: statusText })
                .eq('id', taskId)
                .select();

            if (error) {
                console.error("Supabase update error:", error);
                throw error;
            }

            console.log("Update successful:", data);
        } catch (error) {
            console.error("Error updating task status:", error);
            // Revert UI changes if update fails
            fetchData();
        }

        setActiveId(null);
        setActiveDragData(null);
    }

    // TaskCard for the drag overlay
    const TaskCard = ({ task }) => (
        <Card className='bg-white rounded-lg shadow-md p-3 mb-2 opacity-80'>
            <CardHeader>
                <CardTitle className='text-gray-500 font-medium'>
                    {task.title || 'Untitled Task'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-gray-600 text-sm'>
                    {task.description || 'No Description'}
                </p>
            </CardContent>
        </Card>
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="h-full w-full p-2 md:p-4">
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 h-full">
                    <DroppableColumn
                        id="notStarted"
                        title="Not Started"
                        onTaskCreated={handleTaskCreated}
                    >
                        {loading ? (
                            <p className="text-center text-gray-500 p-4">loading..</p>
                        ) : notStarted.length === 0 ? (
                            <p className="text-center text-gray-500 p-4">No Tasks..</p>
                        ) : (
                            notStarted.map((task) => (
                                <Task key={task.id} id={task.id} task={task} />
                            ))
                        )}
                    </DroppableColumn>

                    <DroppableColumn
                        id="inProgress"
                        title="In Progress"
                        onTaskCreated={handleTaskCreated}
                    >
                        {loading ? (
                            <p className="text-center text-gray-500 p-4">loading..</p>
                        ) : inProgress.length === 0 ? (
                            <p className="text-center text-gray-500 p-4">No Tasks..</p>
                        ) : (
                            inProgress.map((task) => (
                                <Task key={task.id} id={task.id} task={task} />
                            ))
                        )}
                    </DroppableColumn>

                    <DroppableColumn
                        id="underReview"
                        title="Under Review"
                        onTaskCreated={handleTaskCreated}
                    >
                        {loading ? (
                            <p className="text-center text-gray-500 p-4">loading..</p>
                        ) : underReview.length === 0 ? (
                            <p className="text-center text-gray-500 p-4">No Tasks..</p>
                        ) : (
                            underReview.map((task) => (
                                <Task key={task.id} id={task.id} task={task} />
                            ))
                        )}
                    </DroppableColumn>

                    <DroppableColumn
                        id="completed"
                        title="Completed"
                        onTaskCreated={handleTaskCreated}
                    >
                        {loading ? (
                            <p className="text-center text-gray-500 p-4">loading..</p>
                        ) : completed.length === 0 ? (
                            <p className="text-center text-gray-500 p-4">No Tasks..</p>
                        ) : (
                            completed.map((task) => (
                                <Task key={task.id} id={task.id} task={task} />
                            ))
                        )}
                    </DroppableColumn>
                </div>

                <DragOverlay>
                    {activeId && activeDragData ? (
                        <TaskCard task={activeDragData} />
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
}

export default Stages;