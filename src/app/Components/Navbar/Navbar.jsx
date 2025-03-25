"use client"

import { supabase } from "@/utils/supabase/client";
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
        console.log(data);
        if (error) {
            throw error;
        }
    }
    return <div>
        <div className="w-full md:w-52 bg-primary-400 h-16 md:h-screen flex md:block">
            <div className="rounded-xl p-2 md:p-4 flex items-center md:block">
                <ul className="flex md:block space-x-4 md:space-x-0 md:space-y-4">
                    <li className="text-white text-lg md:text-xl md:py-32">
                        Cycles
                    </li>
                </ul>
            </div>
        </div>
    </div>
}

export default Navbar;