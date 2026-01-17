'use client'

import { IconList } from '@tabler/icons-react';
import { IconLayoutBoardSplit } from '@tabler/icons-react';
import { IconChartLine } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

const ViewDialog = () => {
    const router = useRouter();

    return <div className="absolute mt-14 mx-10 right-0 z-10 h-full">
        <div className="rounded-md dark:bg-gray-800 bg-white p-4 border border-gray-300">
            <div className="h-14 flex px-2 justify-between gap-2 bg-neutral-200/40 dark:bg-gray-700 rounded-sm">
                <div 
                    className="flex flex-col p-1 px-3 m-1 hover:dark:bg-gray-800 hover:bg-white rounded-md cursor-pointer hover:shadow-sm hover:shadow-gray-300 dark:hover:shadow-gray-900"
                    onClick={() => router.push('/board')}>
                    <div className="flex justify-center p-1"><IconLayoutBoardSplit stroke={2} height={18} width={18}/></div>
                    <p className='text-xs'>Board</p>
                </div>
                <div 
                    className="flex flex-col p-1 px-3 m-1 hover:dark:bg-gray-800 hover:bg-white rounded-md cursor-pointer hover:shadow-sm hover:shadow-gray-300 dark:hover:shadow-gray-900"
                    onClick={() => router.push('/task-queue')}>
                    <div className="flex justify-center p-1"><IconList stroke={2} height={18} width={18} /></div>
                    <p className='text-xs px-1'>List</p>
                </div>
                <div 
                    className="flex flex-col p-1 m-1 hover:dark:bg-gray-800 hover:bg-white rounded-md cursor-pointer hover:shadow-sm hover:shadow-gray-300 dark:hover:shadow-gray-900"
                    onClick={() => router.push('/statChart')}>
                    <div className="flex justify-center p-1"><IconChartLine stroke={2} height={18} width={18} /></div>
                    <p className='text-xs'>Timeline</p>
                </div>
            </div>
        </div>
    </div>
}
export default ViewDialog;