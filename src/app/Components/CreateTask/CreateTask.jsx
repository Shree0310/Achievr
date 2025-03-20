'use client'

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

const CreateTask = ({userId}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [efforts, setEfforts] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cycles, setCycles] = useState([]);
    const [selectedCycle, setSelectedCycle] = useState('');

    useEffect(()=>{
        const fetchCycles = async()=>{
          const {data, error} = await supabase
          .from('cycles')
          .select('id', 'name')
          .order('created_at',{ ascending: false});

          if(error){
            console.log("Error in fetching cycles", error);
          }
          try{
            if(data && data.length>0){
                setCycles(data);
                setSelectedCycle(data[0].id)

            }
          }catch(error){
            console.log("cycle id not found");
          }
        }

        fetchCycles();
      }, [])

    // useEffect(()=>{
    //     const getUserID = async()=>{

    //         try{
    //               const {data, error} = await supabase.auth.getUser();

    //               if(error){
    //                 console.log('Error getting user', error);
    //               }
    
    //             console.log(data?.user);
    //             if(data?.user?.id){
    //                 console.log("User Id is :" , data?.user?.id);
    //                 setUserId(data.user.id);
    //             }
    //             console.log("userID"+userId);
    //         }catch(error){
    //             console.log('Couldnt find the user ID', error );
    //         }
            

            
    //     };

    //     getUserID();
    // }, []);

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
            if(!userId){
            console.log("user id is missing")
            }
            if(!selectedCycle){
                console.log('cycle id of selected cycle is missing');
            }
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

            console.log("Task created successfully:", data);
            
            // Reset form and close modal
            resetForm();
            setIsOpen(false);
            
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
        setTitle('');
        setDescription('');
        setPriority('');
        setEfforts('');
        setError(null);
    };

    const handleCancel = () => {
        resetForm();
        setIsOpen(false);
    };

    return <div>
        <div className="absolute h-4 w-44 z-30 top-4 left-4 py-12 rounded-md">
            <div className="bg-[#D9D9D9] p-2 shadow-md rounded-md">
                <button className="text-gray-800 items-center"
                    onClick={() => setIsOpen(!isOpen)}>Create Task</button>
            </div>
        </div>
        {isOpen && (
            <div className="fixed inset-0 flex justify-center py-36 px-20 bg-black bg-opacity-50 z-50">
                <div className="bg-[#F4EEEE] w-1/2 h-full rounded-lg shadow-md">
                    <h1 className="bg-[#D9D9D9] h-12 px-8 py-2 text-black text-lg shadow-sm rounded-md">Create a task</h1>
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
                            className="h-12 px-8 py-2 border border-gray-500 rounded-md shadow-sm focus:border-blue-500"/>
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
                                    onChange={(e)=> setSelectedCycle(e.target.value)}>
                                <option value='' disabled>Select cycle</option>
                                {cycles.map(cycle =>{
                                    <option key={cycle.id} value={cycle.id}>{cycle.title}</option>
                                })}
                            </select>  
                        </div>
                        <div className="flex px-4 space-x-2 justify-end">
                            <button 
                                onClick={handleCancel}
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
    </div>
}

export default CreateTask;