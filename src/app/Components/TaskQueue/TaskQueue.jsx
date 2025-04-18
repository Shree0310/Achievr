'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/utils/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

const TaskQueue = ({ userId }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tasks, setTasks] = useState([]);
    const [isAddingtask, setIsAddingTask] = useState(false);
    const [cycles, setCycles] = useState([]);
    const [selectedCycle, setSelectedCycle] = useState('');
    const [newTask, setNewTask] = useState(
        {
            title: '',
            status: '',
            priority: '',
            efforts: ''
        }
    )

    useEffect(() => {
        fetchTasks();
        fetchCycles();
    }, [])

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

    async function fetchTasks() {
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select('*, cycles(id, title)');

        if (error) {
            throw error;
        }

        setTasks(tasks || []);
    }

    const handleAddTask = () => {
        setIsAddingTask(true);
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



    return <>
        <div className="flex items-center space-x-4 m-4">
            <div className="text-primary-500 font-bold text-lg">Upcoming Tasks</div>
            <button
                onClick={handleAddTask}
                aria-label="Add new cycle"
                className="bg-primary-500 hover:bg-primary-600 text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-opacity-50 shadow-sm"
            >
                <span className="text-lg leading-none">+</span>
            </button>
        </div>    <div className="rounded-md border m-4">
            <Table className="border border-gray-400">
                <TableHeader className="">
                    <TableRow className="bg-primary-300">
                        <TableHead className="border border-gray-400 text-black text-center">Title</TableHead>
                        <TableHead className="border border-gray-400 text-black text-center">Status</TableHead>
                        <TableHead className="border border-gray-400 text-black text-center">Priority</TableHead>
                        <TableHead className="border border-gray-400 text-black text-center">Efforts</TableHead>
                        <TableHead className="border border-gray-400 text-black text-center">Cycle</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-primary-50">
                    {tasks.map((task) => (
                        <TableRow
                            key={task.id}
                            className="text-center">
                            <TableCell className="border-r border-l border-gray-400">{task.title} </TableCell>
                            <TableCell className="border-r border-gray-400">{task.status}</TableCell>
                            {task.priority ? (
                                <TableCell className="border-r border-gray-400">{task.priority}</TableCell>

                            ) : (
                                <TableCell className="border-r border-gray-400">priority is not set</TableCell>
                            )}
                            {task.efforts ? (
                                <TableCell className="border-r border-gray-400">{task.efforts}</TableCell>
                            ) : (
                                <TableCell className="border-r border-gray-400">efforts not set</TableCell>

                            )}
                            <TableCell className="border-r border-gray-400">
                                {task.cycles ? task.cycles.title : "cycle not set"}
                            </TableCell>
                        </TableRow>
                    ))}
                    {isAddingtask && (
                        <>
                            <TableRow>
                                <TableCell className="border-r border-l border-gray-400">
                                    <Input
                                        name="title"
                                        value={newTask.title}
                                        onChange={handleInputChange}
                                        placeholder="Task title" />
                                </TableCell>
                                <TableCell className="border-r border-gray-400">
                                    <Input
                                        name="status"
                                        value={newTask.status}
                                        onChange={handleInputChange}
                                        placeholder="Task status" />
                                </TableCell>
                                <TableCell className="border-r border-gray-400">
                                    <Input
                                        name="priority"
                                        value={newTask.priority}
                                        onChange={handleInputChange}
                                        placeholder="Task Priority" />
                                </TableCell>
                                <TableCell className="border-r border-gray-400">
                                    <Input
                                        name="efforts"
                                        value={newTask.efforts}
                                        onChange={handleInputChange}
                                        placeholder="Task Efforts" />
                                </TableCell>
                                <TableCell className="border-r border-gray-400">
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
                                <TableCell colSpan={5} className="border-r border-gray-400 bg-gray-50 p-3">
                                    <div className="flex justify-end space-x-3">
                                        <Button 
                                            onClick={handleCancel}
                                            variant="outline"
                                            className="px-4 py-2 border border-gray-300 hover:bg-gray-100 transition-colors">
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
    </>
}
export default TaskQueue;