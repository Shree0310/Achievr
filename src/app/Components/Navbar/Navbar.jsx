"use client"

import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import CreateTaskButton from "../CreateTask/CreateTaskButton";

const Navbar = () => {
    const [data, setData] = useState(null);
    const pathname = usePathname();

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

    return (
        <div className="w-full md:w-64 bg-white h-16 md:h-screen border-r border-gray-200">
            <div className="p-6">
                <Link href="/" className="flex items-center space-x-3 mb-8 group">
                    <div className="relative h-8 w-8 transition-transform group-hover:scale-105">
                        <Image
                            src="/logo.svg"
                            alt="Achievr Logo"
                            width={32}
                            height={32}
                            className="h-8 w-8"
                        />
                    </div>
                    <span className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                        Achievr
                    </span>
                </Link>
                
                <nav className="space-y-1">
                    <CreateTaskButton />
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                pathname === item.path
                                    ? 'bg-primary-50 text-primary-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <svg
                                className={`mr-3 h-5 w-5 ${
                                    pathname === item.path ? 'text-primary-500' : 'text-gray-400'
                                }`}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d={item.icon} />
                            </svg>
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}

export default Navbar;