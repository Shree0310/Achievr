"use client";

import { useState } from "react";
import CreateTask from "./CreateTask";
import { Button } from "@/components/ui/button";
import { IconPlus } from '@tabler/icons-react';
import { SidebarMenuButton } from "@/components/ui/sidebar";

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
    <SidebarMenuButton 
        onClick={handleCreateTask}
        tooltip="Create Task"
      >
        <IconPlus className="h-5 w-5" />
        <span>Create Task</span>
      </SidebarMenuButton>

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
