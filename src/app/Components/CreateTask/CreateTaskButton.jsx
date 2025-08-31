"use client";

import { useState } from "react";
import CreateTask from "./CreateTask";
import { Button } from "@/components/ui/button";

const CreateTaskButton = ({ userId, onTaskUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleTaskUpdate = (action, data) => {
    if (onTaskUpdate) {
      onTaskUpdate(action, data);
    }
    setIsOpen(false);
  };

  const handleCreateTask = () => {
    setIsCreateMode(true);
    setIsOpen(true);
  };

  return (
    <>
      <Button
        className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors bg-primary-50 dark:bg-gray-900 dark:border dark:border-blue-300 text-gray-800 hover:text-primary-600 dark:text-white hover:bg-primary-100"
        onClick={() => handleCreateTask()}>
        <svg
          className="mr-3 h-5 w-5 text-primary-500"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path d="M12 4v16m8-8H4" />
        </svg>
        Create Task
      </Button>

      {isOpen && (
        <CreateTask
          onClose={handleClose}
          userId={userId}
          onTaskUpdate={handleTaskUpdate}
          isCreateMode={true}
        />
      )}
    </>
  );
};

export default CreateTaskButton;
