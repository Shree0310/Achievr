'use client'

import { supabase } from "@/utils/supabase/client";
import Navbar from '../Navbar/Navbar';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CommentBox from "../Comments/CommentBox";
import SubtasksTab from "../Subtasks/SubtasksTab";

interface Task {
    id : string,
    title: string,
    status: string,
    cycle_id: string,
    description?: string,
    priority?: string,
    efforts?: string,
    user_id?: string 
}

interface EditTaskProps {
    taskId: string;
}

const EditTask = ({taskId}:EditTaskProps) => {
    const [task, setTask] = useState<Task | null>(null);
    const [subTasks, setSubTasks] = useState<Task[]>([]);
    const [addSubTaskMode, setAddSubtaskMode] = useState(false);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
    const [newSubtaskDes, setNewSubtaskDes] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [efforts, setEfforts] = useState("");
    const [userId, setUserId] = useState<string | undefined>("");

    const fetchSubTask = async () => { 
        try{
            const {data, error} = await supabase
                .from("tasks")
                .select("*")
                .eq("parent_task_id", taskId);
            
            if(error) throw error;

            setSubTasks(data || []); // Handle null case
        }
        catch(error){
            console.error("Error while fetching the subtasks", error);
        }
    }

    const fetchTask = async ()=>{
        try{
            setLoading(true);
            const {data, error} = await supabase
                .from('tasks')
                .select('*')
                .eq('id', taskId)
                .single();
            
            if(error) throw error;

            if(!data){
                router.push('/board');
                return;
            }
            setTask(data);

            setTitle(data.title || "");
            setDescription(data.description || "");
            setEfforts(data.efforts || "");
            setPriority(data.priority || "");
            setStatus(data.status || "");
            setUserId(data.user_id || "");
        }
        catch(error){
            console.error('Error in fetching the task', error);
            router.push('/board');
        } finally {
            setLoading(false);
        }
    }

    const handleNewSubtask = () => {
        setAddSubtaskMode(!addSubTaskMode);
    }

    const handleSave = async() => {
        try{
            const {error} = await supabase
                .from("tasks")
                .update({
                    title: title,
                    description: description,
                    status: status || null,
                    priority: priority || null,
                    efforts: efforts || null,
                })
                .eq('id', taskId);

            if(error) throw error;
            
            // Optional: Show success message or redirect
            console.log('Task updated successfully');
        }
        catch(error) {
            console.error('error while updating the task', error);              
        }
    }

    const handleAddSubtask = async (taskTitle: string, taskDescription: string) => {
        if (!task) return;
        try {
            const {data, error} = await supabase
                .from("tasks")
                .insert([
                    {
                        title: taskTitle.trim(),
                        description: taskDescription,
                        priority: "3", // Default to low priority
                        efforts: "1", // Default to 1 story point
                        status: "not_started", // Default status
                        user_id: userId,
                        parent_task_id: task.id,
                        cycle_id: task.cycle_id
                    }
                ])
                .select();

                if(error) throw error;

                await fetchSubTask();
                setNewSubtaskTitle("");
                setNewSubtaskDes("");
                setAddSubtaskMode(false);
                
        }
        catch(error){
            console.error("Error in adding subtasks", error)
        }
    }

    useEffect(() => {
        fetchTask();
        fetchSubTask(); // Fixed typo
    },[taskId])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-gray-600 dark:text-gray-400">Loading task...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <div className="left-0 top-0 h-full w-40">
                <Navbar/>
            </div>
            <div className="flex-1 ml-32 p-8">
                <div className="flex justify-between max-w-4xl">
                    <button onClick={() => router.back()}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex items-center gap-2"
                    >
                        ← Back to Board
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 ml-14 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                        Save Changes
                    </button>
                </div>
                {task && 
                    <div>
                        <div>
                            <input
                                type="text"
                                placeholder="Enter task title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-2 py-8 text-3xl placeholder:text-xl border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-white dark:bg-gray-900"
                            />
                        </div>
                
                        {/* Description Input */}
                        <div>
                            <textarea
                              placeholder="Enter task description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              rows={2}
                              className="w-full px-2 py-2 h-28 border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-white dark:bg-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                        
                        <div className="flex flex-row gap-3">
                          {/* Status Change */}
                            <div>
                              <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-30 px-4 py-2 bg-white dark:bg-gray-700 rounded-md appearance-none">
                                <option value="" disabled>
                                   Status
                                </option>
                                <option value="not started">Not started</option>
                                <option value="in progress">In Progress</option>
                                <option value="under review">Under Review</option>
                                <option value="completed">Completed</option>
                              </select>
                            </div>
                            
                            {/* Priority and Effort Selection */}
                            <div>
                              <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-30 px-2 py-2 bg-white dark:bg-gray-700 rounded-md appearance-none">                    
                                <option value="" disabled>
                                  Select Priority
                                </option>
                                <option value="1">High Priority (P1)</option>
                                <option value="2">Medium Priority (P2)</option>
                                <option value="3">Low Priority (P3)</option>
                              </select>
                            </div>
            
                            <div>
                              <select
                                value={efforts}
                                onChange={(e) => setEfforts(e.target.value)}
                                className="w-24 px-4 py-2 bg-white dark:bg-gray-700 rounded-md appearance-none">                    
                                <option value="" disabled>
                                  Select Points
                                </option>
                                <option value="1">1 Point</option>
                                <option value="2">2 Points</option>
                                <option value="3">3 Points</option>
                                <option value="5">5 Points</option>
                                <option value="8">8 Points</option>
                              </select>
                            </div>
                        </div>
                        
                        <div className="py-4 px-4 mt-8">
                            <div className="flex justify-between">
                                <h1 className="text-lg py-4 font-semibold">Subtasks</h1>
                                <button className="text-lg py-4 h-6 px-4 font-semibold" onClick={handleNewSubtask}>+</button>
                            </div>
                            <SubtasksTab 
                                subTasks={subTasks}
                                taskToEdit={task} 
                                userId={userId} 
                                onSubtaskCreated={fetchSubTask} // Better than window.location.reload()
                            />
                            {addSubTaskMode && <div className="div">
                                <div className="dark:bg-gray-800 my-4 rounded-md">
                                    <input 
                                        type="text"
                                        className="w-full pt-2 px-3 mt-2 h-10 text-gray-500 focus-visible:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible::border-none dark:text-gray-500 text-sm bg-gray-100 dark:bg-gray-800 placeholder:text-sm" 
                                        placeholder="Sub task title"
                                        value={newSubtaskTitle}
                                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                    />
                                    <input 
                                        type="text"
                                        className="w-full px-3 h-10 text-gray-500 focus-visible:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible::border-none dark:text-gray-500 text-sm bg-gray-100 dark:bg-gray-800 placeholder:text-sm"  
                                        placeholder="Add Description"
                                        value={newSubtaskDes}
                                        onChange={(e) => setNewSubtaskDes(e.target.value)}
                                    />
                                </div>
                                    <button onClick={() => handleAddSubtask(newSubtaskTitle, newSubtaskDes)}
                                        className="px-3 text-gray-600 hover:text-gray-900 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex items-center gap-2">Add subtask
                                    </button>
                            </div>
                            }
                        </div>
                        
                        <div className="py-4 px-4 mt-8">
                            <h1 className="text-lg font-semibold">Activity</h1>
                            <CommentBox taskToEdit={task} userId={userId}/>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default EditTask;