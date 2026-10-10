"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";
import type { Task } from "@/types/task";

// API function to fetch tasks for a user
async function fetchTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return data || [];
}

// Hook to fetch tasks with React Query
export function useTasks(userId: string) {
  return useQuery({
    // Query key - uniquely identifies this query
    // When userId changes, React Query treats it as a different query
    queryKey: ["tasks", userId],

    // The function to fetch data
    queryFn: () => fetchTasks(userId),

    // Only run the query if we have a userId
    enabled: !!userId,

    // How long data stays "fresh" before refetching (5 minutes)
    staleTime: 5 * 60 * 1000,

    // Refetch when window regains focus (user comes back to tab)
    refetchOnWindowFocus: true,

    // Refetch when reconnecting after losing internet
    refetchOnReconnect: true,
  });
}
