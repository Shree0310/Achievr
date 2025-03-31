'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Cycles = ({ userId }) => {
    const [cycles, setCycles] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAddingCycle, setIsAddingCycle] = useState(false);
    const [newCycle, setNewCycle] = useState(
        {
            title: '',
            start_at: '',
            end_at: ''
        }
    );

    useEffect(() => {
        fetchCycles();
    }, []);




    async function fetchCycles() {
        const { data: cycles, error } = await supabase
            .from('cycles')
            .select('*');

        if (error) {
            throw error;
        }

        setCycles(cycles);
    }

    const handleAddCycle = () => {
        setIsAddingCycle(true);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCycle(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function handleSaveCycle() {
        const { data, error } = await supabase
            .from('cycles')
            .insert([
                {
                    title: newCycle.title,
                    start_at: newCycle.start_at,
                    end_at: newCycle.end_at,
                    user_id: userId
                }
            ])
            .select();

        setCycles(prev => [...prev, data[0]]);

        setNewCycle({
            title: '',
            start_at: '',
            end_at: ''
        });

        setIsAddingCycle(false);
    }

    const handleCancel = () => {
        setNewCycle({
            title: '',
            start_at: '',
            end_at: ''
        });

        setIsAddingCycle(false);
    }

    return <>
        <div className="flex items-center space-x-4 m-4">
            <div className="text-primary-500 font-bold text-lg">Cycles</div>
            <button
                aria-label="Add new cycle"
                onClick={handleAddCycle}
                className="bg-primary-500 hover:bg-primary-600 text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-opacity-50 shadow-sm"
            >
                <span className="text-lg leading-none">+</span>
            </button>
        </div>
        <div className="rounded-md border m-4">
            <Table>
                <TableHeader className="bg-primary-200">
                    <TableRow>
                        <TableHead className="border border-gray-300 text-black">Title</TableHead>
                        <TableHead className="border border-gray-300 text-black">Start date</TableHead>
                        <TableHead className="border border-gray-300 text-black">End Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cycles.map((cycle) => (
                        <TableRow key={cycle.id}>
                            <TableCell className="border border-gray-300">{cycle.title}</TableCell>
                            <TableCell className="border border-gray-300">{cycle.start_at}</TableCell>
                            {cycle.end_at ? (
                                <TableCell className="border border-gray-300">{cycle.end_at}</TableCell>
                            ) : (
                                <TableCell className="border border-gray-300">End date not set</TableCell>
                            )}
                        </TableRow>
                    ))}
                    {isAddingCycle && (
                        <TableRow>
                            <TableCell className="border-r border-gray-300">
                                <Input
                                    name="title"
                                    value={newCycle.title}
                                    onChange={handleInputChange}
                                    placeholder="Cycle Title">
                                </Input>
                            </TableCell>
                            <TableCell className="border-r border-gray-300">
                                <Input
                                    name='start_at'
                                    value={newCycle.start_at}
                                    onChange={handleInputChange}
                                    placeholder="Cycle start date">
                                </Input>
                            </TableCell>
                            <TableCell className="border-r border-gray-300">
                                <Input
                                    name="end_at"
                                    value={newCycle.end_at}
                                    onChange={handleInputChange}
                                    placeholder="Cycle end date">
                                </Input>
                            </TableCell>
                        </TableRow>
                    )}
                    <TableRow>
                        <TableCell colSpan={5} className="border-r border-gray-400 bg-gray-50 p-3">
                            <div className="flex justify-end space-x-3">
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="px-4 py-2 border border-gray-300 hover:bg-gray-100 transition-colors">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveCycle}
                                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white transition-colors shadow-sm">
                                    Add Cycle
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </>
}
export default Cycles;