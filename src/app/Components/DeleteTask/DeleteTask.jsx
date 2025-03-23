'use client'

import { supabase } from "@/utils/supabase/client";
import { useState } from "react";

const DeleteTask = ({ taskToDelete, onClose }) => {
    const [deleteModal, setDeleteModal] = useState(false);

    const handleDelete = () =>{
        setDeleteModal(true);
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

            // Refresh the page after successful deletion
            window.location.reload();
        } catch (error) {
            console.error("Error deleting task:", error);
            setError("Failed to delete task: " + error.message);
        }
    };

    return (
        <>
        {deleteModal ? (
            <div className="pt-52">
        <div className="h-16 w-64 px-2 bg-white rounded-md shadow-md z-10">
            <h2 className="text-sm py-2">Are you sure you want to delete?</h2>
            <div className="flex justify-between">
                <button className="bg-gray-400 h-5 w-16 text-sm rounded-sm shadow-sm">Cancel</button>
                <button className="bg-violet-400 h-5 w-16 text-sm rounded-sm shadow-sm" onClick={confirmDelete}>Confirm</button>
            </div>
            </div>

            </div>):(
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <ul className="py-1">
                    <li 
                        onClick={handleDelete}
                        className="block px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer"
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