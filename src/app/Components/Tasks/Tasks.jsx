'use client'

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const Tasks = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

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
            setData(data);
        } catch (error) {
            console.error("error fetching data", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="absolute z-20 top-32 md:top-40 w-[calc(100%-2rem)] md:w-[calc(100%-3.5rem)] mx-auto">
            {/* Grid layout matching the stages grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {/* Not Started tasks */}
                <div className="space-y-2">
                    <div className="bg-white p-3 rounded-lg shadow-md">
                        <p className="text-gray-700 font-medium">Task 1</p>
                        <p className="text-gray-500 text-sm mt-1">Description here</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-md">
                        <p className="text-gray-700 font-medium">Task 2</p>
                        <p className="text-gray-500 text-sm mt-1">Description here</p>
                    </div>
                </div>
                
                {/* In Progress tasks */}
                <div className="space-y-2">
                    <div className="bg-white p-3 rounded-lg shadow-md">
                        <p className="text-gray-700 font-medium">Task 3</p>
                        <p className="text-gray-500 text-sm mt-1">Description here</p>
                    </div>
                </div>
                
                {/* Under Review tasks */}
                <div className="space-y-2">
                    <div className="bg-white p-3 rounded-lg shadow-md">
                        <p className="text-gray-700 font-medium">Task 4</p>
                        <p className="text-gray-500 text-sm mt-1">Description here</p>
                    </div>
                </div>
                
                {/* Completed tasks */}
                <div className="space-y-2">
                    <div className="bg-white p-3 rounded-lg shadow-md">
                        <p className="text-gray-700 font-medium">Task 5</p>
                        <p className="text-gray-500 text-sm mt-1">Description here</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tasks;