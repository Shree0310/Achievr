"use client"

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";

const SubtasksTab = ({ subTasks, createSubtaskMode, taskToEdit, userId, onSubtaskCreated, onToggleCreateMode }) => {
    const [subtaskTitle, setSubtaskTitle] = useState("");
    const [subtaskDescription, setSubtaskDescription] = useState("");
    const [subtaskStatus, setSubtaskStatus] = useState("");
    const [subtaskPriority, setSubtaskPriority] = useState("");
    const [subtaskEffort, setSubtaskEffort] = useState("");

    // Debug logging
    console.log('SubtasksTab received subtasks:', subTasks);
    console.log('SubtasksTab taskToEdit:', taskToEdit);

    const handleInsertSubtask = async() => {
        if (!subtaskTitle.trim()) {
            alert("Subtask title is required");
            return;
        }

        if (!taskToEdit?.id || !userId) {
            alert("Missing task or user information");
            return;
        }

        try{
            const {data, error} = await supabase
            .from("tasks")
            .insert([
                {
                    title: subtaskTitle.trim(),
                    description: subtaskDescription || "",
                    priority: subtaskPriority || "3",
                    efforts: subtaskEffort || "1",
                    status: subtaskStatus || "not_started",
                    user_id: userId,
                    parent_task_id: taskToEdit.id,
                    cycle_id: taskToEdit.cycle_id
                }
            ])
            .select();
            
            if(error){
                throw error;
            }

            if (data && data.length > 0) {
                // Clear form
                setSubtaskTitle("");
                setSubtaskDescription("");
                setSubtaskStatus("");
                setSubtaskPriority("");
                setSubtaskEffort("");
                
                // Refresh subtasks list
                if (onSubtaskCreated) {
                    onSubtaskCreated();
                }
                
                // Turn off create mode
                if (onToggleCreateMode) {
                    onToggleCreateMode(false);
                }
                
                alert("Subtask created successfully!");
            }
        }catch(error){
            console.error("Error inserting subtask:", error);
            alert("Failed to create subtask. Please try again.");
        }finally{
        }
    }
    if (!subTasks || subTasks.length === 0) {
        return (
            <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
            No subtasks available
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Description
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Priority
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Efforts
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {subTasks.map((subtask) => (
                        <tr key={subtask.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {subtask.title || 'Untitled Subtask'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                                {subtask.description || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                    ${subtask.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' :
                                    subtask.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400' :
                                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>
                                    {subtask.status || 'not_started'}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {subtask.priority ? (
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                        ${subtask.priority === '1' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
                                        subtask.priority === '2' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400' :
                                        'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'}`}>
                                        P{subtask.priority}
                                    </span>
                                ) : (
                                    <span className="text-gray-400 dark:text-gray-500">-</span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                {subtask.efforts ? (
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{subtask.efforts} SP</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-400 dark:text-gray-500">-</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    {createSubtaskMode && 
                        <tr className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                <input className="w-full py-2 px-3 text-center h-10 text-gray-500 dark:text-gray-400 text-sm dark:bg-[#374a68] bg-gray-100 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                                        value={subtaskTitle}
                                        onChange={(e) => setSubtaskTitle(e.target.value)}/>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                                <input className="w-full py-2 px-3 text-center h-10 text-gray-500 dark:text-gray-400 text-sm dark:bg-[#374a68] bg-gray-100 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                                        value={subtaskDescription}
                                        onChange={(e) => setSubtaskDescription(e.target.value)}/>
                            </td>
                            <td  className="px-4 py-3 text-sm"> 
                                <input className="w-full py-2 px-3 text-center h-10 text-gray-500 dark:text-gray-400 text-sm dark:bg-[#374a68] bg-gray-100 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                                        value={subtaskStatus}
                                        onChange={(e) => setSubtaskStatus(e.target.value)}/>
                            </td>
                            <td className="px-4 py-3 text-sm">
                                <input className="w-full py-2 px-3 text-center h-10 text-gray-500 dark:text-gray-400 text-sm dark:bg-[#374a68] bg-gray-100 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                                        value={subtaskPriority}
                                        onChange={(e) => setSubtaskPriority(e.target.value)}/>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                <input className="w-full py-2 px-3 text-center h-10 text-gray-500 dark:text-gray-400 text-sm dark:bg-[#374a68] bg-gray-100 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                                        value={subtaskEffort}
                                        onChange={(e) => setSubtaskEffort(e.target.value)}/>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex space-x-2">
                                    <button className="px-3 py-1 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={handleInsertSubtask}>
                                        Add
                                    </button>
                                    <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                            onClick={() => {
                                                // Clear form and exit create mode
                                                setSubtaskTitle("");
                                                setSubtaskDescription("");
                                                setSubtaskStatus("");
                                                setSubtaskPriority("");
                                                setSubtaskEffort("");
                                                if (onToggleCreateMode) {
                                                    onToggleCreateMode(false);
                                                }
                                            }}>
                                        Cancel
                                    </button>
                                </div>
                            </td>
                        </tr> }
                </tbody>
            </table>
        </div>
    );
};

export default SubtasksTab;