'use client'

import { useState, useEffect } from 'react';
import { supabase } from "@/utils/supabase/client";

const Stages = () => {

    const [tasks, setTasks] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            console.log(status);

            if (status === 'not started') {
                columns.notStarted.push(task);
            } else if (status == 'in progress') {
                columns.inProgress.push(task);
            } else if (status == 'under review') {
                columns.underReview.push(task);
            } else {
                columns.completed.push(task);
            }
        });
        return columns;
    }

    const { notStarted, inProgress, underReview, completed } = filterTasksByStatus();

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

    return <div className="mx-2 md:mx-7 mt-2 relative z-10">
        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        )}

        {/* Grid layout that adapts to screen size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {/* Not Started column */}
            <div className="bg-[#C1C1C1] h-[400px] sm:h-[450px] md:h-[500px] lg:h-[calc(100vh-220px)] rounded-lg overflow-hidden flex flex-col">
                <p className="py-3 text-center text-gray-700 text-base md:text-lg font-medium border-b border-gray-300">Not Started</p>
                <div className="overflow-y-auto p-2 flex-grow">
                    {loading ? (
                        <p className="text-center text-gray-500 p-4">loading..</p>
                    ): notStarted.length == 0 ? (
                        <p className="text-center text-gray-500 p-4">No Tasks..</p>
                    ):(
                        notStarted.map((task)=> <TaskCard key={task.id} task ={task}/>)
                    )}
                </div>
            </div>

            {/* In Progress column */}
            <div className="bg-[#C1C1C1] h-[400px] sm:h-[450px] md:h-[500px] lg:h-[calc(100vh-220px)] rounded-lg overflow-hidden flex flex-col">
                <p className="py-3 text-center text-gray-700 text-base md:text-lg font-medium border-b border-gray-300">In Progress</p>
                <div className="overflow-y-auto p-2 flex-grow">
                {loading ? (
                    <p className="text-center text-gray-500 p-4">Loading...</p>
                ): inProgress.length == 0 ? (
                    <p className="text-center text-gray-500 p-4">No Tasks..</p>
                ):(
                    inProgress.map(task => <TaskCard key={task.id} task={task}/>)
                )}
                </div>
            </div>

            {/* Under Review column */}
            <div className="bg-[#C1C1C1] h-[400px] sm:h-[450px] md:h-[500px] lg:h-[calc(100vh-220px)] rounded-lg overflow-hidden flex flex-col">
                <p className="py-3 text-center text-gray-700 text-base md:text-lg font-medium border-b border-gray-300">Under Review</p>
                <div className="overflow-y-auto p-2 flex-grow">
                    {loading ? (
                        <p className="text-center text-gray-500 p-4">Loading..</p>
                    ): underReview.length ==0 ? (
                        <p className="text-center text-gray-500 p-4">No Tasks..</p>
                    ):(
                        underReview.map(task => <TaskCard key={task.id} task={task}/>)
                    )}
                </div>
            </div>

            {/* Completed column */}
            <div className="bg-[#C1C1C1] h-[400px] sm:h-[450px] md:h-[500px] lg:h-[calc(100vh-220px)] rounded-lg overflow-hidden flex flex-col">
                <p className="py-3 text-center text-gray-700 text-base md:text-lg font-medium border-b border-gray-300">Completed</p>
                <div className="overflow-y-auto p-2 flex-grow">
                    {loading ? (
                        <p className="text-center text-gray-500 p-4">Loading...</p>
                    ) : completed.length === 0 ? (
                        <p className="text-center text-gray-500 p-4">No tasks</p>
                    ) : (
                        completed.map(task => <TaskCard key={task.id} task={task}/>)
                    )}
                </div>
            </div>
        </div>
    </div>
}

export default Stages;