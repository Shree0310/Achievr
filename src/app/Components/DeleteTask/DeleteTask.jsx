'use client'

import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useState } from "react";

const DeleteTask = ({ taskToDelete, onClose, onTaskDelete }) => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = () => {
        setDeleteModal(!deleteModal);
    }

    const cancelDelete = () => {
        setDeleteModal(false);
    }

    const confirmDelete = async () => {
        if (!taskToDelete) return;

        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskToDelete);

            if (error) throw error;
            setDeleteModal(false);

            if(onClose){
                onClose();
            }

            if(onTaskDelete){
                onTaskDelete();
            }

        } catch (error) {
            console.error("Error deleting task:", error);
            setError("Failed to delete task: " + error.message);
        }
    };

    return (
        <>
        {deleteModal ? (
            <div className="absolute top-10 right-0 z-50">
                <div className="w-72 px-4 py-3 bg-white dark:bg-gray-800 rounded-md shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-sm font-medium text-gray-700 dark:text-white mb-3">Are you sure you want to delete this task?</h2>
                    
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-2 mb-3 rounded text-xs">
                            <p>{error}</p>
                        </div>
                    )}
                    
                    <div className="flex justify-end space-x-3">
                        <Button 
                            onClick={cancelDelete}
                            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded transition-colors border border-gray-300 dark:border-gray-600"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={confirmDelete}
                            className="px-3 py-1.5 bg-error-500 hover:bg-red-600 text-white text-sm font-medium rounded transition-colors"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg dark:shadow-gray-900/50 z-10 border border-gray-200 dark:border-gray-700">
                <ul className="py-1">
                    <li 
                        onClick={handleDelete}
                        className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                        Delete Task
                    </li>
                </ul>
            </div>
        )}
        </>
    );
};

export default DeleteTask; 