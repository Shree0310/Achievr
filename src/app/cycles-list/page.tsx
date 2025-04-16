"use client"

import Header from '../Components/Header/Header';
import Navbar from '../Components/Navbar/Navbar';
import SubHeader from '../Components/SubHeader/SubHeader';
import Cycles from '../Components/Cycles/Cycles';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

export default function CycleListPage(){
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getSession() {
            const { data } = await supabase.auth.getSession();
            setUserId(data.session?.user?.id);
            setLoading(false);
        }
        
        getSession();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    

    return (
        <div className="h-screen w-screen flex overflow-hidden">
        {/* Navbar - fixed on the left */}
        <div className="relative w-full md:w-auto md:h-screen">
        {/* <CreateTaskButton 
        /> */}
        <div className="h-auto md:h-full flex-shrink-0">
          <Navbar />
        </div>
      </div>

        {/* Main content area - takes remaining width */}
        <div className="flex-1 flex flex-col min-w-0">
            {/* Header - fixed at top */}
            <div className="w-full">
                <Header user={undefined} />
            </div>

            <div className="w-full">
                <SubHeader />
            </div>

            <div className="flex">
                {/* Board - takes remaining space */}
                <div className="flex-1 overflow-auto">
                    <Cycles
                    userId={userId}/>
                </div>

            </div>

        </div>
    </div>
    );
}