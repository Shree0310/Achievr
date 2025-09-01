"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

const DashboardCards = () => {
    const [statusData, setStatusData] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);

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
        });

        const formattedData = Object.keys(statusCount).map(status => ({
            status: status,
            count: statusCount[status]
        }));

        setStatusData(formattedData);
        setTotalTasks(data.length);
    }

    const getStatusConfig = (status) => {
        const configs = {
            'not started': {
                color: 'from-slate-500 to-slate-600',
                bgColor: 'bg-slate-50 dark:bg-slate-800/50',
                iconBg: 'bg-slate-100 dark:bg-slate-700',
                iconColor: 'text-slate-600 dark:text-slate-300',
                progressColor: 'bg-slate-200 dark:bg-slate-600'
            },
            'in progress': {
                color: 'from-amber-500 to-orange-500',
                bgColor: 'bg-amber-50 dark:bg-amber-900/20',
                iconBg: 'bg-amber-100 dark:bg-amber-800/30',
                iconColor: 'text-amber-600 dark:text-amber-400',
                progressColor: 'bg-amber-200 dark:bg-amber-700'
            },
            'completed': {
                color: 'from-emerald-500 to-teal-500',
                bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
                iconBg: 'bg-emerald-100 dark:bg-emerald-800/30',
                iconColor: 'text-emerald-600 dark:text-emerald-400',
                progressColor: 'bg-emerald-200 dark:bg-emerald-700'
            }
        };
        return configs[status] || configs['not started'];
    };

    const getStatusIcon = (status) => {
        const icons = {
            'not started': (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            ),
            'in progress': (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            'completed': (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            )
        };
        return icons[status] || icons['not started'];
    };

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-600/60">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-slate-600 dark:text-slate-300 text-sm font-medium mb-1">Total Tasks</h3>
                        <p className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 dark:from-slate-100 dark:to-blue-300 bg-clip-text text-transparent">
                            {totalTasks}
                        </p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-700 dark:to-blue-800 rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Status Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['not started', 'in progress', 'completed'].map((status) => {
                    const config = getStatusConfig(status);
                    const count = statusData.find(task => task.status === status)?.count || 0;
                    const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
                    
                    return (
                        <div key={status} className={`${config.bgColor} rounded-2xl border border-slate-200/60 dark:border-slate-600/60 p-6 hover:shadow-lg dark:hover:shadow-slate-900/20 transition-all duration-300 hover:-translate-y-1`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-600 dark:text-slate-300 text-sm font-medium capitalize">
                                    {status.replace('_', ' ')}
                                </h3>
                                <div className={`${config.iconBg} p-2.5 rounded-xl`}>
                                    <div className={config.iconColor}>
                                        {getStatusIcon(status)}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                                        {count}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">tasks</p>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {percentage.toFixed(1)}% of total
                                </p>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 overflow-hidden">
                                <div 
                                    className={`h-full ${config.progressColor} rounded-full transition-all duration-500 ease-out`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DashboardCards;