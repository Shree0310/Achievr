'use client'

import { useState } from "react";
import CreateTask from "./CreateTask";

const CreateTaskButton = ({userId}) =>{
    const [isOpen, setIsOpen] = useState(false);

    const handleClose =()=>{
        setIsOpen(false);
    }
    return (
        <>
            <div className="absolute h-4 w-44 z-30 top-4 left-4 py-12 rounded-md">
                <div className="flex bg-white hover:bg-primary-200 px-2 pt-1 pb-2 shadow-md rounded-md">
                    <button className="px-3 text-gray-800 items-center"
                        onClick={() =>setIsOpen(true)}>
                            Create Task 
                            <span className="px-4 font-extrabold text-primary-500 text-2xl">+</span>
                    </button>
                </div>
        </div>

        {
            isOpen && 
                <CreateTask
                onClose ={handleClose}
                userId={userId}
                />
            
        }
        </>
    );
    
}

export default CreateTaskButton;