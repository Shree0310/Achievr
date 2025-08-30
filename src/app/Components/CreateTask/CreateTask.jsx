"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import DeleteTask from "../DeleteTask/DeleteTask";
import CommentBox from "../Comments/CommentBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/app/contexts/NotificationContext";

const CreateTask = ({
  onClose,
  userId,
  isEditMode = false,
  taskToEdit,
  onTaskUpdate,
  isCreateMode = true,
}) => {
  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [priority, setPriority] = useState(
    taskToEdit?.priority?.toString() || ""
  );
  const [efforts, setEfforts] = useState(taskToEdit?.efforts?.toString() || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cycles, setCycles] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddCommentsMode, setIsAddCommentsMode] = useState(false);
  const [tasks, setTasks] = useState([]);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (isEditMode && taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority?.toString() || "");
      setEfforts(taskToEdit.efforts?.toString() || "");
      setSelectedCycle(taskToEdit.cycle_id || "");
    }
    fetchCycles();
    if (userId) {
      fetchTasks(userId);
    }
  }, [isEditMode, taskToEdit, userId]);

  const fetchTasks = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, created_at, user_id, status, cycle_id, title, description,")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setTasks(data);
      }
    } catch (error) {
      console.log("error fetching tasks", error);
    }
  };

  const fetchCycles = async () => {
    const { data, error } = await supabase
      .from("cycles")
      .select("id, title")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Error in fetching cycles", error);
    }
    try {
      if (data && data.length > 0) {
        setCycles(data);

        if (isEditMode && taskToEdit?.cycle_id) {
          setSelectedCycle(taskToEdit?.cycle_id);
        } else if (!selectedCycle) {
          setSelectedCycle(data[0].id);
        }
      }
    } catch (error) {
      console.log("cycle id not found");
    }
  };

  const handleCreateTask = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!userId) {
      console.log("Missing userId prop:", userId);
      setError("User not authenticated. Please sign in again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!userId) {
        console.log("user id is missing");
      }
      if (!selectedCycle) {
        console.log("cycle id of selected cycle is missing");
      }

      if (isEditMode && taskToEdit) {
        //update a task in supabase
        const { data, error } = await supabase
          .from("tasks")
          .update([
            {
              title: title,
              description: description,
              priority: priority === null ? "" : priority,
              efforts: efforts === null ? "" : efforts,
              cycle_id: selectedCycle,
              user_id: userId,
            },
          ])
          .eq("id", taskToEdit.id)
          .select();
        if (error) throw error;
        console.log("Task updated successfully:", data);

        // Call the callback to update parent state
        if (onTaskUpdate && data && data.length > 0) {
          onTaskUpdate("update", data[0]);
        }
      } else {
        // Insert task into Supabase
        const { data, error } = await supabase
          .from("tasks")
          .insert([
            {
              title,
              description,
              priority: priority || null,
              efforts: efforts || null,
              status: "not started", // Default status
              user_id: userId,
              cycle_id: selectedCycle,
            },
          ])
          .select();
        if (error) throw error;
        console.log("Task created successfully:", data);
        
        if (data && data.length > 0) {
          // Add notification
          const { data: notificationData, error: notificationError } = await supabase
            .from("notifications")
            .insert({
              event_type: "task added",
              user_id: userId,
              event_time: new Date(),
              title: "New task Added",
              description: "",
            })
            .select();
            
          addNotification({
            type: "info",
            title: "New Task Added",
            message: `A new task was created "${title}"`,
          });

          // Call the callback to update parent state
          if (onTaskUpdate) {
            onTaskUpdate("create", data[0]);
          }
        }
      }

      // Reset form and close modal
      resetForm();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    if (!isEditMode) {
      setTitle("");
      setDescription("");
      setPriority("");
      setEfforts("");
      setError(null);
    }
  };

  const handleAddComments = () => {
    setIsAddCommentsMode(!isAddCommentsMode);
  };

  const handleEditTaskTab = () => {
    setIsAddCommentsMode(!isAddCommentsMode);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-10 overflow-y-auto">
      <div
        className={`bg-white dark:bg-gray-800 dark:border dark:border-blue-700 rounded-xl shadow-xl w-full max-w-4xl transform transition-all overflow-y-auto ${
          isEditMode ? "h-full" : "h-auto"
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-gray-200">
          {!isEditMode && isCreateMode ? (
            <h2 className="text-xl font-semibold text-gray-800">
              Create New Task
            </h2>
          ) : (
            <div>
              <ul className="flex justify-between space-x-2">
                <li
                  className="mx-2 cursor-pointer"
                  onClick={() => handleEditTaskTab()}>
                  Edit task
                </li>
                <span> | </span>
                <li
                  onClick={() => handleAddComments()}
                  className="mx-2 cursor-pointer">
                  Updates
                </li>
              </ul>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {isEditMode && (
              <div>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
            {isMenuOpen && (
              <DeleteTask
                taskToDelete={taskToEdit.id}
                onClose={onClose}
                onTaskDelete={() =>
                  onTaskUpdate && onTaskUpdate("delete", taskToEdit.id)
                }
              />
            )}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-sm">
              <p>{error}</p>
            </div>
          )}
          {(isCreateMode || isEditMode) && !isAddCommentsMode ? (
            <div className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  Title
                </label>
                <Input
                  type="text"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:border-blue-700 dark:bg-gray-700"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Enter task description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 dark:focus:border-blue-700 focus:ring-primary-500 focus:border-primary-500 resize-none dark:bg-gray-700"
                />
              </div>

              {/* Priority and Effort Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:focus:border-blue-700">
                    <option value="" disabled>
                      Select Priority
                    </option>
                    <option value="1">High Priority (P1)</option>
                    <option value="2">Medium Priority (P2)</option>
                    <option value="3">Low Priority (P3)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                    Story Points
                  </label>
                  <select
                    value={efforts}
                    onChange={(e) => setEfforts(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:text-white dark:focus:border-blue-700">
                    <option value=" " disabled>
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

              {/* Cycle Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  Cycle
                </label>
                <select
                  value={selectedCycle}
                  onChange={(e) => setSelectedCycle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:focus:border-blue-700">
                  <option value="" disabled>
                    Select Cycle
                  </option>
                  {cycles.map((cycle) => (
                    <option key={cycle.id} value={cycle.id}>
                      {cycle.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <CommentBox taskToEdit={taskToEdit} userId={userId} />
          )}
          {/* Footer Actions */}
          <div className="mt-[100px] py-4 rounded-b-xl flex justify-end space-x-3 ">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Cancel
            </button>
            {(isCreateMode || isEditMode) && !isAddCommentsMode && (
              <button
                onClick={handleCreateTask}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading
                  ? "Processing..."
                  : !isEditMode && isCreateMode
                  ? "Create Task"
                  : "Update Task"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
