"use client"

import Header from '../Components/Header/Header';
import Navbar from '../Components/Navbar/Navbar';
import SubHeader from '../Components/SubHeader/SubHeader';
import Cycles from '../Components/Cycles/Cycles';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export default function CycleListPage(){
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function getSession() {
            try {
                const { data } = await supabase.auth.getSession();
                const session = data.session;
                
                // First check if we're in demo mode by checking localStorage
                const isDemoMode = localStorage.getItem('demoMode') === 'true';
                
                if (isDemoMode || session?.user?.email === 'demo@example.com') {
                    console.log('Setting demo user');
                    setUserId('demo-user-id');
                    setUser({
                        id: 'demo-user-id',
                        email: 'demo@example.com',
                        user_metadata: {
                            name: 'Demo User'
                        },
                        app_metadata: {},
                        aud: 'authenticated',
                        created_at: new Date().toISOString(),
                        role: 'authenticated',
                        updated_at: new Date().toISOString()
                    } as User);
                } else if (session?.user) {
                    console.log('Setting regular user:', session.user.id);
                    setUserId(session.user.id);
                    setUser(session.user);
                } else {
                    console.log('No session found, setting demo mode');
                    // If no session, default to demo mode
                    localStorage.setItem('demoMode', 'true');
                    setUserId('demo-user-id');
                    setUser({
                        id: 'demo-user-id',
                        email: 'demo@example.com',
                        user_metadata: {
                            name: 'Demo User'
                        },
                        app_metadata: {},
                        aud: 'authenticated',
                        created_at: new Date().toISOString(),
                        role: 'authenticated',
                        updated_at: new Date().toISOString()
                    } as User);
                }
            } catch (error) {
                console.error('Error getting session:', error);
                // In case of error, default to demo mode
                setUserId('demo-user-id');
                setUser({
                    id: 'demo-user-id',
                    email: 'demo@example.com',
                    user_metadata: {
                        name: 'Demo User'
                    },
                    app_metadata: {},
                    aud: 'authenticated',
                    created_at: new Date().toISOString(),
                    role: 'authenticated',
                    updated_at: new Date().toISOString()
                } as User);
            } finally {
                setLoading(false);
            }
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
                    <Header user={user} />
                </div>

                <div className="w-full">
                    <SubHeader />
                </div>

                <div className="flex">
                    {/* Board - takes remaining space */}
                    <div className="flex-1 overflow-auto">
                        <Cycles userId={userId} />
                    </div>
                </div>
            </div>
        </div>
    );
}