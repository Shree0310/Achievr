'use client'

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

const CreateTask = ({ isEditMode = false, taskToEdit = null, onClose, userId }) => {
    const [isOpen, setIsOpen] = useState(isEditMode);
    const [title, setTitle] = useState(taskToEdit?.title);
    const [description, setDescription] = useState(taskToEdit?.description);
    const [priority, setPriority] = useState(taskToEdit?.priority);
    const [efforts, setEfforts] = useState(taskToEdit?.efforts);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cycles, setCycles] = useState([]);
    const [selectedCycle, setSelectedCycle] = useState('');

    useEffect(() => {

        if (isEditMode && taskToEdit) {
            setTitle(taskToEdit.title || '');
            setDescription(taskToEdit.description || '');
            setPriority(taskToEdit.efforts || '');
            setEfforts(taskToEdit.efforts || '')
        }



        const fetchCycles = async () => {
            const { data, error } = await supabase
                .from('cycles')
                .select('id', 'name')
                .order('created_at', { ascending: false });

            if (error) {
                console.log("Error in fetching cycles", error);
            }
            try {
                if (data && data.length > 0) {
                    setCycles(data);
                    setSelectedCycle(data[0].id)

                }
            } catch (error) {
                console.log("cycle id not found");
            }
        }

        fetchCycles();
    }, [isEditMode, taskToEdit])

    const handleCreateTask = async () => {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        if (!userId) {
            console.log("Missing userId prop:", userId);
            setError("User not authenticated. Please sign in again.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (!userId) {
                console.log("user id is missing")
            }
            if (!selectedCycle) {
                console.log('cycle id of selected cycle is missing');
            }

            if (isEditMode && taskToEdit) {
                //update a task in supabase
                const { data, error } = await supabase
                    .from('tasks')
                    .update([
                        title,
                        description,
                        priority || null,
                        efforts || null
                    ])
                    .eq('id', taskToEdit.id)
                    .select();
                if (error) throw error;
                console.log("Task created successfully:", data);

            } else {
                // Insert task into Supabase
                const { data, error } = await supabase
                    .from('tasks')
                    .insert([
                        {
                            title,
                            description,
                            priority: priority || null,
                            efforts: efforts || null,
                            status: 'not started', // Default status
                            user_id: userId,
                            cycle_id: selectedCycle
                        }
                    ])
                    .select();
                if (error) throw error;
                console.log("Task update successfully:", data);
            }

            // Reset form and close modal
            resetForm();
            setIsOpen(false);
            closeModal();

            // Refresh the page to show the new task (could be optimized later)
            window.location.reload();

        } catch (error) {
            console.error("Error creating task:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        if (!isEditMode) {
            setTitle('');
            setDescription('');
            setPriority('');
            setEfforts('');
            setError(null);
        }
    };

    const closeModal = () => {
        resetForm();
        setIsOpen(false);
        if(isEditMode && taskToEdit){
            onClose();
        }
    };

    const createTask = !isEditMode ? (
        <div className="absolute h-4 w-44 z-30 top-4 left-4 py-12 rounded-md">
            <div className="bg-[#D9D9D9] p-2 shadow-md rounded-md">
                <button className="text-gray-800 items-center"
                    onClick={() => setIsOpen(true)}>Create Task</button>
            </div>
            </div>
    ): null;

    return (
        <>
        {isOpen && (
            <div className="fixed inset-0 flex justify-center py-36 px-20 bg-black bg-opacity-50 z-50">
                <div className="bg-[#F4EEEE] w-1/2 h-full rounded-lg shadow-md">
                    <h1 className="bg-[#D9D9D9] h-12 px-8 py-2 text-black text-lg shadow-sm rounded-md">{!isEditMode? 'Create a task': 'Edit Task'}</h1>
                    <div className="flex flex-col p-10 space-y-4">
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
                                <p>{error}</p>
                            </div>
                        )}
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-12 px-8 py-2 border border-gray-500 rounded-md shadow-sm focus:border-blue-500" />
                        <input
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-24 px-8 py-2 border border-gray-500 rounded-md shadow-sm focus:border-blue-500"
                        />
                        <div className="flex justify-center space-x-2">
                            <select
                                className="w-1/2 px-8 py-2 border border-gray-500 rounded-md shadow-sm focus:border-blue-500"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="" disabled>Priority</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>

                            <select
                                className="w-1/2 px-8 py-2 border border-gray-500 rounded-md shadow-sm focus:border-blue-500"
                                value={efforts}
                                onChange={(e) => setEfforts(e.target.value)}
                            >
                                <option value="" disabled>Efforts</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="5">5</option>
                                <option value="8">8</option>
                            </select>
                            <select className="w-1/2 px-8 py-2 border border-gray-500 rounded-md shadow-sm focus:border-blue-500"
                                value={selectedCycle}
                                onChange={(e) => setSelectedCycle(e.target.value)}>
                                <option value='' disabled>Select cycle</option>
                                {cycles.map(cycle => {
                                    <option key={cycle.id} value={cycle.id}>{cycle.title}</option>
                                })}
                            </select>
                        </div>
                        <div className="flex px-4 space-x-2 justify-end">
                            <button
                                onClick={closeModal}
                                className="bg-[#D9D9D9] hover:bg-gray-300 text-black font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateTask}
                                disabled={isLoading}
                                className="bg-[#AA96AF] hover:bg-violet-500 font-medium py-2 px-4 rounded-md hover:cursor-pointer text-white disabled:opacity-50">
                                {isLoading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
   </>
    );
};

export default CreateTask;