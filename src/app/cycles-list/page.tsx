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
                
                console.log('Current session:', session);
                
                if (session?.user) {
                    // If we have a real user session, clear demo mode
                    localStorage.removeItem('demoMode');
                    console.log('Setting regular user:', session.user.id);
                    setUserId(session.user.id);
                    setUser(session.user);
                } else {
                    // Only set demo mode if there's no session
                    console.log('No session found, setting demo mode');
                    localStorage.setItem('demoMode', 'true');
                    setUserId('demo-user-id');
                    const demoUser: User = {
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
                    };
                    setUser(demoUser);
                }
            } catch (error) {
                console.error('Error getting session:', error);
                // In case of error, default to demo mode
                localStorage.setItem('demoMode', 'true');
                setUserId('demo-user-id');
                const demoUser: User = {
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
                };
                setUser(demoUser);
            } finally {
                setLoading(false);
            }
        }
        
        getSession();

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('Auth state changed:', _event, session);
            if (session?.user) {
                localStorage.removeItem('demoMode');
                console.log('Auth state: Setting regular user:', session.user.id);
                setUserId(session.user.id);
                setUser(session.user);
            } else {
                console.log('Auth state: No session, setting demo mode');
                localStorage.setItem('demoMode', 'true');
                setUserId('demo-user-id');
                const demoUser: User = {
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
                };
                setUser(demoUser);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
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
            <div className="h-full flex-shrink-0">
                <Navbar userId={user?.id} onTaskUpdate={() => {}} />
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
                    {/* Cycles - takes remaining space */}
                    <div className="flex-1 overflow-auto">
                        <Cycles userId={userId} />
                    </div>
                </div>
            </div>
        </div>
    );
}