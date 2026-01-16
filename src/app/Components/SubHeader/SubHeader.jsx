"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconAdjustments } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import ViewDialog from "./ViewDialog";

const SubHeader = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [togglePopup, setTogglePopup] = useState(false);
    
    const navItems = [
        // { name: 'Overview', path: '/' },
        { name: 'Board', path: '/board' },
        { name: 'Dashboard', path: '/statChart' },
        // { name: 'This Week', path: '/week' },
        // { name: 'This Cycle', path: '/cycle' }
    ];

    // Prefetch all routes
    useEffect(() => {
        navItems.forEach(item => {
            router.prefetch(item.path);
        });
    }, [router]);

    const toggleView = () => {
        setTogglePopup(!togglePopup);
    }

    return (
        <div className="bg-white border-b border-gray-200 dark:bg-gray-900  ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between">
                    <nav className="flex space-x-8" aria-label="Tabs">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            prefetch={true}
                            className={`
                                px-3 py-4 text-sm font-medium border-b-2 transition-colors
                                ${pathname === item.path
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-white dark:hover:text-gray-300'}
                            `}
                        >
                            {item.name}
                        </Link>
                    ))}
                    </nav>
                    <Button className="dark:bg-gray-700 relative hover:bg-white bg-white rounded-2xl px-3 py-1 my-2 shadow-lg dark:shadow-gray-500 " onClick={() => toggleView()}>
                        <IconAdjustments stroke={2} className=" dark:text-white text-gray-900" />
                        <p className="dark:text-white text-gray-900">View</p>
                    </Button>
                     {togglePopup && <ViewDialog/>}
                </div>
            </div>
            
        </div>
    );
}

export default SubHeader;