"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const SubHeader = () => {
    const pathname = usePathname();
    const router = useRouter();
    
    const navItems = [
        { name: 'Overview', path: '/' },
        { name: 'Board', path: '/board' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'This Week', path: '/week' },
        { name: 'This Cycle', path: '/cycle' }
    ];

    // Prefetch all routes
    useEffect(() => {
        navItems.forEach(item => {
            router.prefetch(item.path);
        });
    }, [router]);

    return (
        <div className="bg-white border-b border-gray-200 dark:bg-gray-900  ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            </div>
        </div>
    );
}

export default SubHeader;