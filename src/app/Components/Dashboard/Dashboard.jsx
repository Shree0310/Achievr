"use client"

import Activity from '../Activity/Activity';
import DashboardCards from './dashboardComponents/DashboardCards';
import DashBoardCharts from './dashboardComponents/DashboardCharts';

const Dashboard = () => {
    return (
        <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                        Dashboard Overview
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Track your project progress and team performance
                    </p>
                </div>

                {/* Cards Section */}
                <div className="mb-8">
                    <DashboardCards />
                </div>

                {/* Charts Section */}
                <div className="mb-8">
                    <DashBoardCharts />
                </div>

                {/* Activity Section */}
                <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-slate-900/30 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Recent Activity</h2>
                        </div>
                        <Activity />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;