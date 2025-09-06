'use client'

import { useState, useEffect, useMemo } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { supabase } from "@/utils/supabase/client";
import Task from '../Task/Task';
import DroppableColumn from '../DroppableColumn/DroppableColumn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Subtasks from "@/app/Components/Subtasks/Subtasks";

const Stages = ({ className = "", onTaskUpdate, userId }) => {
    const [tasks, setTasks] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeId, setActiveId] = useState(null);
    const [activeDragData, setActiveDragData] = useState(null);
    const [commentCounts, setCommentCounts] = useState({});
    const [subTasks, setSubTasks] = useState(null);
    const [subTaskId, setSubTaskId] = useState(null);
    const [subTasksCount, setSubTaskCount] = useState({});

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

    // Fetch comment counts and subtask counts for all tasks
    useEffect(() => {
        if (tasks && tasks.length > 0) {
            fetchCommentCounts();
            fetchSubtasks();
        }
    }, [tasks]);

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

    const fetchSubtasks = async () => {
        try{
            const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .not('parent_task_id', 'is', null);
        
            if(error) {
                throw error;
            }
        setSubTasks(data);
        const count = {};
        data.forEach(subtask => {
            count[subtask.parent_task_id] = (count[subtask.parent_task_id] || 0) + 1;
        })
        setSubTaskCount(count);
        }catch(error){
            console.error("Error while fetching the subtasks", error);
        }
            
    }

    // Fetch comment counts for all tasks at once
    const fetchCommentCounts = async () => {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select('task_id')
                .in('task_id', tasks.map(task => task.id));

            if (error) {
                console.error('Error fetching comment counts:', error);
                return;
            }

            // Count comments per task
            const counts = {};
            data.forEach(comment => {
                counts[comment.task_id] = (counts[comment.task_id] || 0) + 1;
                });

            setCommentCounts(counts);
        } catch (error) {
            console.error('Error fetching comment counts:', error);
        }
    };

    // Handle new task created
    const handleTaskCreated = (newTask) => {
        setTasks(prevTasks => [...(prevTasks || []), newTask]);
    };

    // Handle task updates, deletions, and creations
    const handleTaskUpdates = (action, data) => {
        switch (action) {
            case "create":
                setTasks(prevTasks => [...(prevTasks || []), data]);
                break;
            case "update":
                setTasks(prevTasks => prevTasks.map(task => task.id === data.id ? data : task));
                break;
            case "delete":
                setTasks(prevTasks => prevTasks.filter(task => task.id !== data));
                break;
            default:
                break;
        }
        
        // Refresh comment counts and subtask counts after any task update
        setTimeout(() => {
            if (tasks && tasks.length > 0) {
                fetchCommentCounts();
                fetchSubtasks();
            }
        }, 100);
    };

    // Handle subtask visibility toggle
    const toggleSubtasks = (taskId) => {
        setSubTaskId(subTaskId === taskId ? null : taskId);
    };

    // Expose the handleTaskUpdates function to parent components
    useEffect(() => {
        if (onTaskUpdate) {
            onTaskUpdate(handleTaskUpdates);
        }
    }, [onTaskUpdate]);

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

    // Destructure the filtered tasks
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
        <Card className='bg-white/90 dark:bg-gray-800 backdrop-blur-sm rounded-lg p-4 border border-primary-200 dark:border-blue-500 shadow-lg dark:shadow-gray-900/30 cursor-grabbing min-w-[200px]'>
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                        {task.title || 'Untitled Task'}
                    </h3>
                </div>
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
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{task.efforts} SP</span>
                    </div>
                )}
            </div>
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
                        headerColor="bg-blue-500"
                        onTaskCreated={handleTaskCreated}
                    >
                        {loading ? (
                            <p className="text-center text-gray-500 p-4">loading..</p>
                        ) : notStarted.length === 0 ? (
                            <p className="text-center text-gray-500 p-4">No Tasks..</p>
                        ) : (
                            notStarted.map((task) => {
                                return (
                                <div key={`task-${task.id}`}>
                                    <Task 
                                        id={task.id} 
                                        task={task} 
                                        onTaskUpdate={handleTaskUpdates} 
                                        commentCount={commentCounts[task.id] || 0}
                                        onToggleSubtasks={() => toggleSubtasks(task.id)}
                                        showSubtasks={subTaskId === task.id}
                                        subTasksCount={subTasksCount[task.id] || 0}
                                        subTasks={subTasks ? subTasks.filter(subtask => subtask.parent_task_id === task.id) : []}                                    />
                                    {subTasks && subTaskId === task.id && (
                                        <Subtasks 
                                            subTasks={subTasks.filter(subtask => subtask.parent_task_id === task.id)} 
                                            taskToEdit={task}
                                            userId={userId}
                                            onSubtaskCreated={fetchSubtasks}
                                        />
                                    )}
                                </div>
                                );
                            })
                        )}

                    </DroppableColumn>

                    <DroppableColumn
                        id="inProgress"
                        title="In Progress"
                        headerColor="bg-amber-500"
                        onTaskCreated={handleTaskCreated}
                    >
                        {loading ? (
                            <p className="text-center text-gray-500 p-4">loading..</p>
                        ) : inProgress.length === 0 ? (
                            <p className="text-center text-gray-500 p-4">No Tasks..</p>
                        ) : (
                            inProgress.map((task) => (
                                <div key={`task-${task.id}`}>
                                    <Task 
                                        id={task.id} 
                                        task={task} 
                                        onTaskUpdate={handleTaskUpdates} 
                                        commentCount={commentCounts[task.id] || 0}
                                        onToggleSubtasks={() => toggleSubtasks(task.id)}
                                        showSubtasks={subTaskId === task.id}
                                        subTasksCount={subTasksCount[task.id] || 0}
                                        subTasks={subTasks ? subTasks.filter(subtask => subtask.parent_task_id === task.id) : []}                                    />
                                    {subTasks && subTaskId === task.id && (
                                        <Subtasks 
                                            subTasks={subTasks.filter(subtask => subtask.parent_task_id === task.id)} 
                                            taskToEdit={task}
                                            userId={userId}
                                            onSubtaskCreated={fetchSubtasks}
                                        />
                                    )}
                                </div>
                            ))
                        )}
                    </DroppableColumn>

                    <DroppableColumn
                        id="underReview"
                        title="Under Review"
                        headerColor="bg-slate-500"
                        onTaskCreated={handleTaskCreated}
                    >
                        {loading ? (
                            <p className="text-center text-gray-500 p-4">loading..</p>
                        ) : underReview.length === 0 ? (
                            <p className="text-center text-gray-500 p-4">No Tasks..</p>
                        ) : (
                            underReview.map((task) => (
                                <div key={`task-${task.id}`}>
                                    <Task 
                                        id={task.id} 
                                        task={task} 
                                        onTaskUpdate={handleTaskUpdates} 
                                        commentCount={commentCounts[task.id] || 0}
                                        onToggleSubtasks={() => toggleSubtasks(task.id)}
                                        showSubtasks={subTaskId === task.id}
                                        subTasksCount={subTasksCount[task.id] || 0}
                                        subTasks={subTasks ? subTasks.filter(subtask => subtask.parent_task_id === task.id) : []}                                    />
                                    {subTasks && subTaskId === task.id && (
                                        <Subtasks 
                                            subTasks={subTasks.filter(subtask => subtask.parent_task_id === task.id)} 
                                            taskToEdit={task}
                                            userId={userId}
                                            onSubtaskCreated={fetchSubtasks}
                                        />
                                    )}
                                </div>
                            ))
                        )}
                    </DroppableColumn>

                    <DroppableColumn
                        id="completed"
                        title="Completed"
                        headerColor="bg-emerald-500"
                        onTaskCreated={handleTaskCreated}
                    >
                        {loading ? (
                            <p className="text-center text-gray-500 p-4">loading..</p>
                        ) : completed.length === 0 ? (
                            <p className="text-center text-gray-500 p-4">No Tasks..</p>
                        ) : (
                            completed.map((task) => (
                                <div key={`task-${task.id}`}>
                                    <Task 
                                        id={task.id} 
                                        task={task} 
                                        onTaskUpdate={handleTaskUpdates} 
                                        commentCount={commentCounts[task.id] || 0}
                                        onToggleSubtasks={() => toggleSubtasks(task.id)}
                                        showSubtasks={subTaskId === task.id}
                                        subTasksCount={subTasksCount[task.id] || 0}
                                        subTasks={subTasks ? subTasks.filter(subtask => subtask.parent_task_id === task.id) : []}                                    />
                                    {subTasks && subTaskId === task.id && (
                                        <Subtasks 
                                            subTasks={subTasks.filter(subtask => subtask.parent_task_id === task.id)} 
                                            taskToEdit={task}
                                            userId={userId}
                                            onSubtaskCreated={fetchSubtasks}
                                        />
                                    )}
                                </div>
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