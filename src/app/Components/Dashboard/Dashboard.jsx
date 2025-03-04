"use client"

import Activity from '../Activity/Activity';
import DashboardCards from './dashboardComponents/DashboardCards';
import DashBoardCharts from './dashboardComponents/DashboardCharts';

const Dashboard = () => {
return <div >
    <div className="top-0 fixed right-0 bg-[#D9D9D9] bottom-0 left-20 -z-10">
        <div className='flex gap-4'>

   <div className='flex flex-col'>
   <div className='ml-40 mt-32'>
        <DashboardCards/>
    </div>
    <div className='ml-40 mt-6'>
        <DashBoardCharts/>
    </div>
   </div>

    <div className='mt-32'>
        <Activity/>
    </div>
    </div>


    </div>

    
</div>
}

export default Dashboard;