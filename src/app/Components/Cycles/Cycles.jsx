'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

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
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [sortColumn, setSortColumn] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showSortDialog, setShowSortDialog] = useState(false);
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

        const timer = setTimeout(filterCycles(cycles), 1000);

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
        return () => {
            clearTimeout(timer);
        }
    }, [userId, isDemoMode]);

    async function fetchCycles() {
        try {
            if (!userId) {
                console.log('No userId provided for fetching cycles');
                return;
            }

            let query = supabase
                .from('cycles')
                .select('*')
                .eq('user_id', userId);

            query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

            const { data: cycles, error } = await query;

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

    const sortCycles = (columnName) => {
        return () => {
            if (sortColumn === columnName) {
                const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                setSortOrder(newOrder);
            } else {
                setSortOrder(columnName);
            }
            fetchCycles(searchInput);
        }
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
                {isSearchActive ? (
                    <Input
                        value={searchInput}
                        placeholder="Search cycles..."
                        className="rounded-md w-64 h-8 border-gray-200 my-2 bg-primary-200"
                        onChange={(e) => setSearchInput(e.target.value)}
                        autoFocus
                        onBlur={() => {
                            if (!searchInput) {
                                setIsSearchActive(false)
                            }
                        }}
                    />
                ) : (
                    <div
                        className="flex cursor-pointer"
                        onClick={() => setIsSearchActive(true)}
                    >
                        <svg className="h-4 w-4 my-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <span className="h-3 w-3 my-1 mx-1 text-gray-500">Search</span>
                    </div>
                )}

            </div>
            <div className="relative">
                <div className="flex text-gray-500 cursor-pointer z-10"
                    onClick={() => setShowSortDialog((prev) => !prev)}>
                    <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                    </svg>
                    <span className="text-sm text-gray-500 mx-1">Sort</span>

                </div>
                {showSortDialog && (
                    <div className="absolute top-full left-0 mt-2 bg-white h-36 w-[400px] shadow-md rounded-md z-50">
                        <h1 className="px-4 font-medium py-4">Sort By</h1>
                        <div className="flex gap-2 p-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center justify-between px-4 py-2 h-10 w-52 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
                                    <span>{sortColumn.charAt(0).toUpperCase() + sortColumn.slice(1)}</span>
                                    <svg className="zw-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>

                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white rounded-md shadow-lg border w-48 border-gray-200">
                                    <DropdownMenuItem onClick={sortCycles("title")}>Title</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center justify-between px-4 py-2  h-10 w-44 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
                                    <span>{sortOrder == 'asc'? 'Ascending' : 'Descending'}</span>
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                                            </svg>
                                            Ascending
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
                                            </svg>
                                            Descending
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </div>

                    </div>
                )}

            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                    {error}
                </div>
            )}
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