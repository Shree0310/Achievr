'use client'

import { useState } from "react";
import CreateTask from "./CreateTask";
import { Button } from "@/components/ui/button";

const CreateTaskButton = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
    }
    return (
        <>
            <div className="absolute z-30 top-4 left-4 py-12 rounded-md">
                <Button className=" bg-white px-3 text-gray-800 items-center"
                    onClick={() => setIsOpen(true)}>
                    Create Task
                    <span className="px-4 font-extrabold text-primary-500 text-2xl">+</span>
                </Button>
            </div>

            {
                isOpen &&
                <CreateTask
                    onClose={handleClose}
                    userId={userId}
                />

            }
        </>
    );

}

export default CreateTaskButton;