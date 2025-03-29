'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from  "@/components/ui/table";

const Cycles = () =>{
    const [cycles, setCycles] = useState([]);

    useEffect(()=>{
        fetchCycles();
    })

    async function fetchCycles(){
        const { data: cycles, error} = await supabase
        .from('cycles')
        .select('*');

        if(error){
            throw error;
        }

        setCycles(cycles);
    }
    return <>
    <div className="flex items-center space-x-4 m-4">
      <div className="text-primary-500 font-bold text-lg">Cycles</div>
      <button 
        aria-label="Add new cycle"
        className="bg-primary-500 hover:bg-primary-600 text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-opacity-50 shadow-sm"
      >
        <span className="text-lg leading-none">+</span>
      </button>
    </div>
    <div className="rounded-md border m-4">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="border-r border-gray-400 text-black">Title</TableHead>
                    <TableHead className="border-r border-gray-400 text-black">Start date</TableHead>
                    <TableHead className="border-r border-gray-400 text-black">End Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {cycles.map((cycle)=>(
                    <TableRow key={cycle.id}>
                    <TableCell className=" border-l-primary-500 border-r border-gray-400">{cycle.title}</TableCell>
                    <TableCell className=" border-l-primary-500 border-r border-gray-400">{cycle.start_at}</TableCell>
                    {cycle.end_at ? (
                        <TableCell className=" border-l-primary-500 border-r border-gray-400">{cycle.end_at}</TableCell>
                    ):(
                        <TableCell className=" border-l-primary-500 border-r border-gray-400">End date not set</TableCell>
                    )}
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
    </>
}
export default Cycles;