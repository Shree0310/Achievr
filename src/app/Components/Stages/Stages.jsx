'use client'

import { useState, useEffect } from 'react';
import { supabase } from "@/utils/supabase/client";
import { closestCorners, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

const Stages = () => {

    const [tasks, setTasks] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeId, setActiveId] = useState(null);
    const [activeDragData, setActiveDragData] = useState(null);

    //Configure sensors for drag detection
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            }
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

    //function to filter out tasks according to the stages
    const filterTasksByStatus = () => {
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
            } else {
                columns.completed.push(task);
            }
        });
        return columns;
    }

    const { notStarted, inProgress, underReview, completed } = filterTasksByStatus();

    //Handle drag start
    function handleDragStart(event) {
        const { active } = event;
        setActiveId(active.id);
        setActiveDragData(active.data.current.task);

    }

    //Handle drag end
    async function HandleDragEnd(event) {
        const { active, over } = event;
        if (!over) {
            setActiveId(null);
            setActiveDragData(null);
            return;
        }

        //if dropped take the column in which it was dropped
        const newStatus = over.id;

        //Get the task that was dragged
        const taskId = active.id;
        const task = active.data.current.task;

        //change the status acc to the column in which task wa sdroppped
        let statusText;
        switch (newStatus) {
            case 'notStarted':
                statusText = 'not started';
                break;
            case 'inProgress':
                statusText = 'inProgress';
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

        //updating the UI immediately after
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, status: statusText } : task
            )
        );

        //update in supabase
        try {
            const { error } = await supabase
                .from('tasks')
                .update({ status: statusText })
                .eq('id', taskId)

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error(error);

            //revert the UI if update fails
            fetchData();
        }

        setActiveId(null);
        setActiveDragData(null);
    }

    //Make each column droppable by making it a component
    const DroppableColumn = ({ id, title, tasks }) => (
        <div
            id={id}
            className="bg-[#C1C1C1] h-[400px] sm:h-[450px] md:h-[500px] lg:h-[calc(100vh-220px)] rounded-lg overflow-hidden flex flex-col">
            <p className="py-3 text-center text-gray-700 text-base md:text-lg font-medium border-b border-gray-300">{title}</p>
            <div className="overflow-y-auto p-2 flex-grow">
                {loading ? (
                    <p className="text-center text-gray-500 p-4">loading..</p>
                ) : tasks.length == 0 ? (
                    <p className="text-center text-gray-500 p-4">No Tasks..</p>
                ) : (
                    tasks.map((task) => <TaskCard key={task.id} task={task} />)
                )}
            </div>
        </div>
    )

    // Task card component for consistent styling
    const TaskCard = ({ task }) => (
        <div className='bg-white rounded-lg shadow-md p-3 mb-2'>
            <p className='text-gray-500 font-medium'>
                {task.title || 'No Tasks'}
            </p>
            <p className='text-gray-600 text-sm'>
                {task.description || 'No Description'}
            </p>
        </div>
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={HandleDragEnd}
            autoScroll={true}
        >
            <div className="mx-2 md:mx-7 mt-2 relative z-10">
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Grid layout that adapts to screen size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {/* Not Started column */}
                    <DroppableColumn
                        id='notStarted' title='not started' tasks={notStarted} />


                    {/* In Progress column */}
                    <DroppableColumn
                        id='inProgress'
                        title='in progress'
                        tasks={inProgress} />

                    {/* Under Review column */}
                    <DroppableColumn
                        id='underReview'
                        title='under review'
                        tasks={underReview} />

                    {/* Completed column */}
                    <DroppableColumn
                        id='completed'
                        title='completed'
                        tasks={completed} />

                </div>
                {/* DragOverlay shows the ghost of the dragged task */}
                <DragOverlay>
                    {activeDragData && activeId ? (
                        <TaskCard task={activeDragData}/>
                    ): null}
                    
                </DragOverlay>
            </div>
        </DndContext>
    );
}


export default Stages;