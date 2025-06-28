"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import DeleteTask from "../DeleteTask/DeleteTask";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CreateTask = ({
  onClose,
  userId,
  isEditMode = false,
  taskToEdit,
  onTaskUpdate,
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

  useEffect(() => {
    if (isEditMode && taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority?.toString() || "");
      setEfforts(taskToEdit.efforts?.toString() || "");
      setSelectedCycle(taskToEdit.cycle_id || "");
    }

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

    fetchCycles();
  }, [isEditMode, taskToEdit]);

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

        // Call the callback to update parent state
        if (onTaskUpdate && data && data.length > 0) {
          onTaskUpdate("create", data[0]);
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-10">
      <div
        className={`bg-white rounded-xl shadow-xl w-full max-w-2xl transform transition-all ${
          isEditMode ? "h-full" : "h-auto"
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          {!isEditMode ? (
            <h2 className="text-xl font-semibold text-gray-800">
              Create New Task
            </h2>
          ) : (
            <div>
              <ul className="flex justify-between space-x-2">
                <li className="mx-2">Edit task</li>
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
          {isEditMode && !isAddCommentsMode ? (
            <div className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <Input
                  type="text"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Enter task description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              </div>

              {/* Priority and Effort Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                    <option value="" disabled>
                      Select Priority
                    </option>
                    <option value="1">High Priority (P1)</option>
                    <option value="2">Medium Priority (P2)</option>
                    <option value="3">Low Priority (P3)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Story Points
                  </label>
                  <select
                    value={efforts}
                    onChange={(e) => setEfforts(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cycle
                </label>
                <select
                  value={selectedCycle}
                  onChange={(e) => setSelectedCycle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
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
              {/* Footer Actions */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Cancel
                </button>
                <button
                  onClick={handleCreateTask}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading
                    ? "Processing..."
                    : isEditMode
                    ? "Update Task"
                    : "Create Task"}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-2 m-2 w-full ">
              <div className="bg-gray-100 overflow-hidden rounded-md shadow-md">
                <textarea
                  type="text"
                  placeholder="write an update and start with @ to mention others"
                  className="w-full h-14 p-4 text-gray-600 bg-gray-100 border-none outline-none resize-none"
                />
                <div className="flex justify-between space-x-24 p-2">
                  {/* Footer   */}
                  <div className="flex items-center space-x-2 text-xs text-gray-500 px-2 bg-gray-100">
                    {/* Mention button */}
                    <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                      <span>@ Mention</span>
                    </button>

                    {/* Attach button */}
                    <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none">
                        <path
                          d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Attach</span>
                    </button>
                  </div>
                  {/* Update button */}
                  <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
