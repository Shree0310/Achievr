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
        <div className="div">
            <Navbar></Navbar>
            {/* <EditTask taskToEdit></EditTask> */}
            <div className="flex justify-center">
                {task && <h3>{task.title}</h3>}
            </div>
        </div>
    )
}

export default EditTask;