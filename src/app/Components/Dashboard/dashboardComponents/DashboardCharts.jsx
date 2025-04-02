"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const DashBoardCharts = () => {
    const [tasks, setTasks] = useState([]);
    const [chartData, setChartData] = useState([]);


    useEffect(() => {
        fetchTasks();
    }, [])

    async function fetchTasks() {
        try {
            const {data, error}  = await supabase
                .from('tasks')
                .select('*');

            if (error) {
                throw error;
            }

            if (!data) {
                setChartData([]);
                return;
            }
            setTasks(data);

            const statusCounts = {};
            data.forEach(task => {
                const status = task.status ?? 'Not set';
                if (!statusCounts[status]) {
                    statusCounts[status] = 1;
                }
                statusCounts[status] = statusCounts[status] + 1;

                // console.log("statusCounts[taskStatus]", statusCounts);
            });

            const formattedData = Object.keys(statusCounts).map(status => ({
                status: status,
                count: statusCounts[status]
            }));

            setChartData(formattedData);
            console.log("chartData: ", chartData)

        }
        catch (err) {
            console.error("Error fetching tasks:", err);
            setChartData([]);        }

    }

    return <div className="flex gap-7">
        <div className="h-96 w-[500px] rounded-lg shadow-md shadow-gray-400 bg-white">
            <p className="text-center py-2">Chart 1 </p>
            <div className="w-[400px] h-80 z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="count"
                            name="Tasks"
                            fill="#1A73E8"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
        <div className="h-96 w-[500px] rounded-lg shadow-md shadow-gray-400 bg-white">
            <p className="text-center py-2">Chart 2</p>
        </div>
    </div>
}

export default DashBoardCharts;