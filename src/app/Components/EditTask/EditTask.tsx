'use client'

import { supabase } from "@/utils/supabase/client";
import Navbar from '../Navbar/Navbar';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CommentBox from "../Comments/CommentBox";
import SubtasksTab from "../Subtasks/SubtasksTab";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { SlashCommand, slashCommandSuggestion } from './SlashCommandExtension';
import { IconDots, IconTrash, IconAlertTriangle } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Task {
    id : string,
    title: string,
    status: string,
    cycle_id: string,
    description?: string,
    priority?: string,
    efforts?: string,
    user_id?: string 
}

interface EditTaskProps {
    taskId: string;
}

const EditTask = ({taskId}:EditTaskProps) => {
    const [task, setTask] = useState<Task | null>(null);
    const [subTasks, setSubTasks] = useState<Task[]>([]);
    const [addSubTaskMode, setAddSubtaskMode] = useState(false);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
    const [newSubtaskDes, setNewSubtaskDes] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [efforts, setEfforts] = useState("");
    const [userId, setUserId] = useState<string | undefined>("");
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: ({ node }) => {
                    if (node.type.name === 'heading') {
                        return `Heading`
                    }
                    return 'Type "/" for commands'
                },
                showOnlyWhenEditable: true,
                showOnlyCurrent: false,
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg my-4',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 hover:text-blue-700 underline',
                },
            }),
            SlashCommand.configure({
                suggestion: slashCommandSuggestion,
            }),
        ],
        content: description,
        onUpdate: ({ editor }) => {
            setDescription(editor.getHTML())
        },
        editorProps:{
            attributes: {
                class: 'w-full px-2 py-2 min-h-28 border-none focus:outline-none bg-white dark:bg-neutral-900 prose prose-sm max-w-none'
            }
        }
    })

    const fetchSubTask = async () => { 
        try{
            const {data, error} = await supabase
                .from("tasks")
                .select("*")
                .eq("parent_task_id", taskId);
            
            if(error) throw error;

            setSubTasks(data || []); // Handle null case
        }
        catch(error){
            console.error("Error while fetching the subtasks", error);
        }
    }

    const fetchTask = async ()=>{
        try{
            setLoading(true);
            const {data, error} = await supabase
                .from('tasks')
                .select('*')
                .eq('id', taskId)
                .single();
            
            if(error) throw error;

            if(!data){
                router.push('/board');
                return;
            }
            setTask(data);

            setTitle(data.title || "");
            setDescription(data.description || "");
            setEfforts(data.efforts || "");
            setPriority(data.priority || "");
            setStatus(data.status || "");
            setUserId(data.user_id || "");
        }
        catch(error){
            console.error('Error in fetching the task', error);
            router.push('/board');
        } finally {
            setLoading(false);
        }
    }

    const handleNewSubtask = () => {
        setAddSubtaskMode(!addSubTaskMode);
    }

    const handleSave = async() => {
        try{
            const {error} = await supabase
                .from("tasks")
                .update({
                    title: title,
                    description: description,
                    status: status || null,
                    priority: priority || null,
                    efforts: efforts || null,
                })
                .eq('id', taskId);

            if(error) throw error;

            // Optional: Show success message or redirect
            console.log('Task updated successfully');
        }
        catch(error) {
            console.error('error while updating the task', error);
        }
    }

    const handleDeleteClick = () => {
        setShowMenu(false);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            // First, delete all related comments
            const { error: commentsError } = await supabase
                .from('comments')
                .delete()
                .eq('task_id', taskId);

            if (commentsError) throw commentsError;

            // Then delete the task
            const { error: taskError } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskId);

            if (taskError) throw taskError;

            // Navigate back to board
            router.push('/board');
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again.');
            setShowDeleteConfirm(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const handleAddSubtask = async (taskTitle: string, taskDescription: string) => {
        if (!task) return;
        try {
            const {data, error} = await supabase
                .from("tasks")
                .insert([
                    {
                        title: taskTitle.trim(),
                        description: taskDescription,
                        priority: "3", // Default to low priority
                        efforts: "1", // Default to 1 story point
                        status: "not_started", // Default status
                        user_id: userId,
                        parent_task_id: task.id,
                        cycle_id: task.cycle_id
                    }
                ])
                .select();

                if(error) throw error;

                await fetchSubTask();
                setNewSubtaskTitle("");
                setNewSubtaskDes("");
                setAddSubtaskMode(false);
                
        }
        catch(error){
            console.error("Error in adding subtasks", error)
        }
    }

    useEffect(() => {
        fetchTask();
        fetchSubTask();
    },[taskId])

    // Update editor content when description changes
    useEffect(() => {
        if (editor && description !== editor.getHTML()) {
            editor.commands.setContent(description)
        }
    }, [description, editor])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-neutral-600 dark:text-neutral-400">Loading task...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen dark:bg-neutral-800/20">
            <div className="left-0 top-0 h-full">
                <Navbar userId={userId} onTaskUpdate={fetchTask}></Navbar>
            </div>
            <div className="flex-1 p-8">
                <div className="flex justify-between ">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()}
                            className="text-neutral-600 py-2 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 flex items-center gap-2"
                        >
                            ← Back to Board
                        </button>

                        {/* Three-dot menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                                title="More options"
                            >
                                <IconDots className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                            </button>

                            {/* Dropdown menu */}
                            <AnimatePresence>
                                {showMenu && (
                                    <>
                                        {/* Invisible backdrop to close menu */}
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowMenu(false)}
                                        />

                                        {/* Menu */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-20"
                                        >
                                            <button
                                                onClick={handleDeleteClick}
                                                className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                                            >
                                                <IconTrash className="w-4 h-4" />
                                                Delete Task
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 flex items-end justify-end"
                    >
                        Save Changes
                    </button>
                </div>
                {task && 
                    <div>
                        <div>
                            <input
                                type="text"
                                placeholder="Enter task title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-2 py-1 text-2xl placeholder:text-xl border-none focus:outline-none bg-white dark:bg-neutral-900"
                            />
                        </div>
                
                        {/* Description Input */}
                        <div className="border border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden my-4 p-2">
                            <EditorContent editor={editor} />
                        </div>
                        
                        <div className="flex flex-row gap-3 my-4">
                          {/* Status Change */}
                            <div>
                              <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-30 px-3 py-2 text-sm bg-white dark:bg-neutral-800 rounded-md appearance-none">
                                <option value="" disabled>
                                   Status
                                </option>
                                <option value="not started">Not started</option>
                                <option value="in progress">In Progress</option>
                                <option value="under review">Under Review</option>
                                <option value="completed">Completed</option>
                              </select>
                            </div>
                            
                            {/* Priority and Effort Selection */}
                            <div className="flex justify-center items-center">
                              <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-30 px-2 py-2 text-sm bg-white dark:bg-neutral-800 rounded-md appearance-none">                    
                                <option value="" disabled>
                                  Select Priority
                                </option>
                                <option value="1">High Priority (P1)</option>
                                <option value="2">Medium Priority (P2)</option>
                                <option value="3">Low Priority (P3)</option>
                              </select>
                            </div>
            
                            <div>
                              <select
                                value={efforts}
                                onChange={(e) => setEfforts(e.target.value)}
                                className="w-24 px-2 py-2 text-sm bg-white dark:bg-neutral-800 rounded-md appearance-none">                    
                                <option value="" disabled>
                                  Select Points
                                </option>
                                <option value="1">1 Point</option>
                                <option value="2">2 Points</option>
                                <option value="3">3 Points</option>
                                <option value="5">5 Points</option>
                                <option value="8">8 Points</option>
                              </select>
                            </div>
                        </div>
                        
                        <div className="py-4 px-4 mt-8">
                            <div className="flex justify-between">
                                <h1 className="text-lg py-4 font-semibold">Subtasks</h1>
                                <button className="text-lg py-4 h-6 px-4 font-semibold" onClick={handleNewSubtask}>+</button>
                            </div>
                            {addSubTaskMode && <div className="div">
                                <div className="dark:bg-neutral-800 my-4 rounded-md">
                                    <input 
                                        type="text"
                                        className="w-full px-3 h-10 my-3 text-neutral-500 focus-visible:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible::border-none dark:text-neutral-500 text-sm bg-neutral-100 dark:bg-neutral-800 placeholder:text-sm" 
                                        placeholder="Subtask Title"
                                        value={newSubtaskTitle}
                                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                    />
                                    <input 
                                        type="text"
                                        className="w-full px-3 h-10 my-3 text-neutral-500 focus-visible:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible::border-none dark:text-neutral-500 text-sm bg-neutral-100 dark:bg-neutral-800 placeholder:text-sm"  
                                        placeholder="Add Description"
                                        value={newSubtaskDes}
                                        onChange={(e) => setNewSubtaskDes(e.target.value)}
                                    />
                                </div>
                                    <button onClick={() => handleAddSubtask(newSubtaskTitle, newSubtaskDes)}
                                        className="px-3 text-neutral-600 hover:text-neutral-900 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 flex items-center gap-2">Add subtask
                                    </button>
                            </div>
                            }
                            <SubtasksTab 
                                subTasks={subTasks}
                                taskToEdit={task} 
                                userId={userId} 
                                onSubtaskCreated={fetchSubTask} // Better than window.location.reload()
                            />
                        </div>
                        
                        <div className="py-4 px-4 mt-8">
                            <h1 className="text-lg font-semibold">Activity</h1>
                            <CommentBox taskToEdit={task} userId={userId}/>
                        </div>
                    </div>
                }

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={handleCancelDelete}
                                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            />

                            {/* Modal */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.2 }}
                                className="relative w-full max-w-md mx-4"
                            >
                                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl p-6">
                                    {/* Icon and Title */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                            <IconAlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                Delete Task
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Are you sure you want to delete "{title}"? 
                                            </p>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-3 justify-end mt-6">
                                        <button
                                            onClick={handleCancelDelete}
                                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleConfirmDelete}
                                            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                                        >
                                            Delete Task
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default EditTask;