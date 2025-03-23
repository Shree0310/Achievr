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
                <div className="bg-[#D9D9D9] p-2 shadow-md rounded-md">
                    <button className="text-gray-800 items-center"
                        onClick={() =>setIsOpen(true)}>Create Task</button>
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