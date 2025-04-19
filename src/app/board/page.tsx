"use client";

import Board from "../Components/Board/Board";
import Header from "../Components/Header/Header";
import Navbar from "../Components/Navbar/Navbar";
import SubHeader from "../Components/SubHeader/SubHeader";
import Stages from "../Components/Stages/Stages";
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export default function BoardPage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function getSession() {
            try {
                const { data } = await supabase.auth.getSession();
                const session = data.session;
                
                if (session?.user) {
                    // If we have a real user session, clear demo mode
                    localStorage.removeItem('demoMode');
                    setUser(session.user);
                } else {
                    // Only set demo mode if there's no session
                    localStorage.setItem('demoMode', 'true');
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
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden">
            {/* Navbar */}
            <div className="relative w-full md:w-auto md:h-screen">
                <div className="h-auto md:h-full flex-shrink-0">
                    <Navbar />
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden">
                {/* Fixed header area */}
                <div className="flex-shrink-0">
                    <Header user={user} />
                    <SubHeader />
                    <Board />
                </div>
                
                {/* Stages component - explicitly take all remaining space */}
                <div className="flex-1 overflow-hidden">
                    <Stages />
                </div>
            </div>
        </div>
    );
}