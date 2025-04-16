"use client"

import Activity from '../Activity/Activity';
import DashboardCards from './dashboardComponents/DashboardCards';
import DashBoardCharts from './dashboardComponents/DashboardCharts';

const Dashboard = () => {
    return (
        <div className="flex-1 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Cards Section */}
                <div className="mb-4">
                    <DashboardCards />
                </div>

                {/* Charts Section */}
                <div className="mb-4">
                    <DashBoardCharts />
                </div>

                {/* Activity Section */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                        <Activity />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;