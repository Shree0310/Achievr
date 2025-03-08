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
        <div className="w-52 bg-[#ADAAB2] h-screen z-10">
            <div className="rounded-xl p-4">
                <ul className="space-y-4 ">
                    {data && data.map((item) => (
                        <li key={item.id} className="text-white text-xl py-20">
                            {item.title}
                        </li>
                    ))}

                </ul>
            </div>
        </div>
    </div>
}

export default Navbar;