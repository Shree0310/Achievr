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
            console.log(data);
        } catch (error) {
            console.error("eror fetching data", error);
        } finally {
            setLoading(false);
        }

    }

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="absolute z-20 top-24 mx-4">
                    <div className="flex gap-16">
                        {/* Not Started tasks */}
                        <ul className="flex flex-col gap-2">
                            {data && data.map((item) => (
                                <div className="bg-white lg:w-[358px] w-60 h-44 rounded-lg shadow-lg">
                                    <li key={item.id} className="text-gray-600 p-4">
                                        {item.title}
                                    </li>
                                </div>
                            ))}
                        </ul>

                        {/* In Progress tasks */}

                        <div className="flex flex-col gap-2">
                            <div className="bg-white lg:w-[358px] w-60 h-44 rounded-lg shadow-lg">
                                <p className="text-gray-600 p-4"> Task 1</p>
                            </div>
                            <div className="bg-white lg:w-[358px] w-60 h-44 rounded-lg shadow-lg">
                                <p className="text-gray-600 p-4"> Task 2</p>
                            </div>
                            <div className="bg-white lg:w-[358px] w-60 h-44 rounded-lg shadow-lg">
                                <p className="text-gray-600 p-4"> Task 3</p>
                            </div>
                        </div>
                        {/* Under-Review tasks */}
                        <div className="flex flex-col gap-2">
                            <div className="bg-white w-60 h-44 rounded-lg shadow-lg">
                                <p className="text-gray-600 p-4">Task 3</p>
                            </div>
                            <div className="bg-white w-60 h-44 rounded-lg shadow-lg">
                                <p className="text-gray-600 p-4">Task 4</p>
                            </div>
                        </div>
                        {/* Completed tasks */}
                        <div className="flex flex-col gap-2">
                            <div className="bg-white w-60 h-44 rounded-lg shadow-lg">
                                <p className="text-gray-600 p-4">Task 1</p>
                            </div>
                        </div>
                    </div>



                </div>
            )}
        </div>

    )
}

export default Tasks;