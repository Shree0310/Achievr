"use client"

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import SummitIcon from "./SummitIcon";
import CreateTaskButton from "../CreateTask/CreateTaskButton";
import GitHubRepositoryConnector from "../GitHubConnect/GitHubRepositoryConnector";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

/**
 * @param {Object} props
 * @param {string} [props.userId] - The user ID
 * @param {Function} [props.onTaskUpdate] - Callback function for task updates
 */
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
        { name: 'Tasks Queue', path: '/task-queue', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { name: 'Cycles', path: '/cycles-list', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' }
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
            <AppSidebar userId={userId} onTaskUpdate={onTaskUpdate} />
            <main>
                <SidebarTrigger/>
                {children}
            </main>
        </SidebarProvider>
    );
}

export default Navbar;