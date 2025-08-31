"use client"
import { useEffect, useMemo, useState } from 'react';
import { supabase } from "@/utils/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend } from 'recharts';

const StatChart = () => {

    const [tasks, setTasks] = useState(null);
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
        const statusConfig = {
            'not started' : {label:'To Do', color: '#6B7280'},
            'in progress' : {label:'In Progress', color: '#3B82F6'},
            'under review' : {label:'Under Review', color: '#10B981'},
            'completed' : {label:'Completed', color: '#EF4444'},
        };

        return Object.entries(statusCount).map(([status, count]) => ({
            status: statusConfig[status]?.label || status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            count,
            fill: statusConfig[status]?.color || '#6B7280'
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
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
              No task data available
            </div>
          )}

    </div>
}
export default StatChart;