'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Function to generate a UUID v4
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const Cycles = ({ userId }) => {
    const [cycles, setCycles] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [isAddingCycle, setIsAddingCycle] = useState(false);
    const [newCycle, setNewCycle] = useState({
        title: '',
        start_at: null,
        end_at: null
    });

    const isDemoMode = userId === 'demo-user-id';

    useEffect(() => {
        console.log('Cycles component mounted/updated with userId:', userId);
        console.log('Is demo mode:', isDemoMode);

        if (!userId) {
            // Don't fetch if userId is undefined
            console.log('No userId, skipping fetch');
            return;
        }
        if (isDemoMode) {
            // Initialize with demo cycles
            console.log('Initializing demo cycles');
            const demoCycles = [
                {
                    id: generateUUID(),
                    title: 'Q1 2024',
                    start_at: new Date('2024-01-01').toISOString(),
                    end_at: new Date('2024-03-31').toISOString(),
                    user_id: userId,
                    created_at: new Date().toISOString()
                },
                {
                    id: generateUUID(),
                    title: 'Q2 2024',
                    start_at: new Date('2024-04-01').toISOString(),
                    end_at: new Date('2024-06-30').toISOString(),
                    user_id: userId,
                    created_at: new Date().toISOString()
                }
            ];
            setCycles(demoCycles);
            return;
        }
        fetchCycles();
    }, [userId, isDemoMode]);

    async function fetchCycles() {
        try {
            if (!userId) {
                console.log('No userId provided for fetching cycles');
                return;
            }

            console.log('Fetching cycles for userId:', userId);
            const { data: cycles, error } = await supabase
                .from('cycles')
                .select('*')
                .eq('user_id', userId);

            if (error) {
                console.error('Error fetching cycles:', error);
                throw error;
            }

            console.log('Fetched cycles:', cycles);
            setCycles(cycles || []);
        } catch (error) {
            console.error('Error in fetchCycles:', error);
            setError(error.message);
        }
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

    const handleDateChange = (date, field) => {
        setNewCycle((prev) => ({
            ...prev,
            [field]: date
        }));
    };

    async function handleSaveCycle() {
        if (!userId) {
            setError('User not authenticated. Please sign in again.');
            return;
        }

        if (!newCycle.title.trim()) {
            setError('Please enter a cycle title');
            return;
        }

        if (!newCycle.start_at) {
            setError('Please select a start date');
            return;
        }

        try {
            if (isDemoMode) {
                // In demo mode, just add to local state
                const demoCycle = {
                    id: generateUUID(),
                    title: newCycle.title,
                    start_at: newCycle.start_at?.toISOString(),
                    end_at: newCycle.end_at?.toISOString(),
                    user_id: userId,
                    created_at: new Date().toISOString()
                };
                setCycles(prev => [...prev, demoCycle]);
            } else {
                // For real users, save to Supabase
                console.log('Attempting to save cycle to Supabase:', {
                    title: newCycle.title,
                    start_at: newCycle.start_at?.toISOString(),
                    end_at: newCycle.end_at?.toISOString(),
                    user_id: userId
                });

                const { data, error } = await supabase
                    .from('cycles')
                    .insert([{
                        title: newCycle.title,
                        start_at: newCycle.start_at?.toISOString(),
                        end_at: newCycle.end_at?.toISOString(),
                        user_id: userId
                    }])
                    .select();

                if (error) {
                    console.error('Error saving cycle:', error);
                    setError(error.message);
                    return;
                }

                console.log('Successfully saved cycle:', data);
                setCycles(prev => [...prev, data[0]]);
            }

            setNewCycle({
                title: '',
                start_at: null,
                end_at: null
            });
            setIsAddingCycle(false);
            setError('');
        } catch (error) {
            console.error('Error in handleSaveCycle:', error);
            setError(error.message);
        }
    }

    const handleCancel = () => {
        setNewCycle({
            title: '',
            start_at: null,
            end_at: null
        });
        setIsAddingCycle(false);
        setError('');
    }

    const formatDate = (dateString) => {
        if (!dateString) return;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    const filterCycles = (cycles) => {
        if (!Array.isArray(cycles)) { return []; }
        const searchTerm = searchInput.toString();
        return cycles.filter(cycle => {
            return (
                (cycle.title.toLowerCase() || '').includes(searchTerm)
            )
        })
    }

    return (
        <div className="p-4">
            <div className="flex items-center space-x-4 mb-4">
                <div className="text-primary-500 font-bold text-lg">Cycles</div>
                <button
                    aria-label="Add new cycle"
                    onClick={handleAddCycle}
                    className="bg-primary-500 hover:bg-primary-600 text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-opacity-50 shadow-sm"
                >
                    <span className="text-lg leading-none">+</span>
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                    {error}
                </div>
            )}
            <Input
                value={searchInput}
                placeholder="Search cycles..."
                className="rounded-md w-64 h-8 border-gray-200 my-2"
                onChange={(e) => setSearchInput(e.target.value)}
            />

            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-primary-200">
                        <TableRow>
                            <TableHead className="border border-gray-300 text-black">Title</TableHead>
                            <TableHead className="border border-gray-300 text-black">Start date</TableHead>
                            <TableHead className="border border-gray-300 text-black">End Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filterCycles(cycles).map((cycle) => (
                            <TableRow key={cycle.id}>
                                <TableCell className="border border-gray-300">{cycle.title}</TableCell>
                                <TableCell className="border border-gray-300">{formatDate(cycle.start_at)}</TableCell>
                                <TableCell className="border border-gray-300">{formatDate(cycle.end_at)}</TableCell>
                            </TableRow>
                        ))}
                        {isAddingCycle && (
                            <TableRow>
                                <TableCell className="border border-gray-300">
                                    <Input
                                        name="title"
                                        value={newCycle.title}
                                        onChange={handleInputChange}
                                        placeholder="Cycle Title"
                                        className="w-full"
                                    />
                                </TableCell>
                                <TableCell className="border border-gray-300">
                                    <DatePicker
                                        selected={newCycle.start_at}
                                        onChange={(date) => handleDateChange(date, 'start_at')}
                                        dateFormat="MMM d, yyyy"
                                        placeholderText="Start Date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </TableCell>
                                <TableCell className="border border-gray-300">
                                    <DatePicker
                                        selected={newCycle.end_at}
                                        onChange={(date) => handleDateChange(date, 'end_at')}
                                        dateFormat="MMM d, yyyy"
                                        placeholderText="End Date"
                                        minDate={newCycle.start_at}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {isAddingCycle && (
                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                        <div className="flex justify-end space-x-3">
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                className="px-4 py-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveCycle}
                                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white"
                            >
                                Add Cycle
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cycles;