'use client'

import { supabase } from "@/utils/supabase/client";
import Navbar from '../Navbar/Navbar';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
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
    userId?: string
}

interface EditTaskProps {
    taskId: string;
}


const EditTask = ({taskId}:EditTaskProps) => {
    const [task, setTask] = useState<Task | null>(null);
    const [subTasks, setSubTasks] = useState<Task[]>([]);
    const [userId, setUserId] = useState(task?.userId)
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [status, setStatus] = useState(task?.status || "");
    const [priority, setPriority] = useState(
        task?.priority?.toString() || ""
    );
    const [efforts, setEfforts] = useState(task?.efforts?.toString() || "");


    const fectSubTask = async () => {
        try{
            const {data, error} = await supabase
                .from("tasks")
                .select("*")
                .not("parent_task_id", 'is', null);
            
                if(error) throw error;

            setSubTasks(data);
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

    const handleSave = async() => {

        try{
            const {data, error} = await supabase
            .from("tasks")
            .update([
                {
                    title: title,
                    description: description,
                    status: status === null ? "" : status,
                    priority: priority === null ? "" : priority,
                    efforts: efforts === null ? "" : efforts,
                }
            ])
            .eq('id', taskId)
            .select();

            if(error) throw error;
        }
        catch(error) {
            console.error('error while updating the task', error);              
        }
        
    }

    useEffect(() => {
        fetchTask();
        fectSubTask();
    },[taskId])

    return (
        <div className="flex min-h-screen ">
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
                                        className="w-30 px-4 py-2 bg-white dark:bg-gray-700 rounded-md appearance-none ">
                                        <option value="" disabled>
                                           Status
                                        </option>
                                        <option value="Not started">Not started</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Under Review">Under Review</option>
                                        <option value="Completed">Completed</option>
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
                                        <option value=" " disabled>
                                          Select Points
                                        </option>
                                        <option value="1">1 Point</option>
                                        <option value="2">2 Points</option>
                                        <option value="3">3 Points</option>
                                        <option value="5">5 Points</option>
                                        <option value="8">8 Points</option>
                                      </select>
                                    </div>                                    
                    
                                    {/* Cycle Selection */}
                                  {/* <div>
                                    <select
                                      value={selectedCycle}
                                      onChange={(e) => setSelectedCycle(e.target.value)}
                                        className="w-32 px-4 py-2 bg-white dark:bg-gray-700 rounded-md appearance-none ">                    
                                      <option value="" disabled>
                                        Select Cycle
                                      </option>
                                      {cycles.map((cycle) => (
                                        <option key={cycle.id} value={cycle.id}>
                                          {cycle.title}
                                        </option>
                                      ))}
                                    </select>
                                  </div> */}
                                    
                                </div>
                                <div className="py-4 px-4 mt-8 ">
                                    <h1 className="text-lg font-semibold">Siubtasks</h1>

                                    {subTasks &&  <SubtasksTab 
                                        subTasks={subTasks}
                                        taskToEdit={task} 
                                        userId={userId} 
                                        onSubtaskCreated={() => {
                                            // Refresh subtasks by reloading the page
                                            window.location.reload();
                                        }}
                                    /> }
                                </div>
                                <div className="py-4 px-4 mt-8 ">
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