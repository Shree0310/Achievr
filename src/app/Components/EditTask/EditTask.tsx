'use client'

import { supabase } from "@/utils/supabase/client";
import Navbar from '../Navbar/Navbar';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Task {
    id : string,
    title: string,
    status: string,
    cycle_id: string,
    description?: string,
    priority?: string,
    efforts?: string
}

interface EditTaskProps {
    taskId: string;
}


const EditTask = ({taskId}:EditTaskProps) => {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
        }
        catch(error){
            console.error('Error in fetching the task', error);
            router.push('/board');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTask();
    },[taskId, router])

    return (
        <div className="flex min-h-screen ">
            <div className="left-0 top-0 h-full w-40">
                <Navbar/>
            </div>
            <div className="flex-1 ml-40 p-8">
                <div className="mx-auto max-w-4xl">
                    <button onClick={() => router.back()}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex items-center gap-2"
                    >
                        ← Back to Board
                    </button>
                </div>
                {task && 
                    <div className="pr-24">
                        <h3 className="p-4 m-4 inset-y-0 inset-x-0">{task.title}</h3>
                        <p>{task.description}</p>
                    </div>
                    }
            </div>
        </div>
    )
}

export default EditTask;