"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";
import type { UpdateTaskData, Task } from "@/types/task";

// API function to update a task
async function updateTask(taskData: UpdateTaskData): Promise<Task> {
  const { id, ...updates } = taskData;

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Task;
}

// Hook to update a task
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,

    onSuccess: (data) => {
      // Invalidate tasks queries to refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      console.log("✅ Task updated successfully:", data);
    },

    onError: (error) => {
      console.error("❌ Failed to update task:", error);
    },
  });
}
