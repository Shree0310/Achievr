"use client"

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { IconLayoutBoardSplit } from '@tabler/icons-react';
import { IconList } from '@tabler/icons-react';
import { IconCircleDashed } from '@tabler/icons-react';

const Navbar = ({ userId, onTaskUpdate, children }) => {
    const [data, setData] = useState(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const { data, error } = await supabase
            .from('cycles')
            .select('*');

        setData(data);
        if (error) {
            throw error;
        }
    }

    const navItems = [
        { 
            name: 'Board', 
            path: '/board', 
            icon: IconLayoutBoardSplit // Icon component
        },
        { 
            name: 'Tasks Queue', 
            path: '/task-queue', 
            icon: IconList 
        },
        { 
            name: 'Cycles', 
            path: '/cycles-list', 
            icon: IconCircleDashed 
        }
    ];

    // Prefetch all routes
    useEffect(() => {
        router.prefetch('/');
        navItems.forEach(item => {
            router.prefetch(item.path);
        });
    }, [router]);

    return (
        <SidebarProvider>
            <AppSidebar 
                userId={userId} 
                onTaskUpdate={onTaskUpdate}
                navItems={navItems}
            />
            <main className="w-full">
                <div className="flex-1">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}

export default Navbar;