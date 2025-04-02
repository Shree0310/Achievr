"use client"

import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
    const [data, setData] = useState(null);

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
    return <div>
        <div className="w-full md:w-52 bg-primary-400 h-16 md:h-screen flex md:block">
            <div className="rounded-xl p-2 md:px-4 flex items-center md:block">
                <ul className="flex md:block space-x-4 md:space-x-0 md:space-y-4">
                    <li className="text-white text-sm md:text-lg md:pt-32 px-2 ">
                        Cycles
                    </li>
                    <li>
                   <Link 
                   href='/task-queue'
                   className="text-white text-sm md:text-lg px-2 py-1 cursor-pointer hover:bg-primary-300 hover:text-primary-500 rounded-md">
                        Tasks queue
                        </Link>
                    </li>
                    <li>
                        <Link
                        href='/cycles-list'
                        className="text-white text-sm md:text-lg px-2 py-1 cursor-pointer hover:bg-primary-300 hover:text-primary-500 rounded-md">
                            Cycles
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
}

export default Navbar;