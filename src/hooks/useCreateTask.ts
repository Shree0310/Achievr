"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";
import type { CreateTaskData, Task } from "@/types/task";

// This is our API function that does the actual Supabase call
async function createTask(taskData: CreateTaskData): Promise<Task> {

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
    .single(); // Get single object instead of array

  if (error) {
    throw error; // React Query will catch this
  }

  return data as Task;
}

// This is the hook that components will use
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    // The function that performs the mutation
    mutationFn: createTask,

    // What to do when the mutation succeeds
    onSuccess: (data) => {
      // Invalidate ALL tasks queries (for all users)
      // This automatically refetches any active useTasks() hooks
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      console.log("✅ Task created successfully:", data);
    },

    // What to do when the mutation fails
    onError: (error) => {
      console.error("❌ Failed to create task:", error);
    },
  });
}
