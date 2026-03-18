"use client"

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { IconLayoutBoardSplit } from '@tabler/icons-react';
import { IconList } from '@tabler/icons-react';
import { IconCircleDashed } from '@tabler/icons-react';
import { PlannerModal } from "../Planner/PlannerModal";

const Navbar = ({ userId, onTaskUpdate, children }) => {
    const [data, setData] = useState(null);
    const pathname = usePathname();
    const router = useRouter();
    const [isPlannerOpen, setIsPlannerOpen] = useState(false);

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

     const handleTasksAdded = () => {
        // Trigger the parent's task update handler to refresh the board
        if (onTaskUpdate) {
            onTaskUpdate('refresh', null);
        }
        // Fallback: reload the page
        window.location.reload();
    };

    return (
        <SidebarProvider>
            <AppSidebar 
                userId={userId} 
                onTaskUpdate={onTaskUpdate}
                navItems={navItems}
                onAIPlanClick={() => setIsPlannerOpen(!isPlannerOpen)}
            />
            <main className="w-full">
                <div className="flex-1">
                    {children}
                </div>
            </main>
            <PlannerModal
                isOpen={isPlannerOpen}
                onClose={() => setIsPlannerOpen(false)}
                onTasksAdded={handleTasksAdded}
                userId={userId || ''}/>
        </SidebarProvider>
    );
}

export default Navbar;