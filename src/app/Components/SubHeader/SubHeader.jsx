"use client"

import Link from "next/link"
import { usePathname } from "next/navigation";

const SubHeader = () => {
    const pathname = usePathname();

    return <div className="mx-7 my-2 relative z-10">
    <div className="h-9 bg-primary-500 w-full rounded-lg">
        <div className="h-full flex items-center">
            <div className=" flex justify-center space-x-4">
                <ul className="flex text-xl text-white px-4">
                    <li className="mx-5">
                        <Link href="/">
                        Overview
                        </Link>
                    </li>
                    <li className="mx-5">
                        <Link 
                        href='/board'
                        className={`${pathname === '/board' ? 'underline underline-offset-4' : ''}`}>
                        Board
                        </Link>
                        </li>
                    <li className="mx-5">
                        <Link 
                        href="/dashboard"
                        className={`${pathname === '/dashboard' ? 'underline underline-offset-4' : ''}`}>
                        Dashboard
                        </Link></li>
                    <li className="mx-5">This Week</li>
                    <li className="mx-5">This Cycle</li>
                </ul>
            </div>
        </div>
    </div>
    </div>
}

export default SubHeader;