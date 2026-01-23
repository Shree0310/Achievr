'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/utils/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState, useRef } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, Item } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const TaskQueue = ({ userId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchInput, setSearchInput] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [showSortDialog, setShowSortDialog] = useState(false);
    const [sortOrder, setSortOrder] = useState(() => {
        const saved = localStorage.getItem('taskSortOrder');
        return saved || 'asc';
    });
    const [sortColumn, setSortColumn] = useState(() => {
        const saved = localStorage.getItem('taskSortColumn');
        return saved || 'title';
    });
    const [tasks, setTasks] = useState([]);
    const [isAddingtask, setIsAddingTask] = useState(false);
    const [cycles, setCycles] = useState([]);
    const [selectedCycle, setSelectedCycle] = useState('');
    const [currPage, setCurrPage] = useState(0);
    const [newTask, setNewTask] = useState(
        {
            title: '',
            status: '',
            priority: '',
            efforts: ''
        }
    )
    const PAGE_SIZE = 5;
    const totalTasks = tasks.length;
    const totalPages = Math.ceil(totalTasks / PAGE_SIZE);
    const start = currPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    const isDemoMode = userId === "demo-user-id";

    const sortDialogRef = useRef(null);

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTask, setEditTask] = useState({ title: '', status: '', priority: '', efforts: '', cycle_id: '' });

    useEffect(() => {
        function handleClickOutside(event) {
            if (sortDialogRef.current && !sortDialogRef.current.contains(event.target)) {
                setShowSortDialog(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(filterTasks(searchInput), 1000);

        if (!isDemoMode) {
            fetchTasks();
            fetchCycles();
        }

        if (isDemoMode) {
            console.log('initiating demo tasks');
            const demoTasks = [
                {
                    id: generateUUID(),
                    title: "complete system design",
                    user_id: userId,
                    status: "In progress",
                    efforts: "1",
                    priority: "1",
                    cycle_id: generateUUID()
                }
            ];
            setTasks(demoTasks);
            return;
        }
        fetchTasks();
        return () => {
            clearTimeout(timer);
        };
    }, [userId, isDemoMode, searchInput, sortColumn, sortOrder])

    async function fetchCycles() {
        const { data, error } = await supabase
            .from('cycles')
            .select('*')

        if (error) {
            throw error;
        }

        setCycles(data);
        if (!selectedCycle) {
            setSelectedCycle(data[0]);
        }
    }

    async function fetchTasks(searchQuery = "") {
        try {
            let query = supabase
                .from('tasks')
                .select('*, cycles(id, title)');

            if (searchQuery) {
                query = query.or(`title.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%`);
            }

            query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

            const { data: tasks, error } = await query;

            if (error) {
                throw error;
            }
            console.log(tasks);
            setTasks(tasks || []);
        } catch (error) {
            setError('Failed to fetch tasks');
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleAddTask = () => {
        setIsAddingTask(true);
    }

    const filterTasks = (tasks) => {
        if (!Array.isArray(tasks)) { return []; }

        const searchTerm = searchInput.toLowerCase();
        return tasks.filter(task => {
            return (
                (task.title?.toLowerCase() || '').includes(searchTerm) ||
                (task.description?.toLowerCase() || '').includes(searchTerm)
            )

        })
    }

    const sortTask = (columnName) => {
        return () => {
            if(sortColumn === columnName) {
                const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                setSortOrder(newOrder);
                localStorage.setItem('taskSortOrder', newOrder);
            } else {
                setSortColumn(columnName);
                localStorage.setItem('taskSortColumn', columnName);
            }
            fetchTasks(searchInput);
        }
    }

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
        localStorage.setItem('taskSortOrder', order);
        setShowSortDialog(false); // Only close dialog after order is selected
        fetchTasks(searchInput);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function handleSaveTask() {
        const { data, error } = await supabase
            .from('tasks')
            .insert([{
                title: newTask.title,
                status: newTask.status,
                efforts: newTask.efforts,
                priority: newTask.priority,
                user_id: userId,
                cycle_id: selectedCycle
            }])
            .select()

        if (data && data.length > 0) {
            setTasks(prev => (
                [
                    ...prev,
                    data[0]
                ]))
        }

        if (error) {
            throw error;
        }

        setNewTask({
            title: '',
            status: '',
            efforts: null,
            priority: null,
        });

        setIsAddingTask(false);

    }

    const handleCancel = () => {
        setIsAddingTask(false);

        setNewTask({
            title: '',
            status: '',
            efforts: '',
            priority: '',
        });
    }

    const handlePageChange = (x) => {
        setCurrPage(x);
    }

    const handlePrevPage = (x) => {
        setCurrPage((prev) => prev - 1);
    }

    const handleNextPage = () => {
        setCurrPage((prev) => prev + 1);
    }

    // Handler to start editing a task
    const handleEditTask = (task) => {
        setEditingTaskId(task.id);
        setEditTask({
            title: task.title || '',
            status: task.status || '',
            priority: task.priority || '',
            efforts: task.efforts || '',
            cycle_id: task.cycle_id || '',
        });
    };

    // Handler for editing input changes
    const handleEditTaskInputChange = (e) => {
        const { name, value } = e.target;
        setEditTask((prev) => ({ ...prev, [name]: value }));
    };

    // Handler for editing cycle select
    const handleEditTaskCycleChange = (value) => {
        setEditTask((prev) => ({ ...prev, cycle_id: value }));
    };

    // Handler to save the edited task
    async function handleSaveEditTask() {
        if (!editTask.title.trim()) {
            setError('Please enter a task title');
            return;
        }
        try {
            if (isDemoMode) {
                setTasks((prev) => prev.map((task) =>
                    task.id === editingTaskId
                        ? { ...task, ...editTask }
                        : task
                ));
            } else {
                const { data, error } = await supabase
                    .from('tasks')
                    .update({
                        title: editTask.title,
                        status: editTask.status,
                        priority: editTask.priority,
                        efforts: editTask.efforts,
                        cycle_id: editTask.cycle_id,
                    })
                    .eq('id', editingTaskId)
                    .select();
                if (error) {
                    setError(error.message);
                    return;
                }
                setTasks((prev) => prev.map((task) =>
                    task.id === editingTaskId ? data[0] : task
                ));
            }
            setEditingTaskId(null);
            setEditTask({ title: '', status: '', priority: '', efforts: '', cycle_id: '' });
            setError('');
        } catch (error) {
            setError(error.message);
        }
    }

    // Handler to cancel editing
    const handleCancelEditTask = () => {
        setEditingTaskId(null);
        setEditTask({ title: '', status: '', priority: '', efforts: '', cycle_id: '' });
        setError('');
    };

    return <>
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        <div className="flex items-center space-x-4 m-4">
            <div className="text-primary-500 font-bold text-lg">Upcoming Tasks</div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        aria-label="Add new task"
                        className="bg-primary-500 hover:bg-primary-600 text-white text-sm w-32 h-8 rounded-md px-4 flex items-center justify-between transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-opacity-50 shadow-sm"
                    >
                        Create Task
                        <svg
                            className="h-4 w-4 ml-1.5 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="white"
                        >
                            <path d="M19 9l-7 7-7-7" />
                        </svg>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56 p-1 bg-white rounded-lg shadow-lg border border-neutral-200 z-10 ">
                    <DropdownMenuItem
                        onClick={handleAddTask}
                        className="flex items-center px-3 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 rounded-md cursor-pointer transition-colors duration-150 group"
                    >
                        <svg
                            className="mr-2 h-4 w-4 text-neutral-400 group-hover:text-primary-500"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M12 4v16m8-8H4" />
                        </svg>
                        <span>New Task</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="flex items-center px-3 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 rounded-md cursor-pointer transition-colors duration-150 group"
                    >
                        <svg
                            className="mr-2 h-4 w-4 text-neutral-400 group-hover:text-primary-500"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        <span>New Group of Tasks</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative">
                {showResults ? (
                    <Input
                        value={searchInput}
                        placeholder="Search tasks..."
                        className="rounded-md w-64 h-8 border-neutral-200 pl-8 bg-primary-200"
                        onChange={(e) => setSearchInput(e.target.value)}
                        autoFocus
                        onBlur={() => {
                            if (!searchInput) {
                                setShowResults(false);
                            }
                        }}
                    />
                ) : (
                    <div
                        onClick={() => setShowResults(true)}
                        className="flex items-center cursor-pointer px-3 py-1.5 rounded-md hover:bg-neutral-100"
                    >
                        <svg
                            className="h-4 w-4 text-neutral-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="ml-2 text-sm text-neutral-600">Search</span>
                    </div>
                )}
            </div>
            <div className="relative">
                <div className="flex text-neutral-500 cursor-pointer z-10" onClick={() => setShowSortDialog(true)}>
                    <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                    </svg>
                    <span className="text-sm text-neutral-500 mx-1">Sort</span>
                </div>

                {showSortDialog && (
                    <div ref={sortDialogRef} className="absolute top-full left-0 mt-2 bg-white h-36 w-[400px] shadow-md rounded-md z-50">
                        <h1 className="px-4 font-medium py-4">Sort By</h1>
                        <div className="flex gap-2 p-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center justify-between px-4 py-2 h-10 w-52 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50">
                                    <span>{sortColumn.charAt(0).toUpperCase() +sortColumn.slice(1)}</span>
                                    <svg className="zw-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent  className="bg-white rounded-md shadow-lg border w-48 border-neutral-200">
                                    <DropdownMenuItem onClick={sortTask("title")} className="px-4 py-2 hover:bg-neutral-50 cursor-pointer">Title</DropdownMenuItem>
                                    <DropdownMenuItem onClick={sortTask("status")} className="px-4 py-2 hover:bg-neutral-50 cursor-pointer">Status</DropdownMenuItem>
                                    <DropdownMenuItem onClick={sortTask("priority")} className="px-4 py-2 hover:bg-neutral-50 cursor-pointer">Priority</DropdownMenuItem>
                                    <DropdownMenuItem onClick={sortTask("efforts")} className="px-4 py-2 hover:bg-neutral-50 cursor-pointer">Efforts</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center justify-between px-4 py-2  h-10 w-44 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50">
                                    <span>{sortOrder == 'asc'? "Ascending" : "Descending"}</span>
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white rounded-md shadow-lg border w-40 border-neutral-200">
                                    <DropdownMenuItem
                                        onClick={() => handleSortOrderChange('asc')}
                                        className="flex items-center px-4 py-2 hover:bg-neutral-50 cursor-pointer"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                                        </svg>
                                        Ascending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => handleSortOrderChange('desc')}
                                        className="flex items-center px-4 py-2 hover:bg-neutral-50 cursor-pointer"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
                                        </svg>
                                        Descending
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="rounded-md border border-neutral-400 dark:border-neutral-600 m-4 bg-white dark:bg-neutral-800">
            <Table className="border border-neutral-400 dark:border-neutral-600">
                <TableHeader className="">
                    <TableRow className="bg-primary-300 dark:bg-primary-700">
                        <TableHead 
                            onClick={sortTask("title")} 
                            className="border border-neutral-400 dark:border-neutral-600 text-black dark:text-white text-center cursor-pointer hover:bg-primary-400 dark:hover:bg-primary-600 transition-colors group"
                        >
                            <div className="flex items-center justify-center space-x-1">
                                <span>Title</span>
                                {sortColumn === "title" && (
                                    <svg 
                                        className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 20 20" 
                                        fill="currentColor"
                                    >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        </TableHead>
                        <TableHead 
                            onClick={sortTask("status")} 
                            className="border border-neutral-400 dark:border-neutral-600 text-black dark:text-white text-center cursor-pointer hover:bg-primary-400 dark:hover:bg-primary-600 transition-colors"
                        >
                            <div className="flex items-center justify-center space-x-1">
                                <span>Status</span>
                                {sortColumn === "status" && (
                                    <svg 
                                        className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 20 20" 
                                        fill="currentColor"
                                    >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        </TableHead>
                        <TableHead 
                            onClick={sortTask("priority")} 
                            className="border border-neutral-400 dark:border-neutral-600 text-black dark:text-white text-center cursor-pointer hover:bg-primary-400 dark:hover:bg-primary-600 transition-colors"
                        >
                            <div className="flex items-center justify-center space-x-1">
                                <span>Priority</span>
                                {sortColumn === "priority" && (
                                    <svg 
                                        className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 20 20" 
                                        fill="currentColor"
                                    >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        </TableHead>
                        <TableHead 
                            onClick={sortTask("efforts")} 
                            className="border border-neutral-400 dark:border-neutral-600 text-black dark:text-white text-center cursor-pointer hover:bg-primary-400 dark:hover:bg-primary-600 transition-colors"
                        >
                            <div className="flex items-center justify-center space-x-1">
                                <span>Efforts</span>
                                {sortColumn === "efforts" && (
                                    <svg 
                                        className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 20 20" 
                                        fill="currentColor"
                                    >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        </TableHead>
                        <TableHead className="border border-neutral-400 dark:border-neutral-600 text-black dark:text-white text-center">Cycle</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-primary-50 dark:bg-neutral-900">
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3 text-primary-500" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Loading tasks...</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        filterTasks(tasks).slice(start, end).map((task) => (
                            editingTaskId === task.id ? (
                                <TableRow key={task.id}>
                                    <TableCell className="border-r border-l border-neutral-400">
                                        <Input
                                            name="title"
                                            value={editTask.title}
                                            onChange={handleEditTaskInputChange}
                                            placeholder="Task title"
                                        />
                                    </TableCell>
                                    <TableCell className="border-r border-neutral-400">
                                        <Input
                                            name="status"
                                            value={editTask.status}
                                            onChange={handleEditTaskInputChange}
                                            placeholder="Task status"
                                        />
                                    </TableCell>
                                    <TableCell className="border-r border-neutral-400">
                                        <Input
                                            name="priority"
                                            value={editTask.priority}
                                            onChange={handleEditTaskInputChange}
                                            placeholder="Task Priority"
                                        />
                                    </TableCell>
                                    <TableCell className="border-r border-neutral-400">
                                        <Input
                                            name="efforts"
                                            value={editTask.efforts}
                                            onChange={handleEditTaskInputChange}
                                            placeholder="Task Efforts"
                                        />
                                    </TableCell>
                                    <TableCell className="border-r border-neutral-400">
                                        <Select
                                            value={editTask.cycle_id}
                                            onValueChange={handleEditTaskCycleChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select cycle" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cycles.map(cycle => (
                                                    <SelectItem key={cycle.id} value={cycle.id}>{cycle.title}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell colSpan={5} className="border-r border-neutral-400 bg-neutral-50 p-3">
                                        <div className="flex justify-end space-x-3">
                                            <Button
                                                onClick={handleCancelEditTask}
                                                variant="outline"
                                                className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 transition-colors">
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleSaveEditTask}
                                                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white transition-colors shadow-sm">
                                                Save
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <TableRow
                                    key={task.id}
                                    className="text-center cursor-pointer hover:bg-primary-100"
                                    onClick={() => handleEditTask(task)}
                                >
                                    <TableCell className="border-r border-l border-neutral-400">{task.title} </TableCell>
                                    <TableCell className="border-r border-neutral-400">{task.status}</TableCell>
                                    {task.priority ? (
                                        <TableCell className="border-r border-neutral-400">{task.priority}</TableCell>
                                    ) : (
                                        <TableCell className="border-r border-neutral-400">priority is not set</TableCell>
                                    )}
                                    {task.efforts ? (
                                        <TableCell className="border-r border-neutral-400">{task.efforts}</TableCell>
                                    ) : (
                                        <TableCell className="border-r border-neutral-400">efforts not set</TableCell>
                                    )}
                                    <TableCell className="border-r border-neutral-400">
                                        {task.cycles ? task.cycles.title : "cycle not set"}
                                    </TableCell>
                                </TableRow>
                            )
                        ))
                    )}
                    {isAddingtask && (
                        <>
                            <TableRow>
                                <TableCell className="border-r border-l border-neutral-400">
                                    <Input
                                        name="title"
                                        value={newTask.title}
                                        onChange={handleInputChange}
                                        placeholder="Task title" />
                                </TableCell>
                                <TableCell className="border-r border-neutral-400">
                                    <Input
                                        name="status"
                                        value={newTask.status}
                                        onChange={handleInputChange}
                                        placeholder="Task status" />
                                </TableCell>
                                <TableCell className="border-r border-neutral-400">
                                    <Input
                                        name="priority"
                                        value={newTask.priority}
                                        onChange={handleInputChange}
                                        placeholder="Task Priority" />
                                </TableCell>
                                <TableCell className="border-r border-neutral-400">
                                    <Input
                                        name="efforts"
                                        value={newTask.efforts}
                                        onChange={handleInputChange}
                                        placeholder="Task Efforts" />
                                </TableCell>
                                <TableCell className="border-r border-neutral-400">
                                    <Select
                                        defaultValue={selectedCycle}
                                        onValueChange={(value) => setSelectedCycle(value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select cycle" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cycles.map(cycle => (
                                                <SelectItem key={cycle.id} value={cycle.id}>{cycle.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={5} className="border-r border-neutral-400 bg-neutral-50 p-3">
                                    <div className="flex justify-end space-x-3">
                                        <Button
                                            onClick={handleCancel}
                                            variant="outline"
                                            className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 transition-colors">
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSaveTask}
                                            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white transition-colors shadow-sm">
                                            Add Task
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </>
                    )}
                </TableBody>
            </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 mb-4 space-x-2">
            <button
                disabled={currPage === 0}
                onClick={() => handlePrevPage()}
                className={`px-3 py-1 rounded-md text-sm font-medium 
                            bg-white border border-neutral-300 
                            hover:bg-neutral-50 hover:border-blue-500
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            transition-colors duration-200
                            ${currPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {"<"}
            </button>
            {[...Array(totalPages).keys()].map((p) => {
                // Show first 3 pages, current page, and last page
                if (p < 3 || p === currPage || p === totalPages - 1) {
                    return (
                        <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`px-3 py-1 rounded-md text-sm font-medium 
                                        ${currPage === p ? 'bg-blue-500 text-white' : 'bg-white'} 
                                        border border-neutral-300 
                                        hover:bg-neutral-50 hover:border-blue-500
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                        transition-colors duration-200`}
                        >
                            {p + 1}
                        </button>
                    );
                } else if (p === 3) {
                    // Show ellipsis after first 3 numbers
                    return <span key="ellipsis" className="px-2">...</span>;
                }
                // Hide other numbers
                return null;
            })}
            <button
                disabled={currPage === totalPages - 1}
                onClick={() => handleNextPage()}
                className={`px-3 py-1 rounded-md text-sm font-medium 
                            bg-white border border-neutral-300 
                            hover:bg-neutral-50 hover:border-blue-500
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            transition-colors duration-200
                            ${currPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {">"}
            </button>
    </div>
    </>
}
export default TaskQueue;