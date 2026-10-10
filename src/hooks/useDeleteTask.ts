"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";

// API function to delete a task
async function deleteTask(taskId: string): Promise<void> {
  // First delete all comments associated with the task
  const { error: commentsError } = await supabase
    .from("comments")
    .delete()
    .eq("task_id", taskId);

  if (commentsError) {
    throw commentsError;
  }

  // Then delete the task itself
  const { error: taskError } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (taskError) {
    throw taskError;
  }
}

// Hook to delete a task
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,

    onSuccess: () => {
      // Invalidate tasks queries to refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      console.log("✅ Task deleted successfully");
    },

    onError: (error) => {
      console.error("❌ Failed to delete task:", error);
    },
  });
}
