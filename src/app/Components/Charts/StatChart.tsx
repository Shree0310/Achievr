"use client"
import { useEffect, useMemo, useState } from 'react';
import { supabase } from "@/utils/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ChartBarLabel } from '../Dashboard/dashboardComponents/NewChart';

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#3b82f6", // Blue color
  },
} satisfies ChartConfig

const StatChart = () => {

    const [tasks, setTasks] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    },[])

    async function fetchData() {
        try{
            setLoading(true);
            const {data, error} = await supabase
                .from('tasks')
                .select('*')
            if(error){
                throw error;
            }
            setTasks(data);
        }catch(error){
            console.error('Tasks cannot be found', error);
        } finally{
            setLoading(false);
        }
    }

    const statusChartData = useMemo(() => {
        if(!tasks || tasks.length === 0) return [];

        //count tasks by status
        const statusCount = tasks.reduce((acc, task) =>{
            const status = task.status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        },{});

        //Convert to chart with proper label & graph
        const statusConfig: Record<string, {label: string; color: string}> = {
            'not started' : {label:'To Do', color: '#6B7280'},
            'in progress' : {label:'In Progress', color: '#3B82F6'},
            'under review' : {label:'Under Review', color: '#10B981'},
            'completed' : {label:'Completed', color: '#EF4444'},
        };

        return Object.entries(statusCount).map(([status, count]) => ({
            status: statusConfig[status]?.label || status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            count,
            fill: statusConfig[status]?.color || '#6366f1'
        }));
    },[tasks]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
                Loading...
            </div>
        );
    }

    return <div>
        {statusChartData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-10">
                {/* Bar Chart */}
                <div>
                    <Card>
                        <CardHeader>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">Tasks by Status (Bar)</h3>
                                <CardDescription>January - June 2024</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig}>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={statusChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-600" />
                                        <XAxis 
                                            dataKey="status" 
                                            tick={{ fontSize: 12, fill: '#6B7280' }}
                                            className="dark:text-white"
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                        />
                                        <YAxis 
                                            label={{ value: 'Number of Tasks', angle: -90, position: 'insideLeft' }}
                                            tick={{ fontSize: 12, fill: '#6B7280' }}
                                            className="dark:text-white"
                                        />
                                        <Tooltip 
                                            formatter={(value) => [value, 'Tasks']}
                                            labelStyle={{ color: '#374151' }}
                                            contentStyle={{ 
                                                backgroundColor: '#F9FAFB', 
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Bar 
                                            dataKey="count" 
                                            radius={[4, 4, 0, 0]}
                                            fill="#3B82F6"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Line Chart */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">Tasks by Status (Line)</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={statusChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-600" />
                            <XAxis 
                                dataKey="status" 
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                className="dark:text-white"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                label={{ value: 'Number of Tasks', angle: -90, position: 'insideLeft' }}
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                className="dark:text-white" 
                            />
                            <Tooltip
                                formatter={(value) => [value, 'Tasks']}
                                labelStyle={{ color: '#374151' }}
                                contentStyle={{ 
                                    backgroundColor: '#F9FAFB', 
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px'
                                }} 
                            />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="count" 
                                stroke="#3B82F6" 
                                strokeWidth={3}
                                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                                activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        ) : (
            <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
                No task data available
            </div>
        )}
    </div>
}
export default StatChart;