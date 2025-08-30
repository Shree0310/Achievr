"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";


const DashboardCards = () => {
    const [statusData, setStatusData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const { data, error } = await supabase
            .from('tasks')
            .select('*');

        if (error) {
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
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-gray-900/30 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Not Started</h3>
                    <span className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <svg className="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </span>
                </div>
                <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {statusData.find(task => task.status === 'not started')?.count || 0}
                    </p>
                    <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">tasks</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-gray-900/30 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">In Progress</h3>
                    <span className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <svg className="w-6 h-6 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </span>
                </div>
                <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {statusData.find(task => task.status === 'in progress')?.count || 0}
                    </p>
                    <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">tasks</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-gray-900/30 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Completed</h3>
                    <span className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <svg className="w-6 h-6 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </span>
                </div>
                <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {statusData.find(task => task.status === 'completed')?.count || 0}
                    </p>
                    <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">tasks</p>
                </div>
            </div>
        </div>
    );
}

export default DashboardCards;