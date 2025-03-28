'use client'

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import DeleteTask from "../DeleteTask/DeleteTask";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CreateTask = ({ isEditMode = false, taskToEdit = null, onClose, userId }) => {
    const [title, setTitle] = useState(taskToEdit?.title || '');
    const [description, setDescription] = useState(taskToEdit?.description || '');
    const [priority, setPriority] = useState(taskToEdit?.priority?.toString() || '');
    const [efforts, setEfforts] = useState(taskToEdit?.efforts?.toString() || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cycles, setCycles] = useState([]);
    const [selectedCycle, setSelectedCycle] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {

        if (isEditMode && taskToEdit) {
            setTitle(taskToEdit.title || '');
            setDescription(taskToEdit.description || '');
            setPriority(taskToEdit.priority?.toString() || '');
            setEfforts(taskToEdit.efforts?.toString() || '')
            setSelectedCycle(taskToEdit.cycle_id || '')
        }



        const fetchCycles = async () => {
            const { data, error } = await supabase
                .from('cycles')
                .select('id, title')
                .order('created_at', { ascending: false });

            if (error) {
                console.log("Error in fetching cycles", error);
            }
            try {
                if (data && data.length > 0) {
                    setCycles(data);

                    if (isEditMode && taskToEdit?.cycle_id) {
                        console.log("cycle id", taskToEdit.cycle_id);
                        setSelectedCycle(taskToEdit?.cycle_id);
                        console.log("selected cycle id:", selectedCycle);
                    }
                    else if (!selectedCycle) {
                        setSelectedCycle(data[0].id)

                    }

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
                        {
                            title: title,
                            description: description,
                            priority: priority === null ? '' : priority,
                            efforts: efforts === null ? '' : efforts,
                            cycle_id: selectedCycle,
                            user_id: userId
                        }
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
            if (onClose) onClose();

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

    return (
        <>
            <div className={`fixed bg-black bg-opacity-50 z-50 ${!isEditMode ? "inset-0 flex justify-center py-36 px-20" : "inset-0 flex justify-end pt-36 pl-20 pb-5"} `}>
                <div className="bg-primary-100 w-1/2 h-full rounded-lg shadow-md">
                    <div className="bg-primary-500 h-12 px-8 py-2 flex justify-between items-center text-black text-lg shadow-sm">
                        <h1 className=" ">{!isEditMode ? 'Create a task' : 'Edit Task'}
                            {/* <span className="bg-black text-lg"
                             onClick={onClose}>x</span> */}
                        </h1>

                        {isEditMode && (
                            <div className="relative">
                                <div
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className=" cursor-pointer hover:bg-gray-300 rounded-full p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </div>
                                {isMenuOpen && (
                                    <DeleteTask
                                        taskToDelete={taskToEdit.id} />
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col p-10 space-y-4">
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
                                <p>{error}</p>
                            </div>
                        )}
                        <Input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-12 px-8 py-2 border border-gray-500 rounded-md shadow-sm focus:border-blue-500" />
                        <Input
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-24 px-8 py-2 border border-gray-500 rounded-md shadow-sm focus:border-blue-500"
                        />
                        <div className={`flex ${!isEditMode ? "justify-center space-x-2" : "flex-col space-y-4"}`}>
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
                                <option value=" " disabled>Efforts</option>
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
                                {cycles.map(cycle => (
                                    <option key={cycle.id} value={cycle.id}>{cycle.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className={`flex  space-x-2 ${!isEditMode ? "justify-end px-10 py-6" : "justify-start py-8"}`}>
                            <Button
                                onClick={onClose}
                                className="bg-[#D9D9D9] hover:bg-gray-400 text-black font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateTask}
                                disabled={isLoading}
                                className="bg-primary-400 hover:bg-primary-500 font-medium py-2 px-4 rounded-md hover:cursor-pointer text-white disabled:opacity-50">
                                {isEditMode ? 'Update' : 'Create Task'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateTask;