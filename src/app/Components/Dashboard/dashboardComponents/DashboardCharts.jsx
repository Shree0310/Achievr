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
import { PieChart, Pie, Sector } from 'recharts';


const DashBoardCharts = () => {
    const [tasks, setTasks] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [priorityData, setPriorityData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);


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
                setStatusData([]);
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

            setStatusData(formattedData);

            const priorityCounts = {};

            data.forEach(task => {
                const priority = task.priority;
                priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
            });

            const priorityChartData = Object.keys(priorityCounts).map(priority => ({
                name: priority,
                value: priorityCounts[priority]
            }));

            setPriorityData(priorityChartData);


        } catch (err) {
            console.error("Error fetching tasks:", err);
            setStatusData([]);
        }
    }

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    // Custom active shape for pie chart
    const renderActiveShape = (props) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
            fill, payload, percent, value } = props;
        const sin = Math.sin(-midAngle * Math.PI / 180);
        const cos = Math.cos(-midAngle * Math.PI / 180);
        const sx = cx + (outerRadius + 12) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 35) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                    {payload.name}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} tasks`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(${(percent * 100).toFixed(0)}%)`}
                </text>
            </g>
        );
    }

    return (
        <div className="flex gap-7">
            <div className="h-96 w-[510px] rounded-lg shadow-md shadow-gray-400 bg-white">
                <p className="text-center py-2 font-medium">Tasks by Status</p>
                <div className="w-full h-80 px-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={statusData}
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
                            <Tooltip
                                formatter={(value, name) => [`${value} tasks`, 'Count']}
                                labelFormatter={(label) => `Status: ${label}`}
                            />                            <Legend />
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
                                {statusData.map((entry, index) => (
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
            <div className="h-96 w-[510px] rounded-lg shadow-md shadow-gray-400 bg-white">
                <p className="text-center py-2 font-medium">Chart by Priority</p>
                <div className=" w-full h-80 px-4 flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={400} height={400}>
                            <Pie
                                data={priorityData}
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={110}
                                fill="#8884d8"
                                dataKey="value"
                                onMouseEnter={onPieEnter}

                            >
                                {priorityData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value) => [`${value} tasks`, 'Count']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default DashBoardCharts;