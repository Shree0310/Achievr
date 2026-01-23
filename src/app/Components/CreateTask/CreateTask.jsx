"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import DeleteTask from "../DeleteTask/DeleteTask";
import CommentBox from "../Comments/CommentBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/app/contexts/NotificationContext";
import SubtasksTab from "@/app/Components/Subtasks/SubtasksTab";
import GithubTab from "@/app/Components/GithubUI/GithubTab";

const CreateTask = ({
  onClose,
  userId,
  isEditMode = false,
  taskToEdit,
  onTaskUpdate,
  isCreateMode = true,
  commentCount,
  subTasksCount,
  subTasks
}) => {
  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [status, setStatus] = useState(taskToEdit?.status || "");
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
  const [isSubtasksMode, setIsSubtasksMode] = useState(false);
  const [createSubtaskMode,setCreateSubtaskMode] = useState(false);
  const [isGithubMode, setIsGithubMode] = useState(false);

  useEffect(() => {
    if (isEditMode && taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setStatus(taskToEdit.status || "");
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
        .select("id, created_at, user_id, status, cycle_id, title, description")
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
              status: status === null ? "" : status,
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
      setStatus("");
      setDescription("");
      setPriority("");
      setEfforts("");
      setError(null);
    }
  };

  const handleAddComments = () => {
    setIsAddCommentsMode(!isAddCommentsMode);
    // Reset subtasks mode when entering comments mode
    if (!isAddCommentsMode) {
      setIsSubtasksMode(false);
    }
  };

  const handleEditTaskTab = () => {
    // Reset all other modes when entering edit task mode
    setIsAddCommentsMode(false);
    setIsSubtasksMode(false);
    setIsGithubMode(false);
  };

  const handleSubtasksTab = () => {
    setIsSubtasksMode(!isSubtasksMode);
    // Reset other modes when entering subtasks mode
    if (!isSubtasksMode) {
      setIsAddCommentsMode(false);
    }
  };

  const handleGithubTab = () => {
    setIsGithubMode(!isGithubMode);
    if(!isGithubMode){
      setIsSubtasksMode(false);
    }
  }

  const createSubtask = () => {
    setCreateSubtaskMode(true);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-10 overflow-y-auto">
      <div
        className={`bg-white dark:bg-neutral-800 no-scrollbar dark:border  dark:border-blue-700 rounded-xl shadow-xl w-full max-w-4xl transform transition-all overflow-y-auto ${
          isEditMode ? "h-auto" : "h-auto"
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-1 border-b border-neutral-200 dark:border-neutral-700">
          {!isEditMode && isCreateMode ? (
            <h2 className="text-xl font-normal py-1 text-neutral-800 dark:text-white">
              Create New Task
            </h2>
          ) : (
            <div>
              <ul className="flex justify-between space-x-2">
                <li
                  className="mx-2 cursor-pointer text-neutral-800 dark:text-neutral-400"
                  onClick={() => handleEditTaskTab()}>
                  Edit task
                </li>
                <span className="text-neutral-800 dark:text-white"> | </span>
                <li
                  onClick={() => handleAddComments()}
                  className="mx-2 cursor-pointer text-neutral-800 dark:text-neutral-400">
                  Updates 
                  <span className="px-2">({commentCount})</span>
                </li>
                <span className="text-neutral-800 dark:text-white"> | </span>
                <li
                  onClick={() => handleSubtasksTab()}
                  className="mx-2 cursor-pointer text-neutral-800 dark:text-neutral-400">
                    Subtasks 
                    <span className="px-2">({subTasksCount})</span>
                </li>
                <span className="text-neutral-800 dark:text-white"> | </span>
                <li
                  onClick={() => handleGithubTab()}
                  className="mx-2 cursor-pointer text-neutral-800 dark:text-neutral-400">
                  GITHUB
                </li>
              </ul>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {isEditMode && (
              <div>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors">
                  <svg
                    className="w-5 h-5 text-neutral-500 dark:text-white"
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
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors">
                  <svg
                    className="w-5 h-5 text-neutral-500 dark:text-white"
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
          {(isCreateMode || isEditMode) && !isAddCommentsMode && !isSubtasksMode && !isGithubMode ? (
            <div className="space-y-4">
              {/* Title Input */}
              <div>
                <Input
                  type="text"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2 py-4 placeholder:text-xl border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {/* Description Input */}
              <div>
                <textarea
                  placeholder="Enter task description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-2 py-2 border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-white dark:bg-neutral-800"
                />
              </div>
            <div className="flex flex-row gap-3">
              {/* Status Change */}
                <div>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-30 px-4 py-2 bg-white dark:bg-neutral-700 rounded-md appearance-none ">
                    <option value="" disabled>
                       Status
                    </option>
                    <option value="Not started">Not started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                {/* Priority and Effort Selection */}
                <div>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-30 px-2 py-2 bg-white dark:bg-neutral-700 rounded-md appearance-none">                    
                    <option value="" disabled>
                      Select Priority
                    </option>
                    <option value="1">High Priority (P1)</option>
                    <option value="2">Medium Priority (P2)</option>
                    <option value="3">Low Priority (P3)</option>
                  </select>
                </div>

                <div>
                  <select
                    value={efforts}
                    onChange={(e) => setEfforts(e.target.value)}
                    className="w-24 px-4 py-2 bg-white dark:bg-neutral-700 rounded-md appearance-none">                    
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

                {/* Cycle Selection */}
              <div>
                <select
                  value={selectedCycle}
                  onChange={(e) => setSelectedCycle(e.target.value)}
                    className="w-32 px-4 py-2 bg-white dark:bg-neutral-700 rounded-md appearance-none ">                    
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
            </div>
          ) : isSubtasksMode ? (
            <SubtasksTab 
                subTasks={subTasks} 
                taskToEdit={taskToEdit} 
                userId={userId} 
                createSubtaskMode={createSubtaskMode}
                onSubtaskCreated={() => {
                    // Refresh subtasks by reloading the page
                    window.location.reload();
                }}
                onToggleCreateMode={(value) => setCreateSubtaskMode(value)}
            />
          ) : isGithubMode ? (
            <GithubTab taskToEdit={taskToEdit} userId={userId}/>
          ):(
            <CommentBox taskToEdit={taskToEdit} userId={userId} />
          )}
          {/* Footer Actions */}
          <div className="mt-[100px] rounded-b-xl flex justify-end space-x-3 ">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Cancel
            </button>
            {(isCreateMode || isEditMode) && !isAddCommentsMode && !isSubtasksMode && !isGithubMode &&
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
            }
            { isSubtasksMode &&
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={createSubtask}>
                Create Subtask
              </button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
