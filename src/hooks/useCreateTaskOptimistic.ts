"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";
import type { CreateTaskData, Task } from "@/types/task";

// API function (same as before)
async function createTask(taskData: CreateTaskData): Promise<Task> {
  // 🐌 DEMO: Add artificial delay to see optimistic update in action
  // Remove this in production!
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

  // 💥 DEMO: Uncomment to test rollback on error
  // throw new Error("Simulated network error!");

  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        efforts: taskData.efforts,
        status: taskData.status || "not started",
        user_id: taskData.user_id,
        cycle_id: taskData.cycle_id,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Task;
}

// Hook with OPTIMISTIC UPDATES! 🚀
export function useCreateTaskOptimistic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,

    // 🎯 THIS IS THE MAGIC - Runs BEFORE the API call
    onMutate: async (newTaskData: CreateTaskData) => {
      // 1. Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // 2. Snapshot the previous value (for rollback if needed)
      const previousTasks = queryClient.getQueryData(["tasks", newTaskData.user_id]);

      // 3. Optimistically update the cache with the new task
      queryClient.setQueryData(["tasks", newTaskData.user_id], (old: Task[] | undefined) => {
        // Create a temporary task with fake ID
        const optimisticTask: Task = {
          id: `temp-${Date.now()}`, // Temporary ID
          title: newTaskData.title,
          description: newTaskData.description || "",
          status: newTaskData.status || "not started",
          priority: newTaskData.priority || "",
          efforts: newTaskData.efforts || "",
          user_id: newTaskData.user_id,
          cycle_id: newTaskData.cycle_id || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Add the optimistic task to the beginning of the list
        return [optimisticTask, ...(old || [])];
      });

      console.log("⚡ Optimistic update: Task added to UI instantly!");

      // 4. Return context object with the snapshot
      return { previousTasks };
    },

    // ✅ If mutation succeeds - replace temporary task with real one
    onSuccess: (data, variables) => {
      // Replace the temporary task with the real one from server
      queryClient.setQueryData(["tasks", variables.user_id], (old: Task[] | undefined) => {
        if (!old) return [data];

        // Find and replace the temp task with the real one
        return old.map((task) =>
          task.id.startsWith("temp-") ? data : task
        );
      });

      console.log("✅ Server confirmed! Replaced temp task with real one:", data);
    },

    // ❌ If mutation fails - rollback to previous state
    onError: (error, variables, context) => {
      // Restore the previous state
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", variables.user_id], context.previousTasks);
      }

      console.error("❌ Failed! Rolled back optimistic update:", error);
    },

    // 🔄 Always refetch after mutation settles (success or error)
    onSettled: (data, error, variables) => {
      // Refetch to ensure we have the latest data from server
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.user_id] });
    },
  });
}
