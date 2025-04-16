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
            <Button 
                className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors bg-primary-50 text-primary-600 hover:bg-primary-100"
                onClick={() => setIsOpen(true)}
            >
                <svg
                    className="mr-3 h-5 w-5 text-primary-500"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d="M12 4v16m8-8H4" />
                </svg>
                Create Task
            </Button>

            {isOpen && (
                <CreateTask
                    onClose={handleClose}
                    userId={userId}
                />
            )}
        </>
    );
}

export default CreateTaskButton;