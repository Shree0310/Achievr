"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { 
    BarChart,
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    LabelList,
    Tooltip, 
    ResponsiveContainer,
    Cell
  } from 'recharts';
import { PieChart, Pie, Sector } from 'recharts';
import { ChartBarLabel } from "./NewChart";

const DashBoardCharts = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [statusData, setStatusData] = useState<{ status: string; count: number }[]>([]);
    const [priorityData, setPriorityData] = useState<{ name: string; value: number }[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    // Subtle color palette
    const COLORS = [
        '#64748b', // slate-500
        '#f59e0b', // amber-500
        '#10b981', // emerald-500
        '#8b5cf6', // violet-500
        '#06b6d4', // cyan-500
        '#f97316'  // orange-500
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
            const statusCounts: { [key: string]: number } = {};

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

            const priorityCounts: { [key: string]: number } = {};

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

    const onPieEnter = (_: any, index: number): void => {
        setActiveIndex(index);
    };

    // Custom active shape for pie chart
    const renderActiveShape = (props: any) => {
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
                        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
                                {`Priority: ${payload.name}`}
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
                        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={2} />
                        <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
                        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#64748b" className="text-sm font-medium">
                                {`${value} ${value === 1 ? 'task' : 'tasks'}`}
                        </text>
                        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#94a3b8" className="text-xs">
                                {`(${(percent * 100).toFixed(0)}%)`}
                        </text>
                </g>
        );
    }

    // Custom tooltip for better styling
    const CustomTooltip = ({ active, payload, label }: { active: boolean; payload: any[]; label: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg p-3">
                    <p className="text-slate-800 dark:text-slate-200 font-medium mb-1">{label}</p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                        Tasks: <span className="font-semibold text-slate-800 dark:text-slate-100">{payload[0].value}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Status Chart */}
            <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-slate-900/30 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                <div className="p-6 border-b border-slate-200/60 dark:border-slate-600/60">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Tasks by Status</h3>
                    </div>
                </div>
                <div className="p-6" style={{ height: '350px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ChartBarLabel>
                        </ChartBarLabel>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Priority Chart */}
            <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-slate-900/30 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                <div className="p-6 border-b border-slate-200/60 dark:border-slate-600/60">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-6 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Tasks by Priority</h3>
                    </div>
                </div>
                <div className="p-6" style={{ height: '350px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={priorityData}
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                fill="#8884d8"
                                dataKey="value"
                                onMouseEnter={onPieEnter}
                                paddingAngle={2}
                            >
                                {priorityData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
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