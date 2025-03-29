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
    <div className="text-primary-500 font-bold text-lg m-4">Cycles</div>
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