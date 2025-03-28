'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const TaskQueue = () =>{

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tasks, setTasks]= useState([]);

    useEffect(()=>{
        fetchData();
    },[])

    async function fetchData(){
        const {data: tasks, error} = await supabase
        .from('tasks')
        .select('*');

        if(error){
            throw error;
        }

        setTasks(tasks || []);
        // console.log("tasks", tasks);
        
    }

    return <>
    <div className="text-primary-500 font-bold text-lg m-4">Upcoming Tasks</div>
    <div className="rounded-md border m-4">
        <Table>
            <TableHeader className="">
                <TableRow className="bg-primary-300">
                        <TableHead className="border-r border-gray-400 text-black text-center">Title</TableHead>
                        <TableHead className="border-r border-gray-400 text-black text-center">Status</TableHead>
                        <TableHead className="border-r border-gray-400 text-black text-center">Priority</TableHead>
                        <TableHead className="border-r border-gray-400 text-black text-center">Efforts</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="bg-primary-100">
                {tasks.map((task) =>(
                    <TableRow 
                    key={task.id}
                    className="text-center">
                    <TableCell className=" border-l-primary-500 border-r border-gray-400">{task.title} </TableCell>
                    <TableCell className="border-r border-gray-400">{task.status}</TableCell>
                    {task.priority ? (
                        <TableCell className="border-r border-gray-400">{task.priority}</TableCell>

                    ):(
                        <TableCell className="border-r border-gray-400">priority is not set</TableCell>
                    )}
                    {task.efforts ? (
                        <TableCell className="border-r border-gray-400">{task.efforts}</TableCell>
                    ):(
                        <TableCell className="border-r border-gray-400">efforts not set</TableCell>

                    )}
                </TableRow>
                ))}         
            </TableBody>
        </Table>
    </div>
    </>
}
export default TaskQueue;