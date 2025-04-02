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
    ResponsiveContainer,
    Cell
} from 'recharts';
import { PieChart, Pie } from 'recharts';


const DashBoardCharts = () => {
    const [tasks, setTasks] = useState([]);
    const [chartData, setChartData] = useState([]);

    const COLORS = [
        'var(--primary-400)',
        'var(--accent-400)',
        'var(--gray-500)',
        'var(--warning-500)',
        'var(--primary-700)'
    ];

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            const { data, error } = await supabase
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

            // Transform tasks data for the chart
            const statusCounts = {};

            // Count tasks by status
            data.forEach(task => {
                const status = task.status ?? 'Not set';
                statusCounts[status] = (statusCounts[status] || 0) + 1;
            });

            // Convert to array format for Recharts
            const formattedData = Object.keys(statusCounts).map(status => ({
                status: status,
                count: statusCounts[status]
            }));

            setChartData(formattedData);
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setChartData([]);
        }
    }

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="flex gap-7">
            <div className="h-96 w-[500px] rounded-lg shadow-md shadow-gray-400 bg-white">
                <p className="text-center py-2 font-medium">Tasks by Status</p>
                <div className="w-full h-80 px-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 40,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="status"
                                angle={-45}
                                textAnchor="end"
                                height={70}
                            />
                            <YAxis
                                label={{ value: 'Number of Tasks', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                            />
                            <Tooltip />
                            <Legend />
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1A73E8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#1A73E8" stopOpacity={0.4} />
                                </linearGradient>
                            </defs>
                            <Bar
                                dataKey="count"
                                name="Tasks"
                                radius={[4, 4, 0, 0]}
                                fill="url(#colorCount)"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="h-96 w-[500px] rounded-lg shadow-md shadow-gray-400 bg-white">
                <p className="text-center py-2 font-medium">Chart 2</p>
                <div className=" w-full h-80 px-4 flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={400} height={400}>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default DashBoardCharts;