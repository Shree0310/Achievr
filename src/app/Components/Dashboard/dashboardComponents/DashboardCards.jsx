"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";


const DashboardCards = () =>{
    const [statusData, setStatusData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const { data, error } = await supabase
        .from('tasks')
        .select('*');

        if(error){
            throw error;
        }

        const statusCount = {};
        data.forEach(task => {
            const status = task.status;
            statusCount[status] = (statusCount[status] || 0) + 1;
        })

        const formattedData = Object.keys(statusCount).map(status => ({
            status: status,
            count: statusCount[status]
        }));

        setStatusData(formattedData);
        console.log(formattedData);

    }


    return  <div className="flex gap-4">
     <div  className="h-40 w-[340px] rounded-lg border-gray-700 border-double shadow-sm shadow-gray-400 bg-white">
     <p className="text-center py-4 text-md">Not Started</p>
     <p className="text-center py-4 text-4xl font-bold">
        {statusData.find(task => task.status == 'not started')?.count || 0 }
        <span className="text-sm text-gray-600 px-1">Tasks</span>
     </p>
    </div>
    <div  className="h-40 w-[340px] rounded-lg  border-gray-700 border-double shadow-sm shadow-gray-400 bg-white">
     <p className="text-center py-4">In Progress</p>
     <p className="text-center py-4 text-4xl font-bold">
        {statusData.find(task => task.status == 'in progress')?.count || 0}
        <span className="text-sm text-gray-600 px-1">Tasks</span>
     </p>

    </div> 
    <div  className="h-40 w-[340px] rounded-lg border-gray-700 border-double shadow-sm shadow-gray-400 bg-white">
     <p className="text-center py-4">Completed</p>
     <p className="text-center py-4 text-4xl font-bold">
        {statusData.find(task => task.status == 'completed')?.count || 0}
        <span className="text-sm text-gray-600 px-1">Tasks</span>
     </p>
    </div>   
</div>
       
}

export default DashboardCards;