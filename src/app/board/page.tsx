"use client";

import Board from "../Components/Board/Board";
import Header from "../Components/Header/Header";
import Navbar from "../Components/Navbar/Navbar";
import SubHeader from "../Components/SubHeader/SubHeader";
import Stages from "../Components/Stages/Stages";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import NotificationContainer from "../Components/Notifications/NotificationContainer";

// Define proper types for task data
interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  efforts?: string;
  user_id: string;
  cycle_id?: string;
  created_at: string;
  updated_at?: string;
}

type TaskUpdateHandler = (action: string, data: Task | string) => void;

export default function BoardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [stagesTaskHandler, setStagesTaskHandler] = useState<TaskUpdateHandler | null>(null);

  // Task update handler for global state management
  const handleTaskUpdate = useCallback((action: string, data: Task | string) => {
    // Forward the task update to the Stages component
    if (stagesTaskHandler) {
      stagesTaskHandler(action, data);
    }
  }, [stagesTaskHandler]);

  // Store the Stages task handler function
  const handleStagesTaskHandler = useCallback((handler: TaskUpdateHandler) => {
    setStagesTaskHandler(() => handler);
  }, []);

  useEffect(() => {
    async function getSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        }

        if (data.session?.user) {
          setUser(data.session.user);
        }
      } catch (error) {
        console.error("Unexpected error getting session:", error);
      } finally {
        setLoading(false);
      }
    }

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setUser(session?.user || null);
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden">
      {/* Navbar */}
      <div className="relative w-full md:w-auto md:h-screen">
        <div className="h-auto md:h-full flex-shrink-0">
          <Navbar userId={user?.id} onTaskUpdate={handleTaskUpdate} />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden">
        {/* Fixed header area */}
        <div className="flex-shrink-0">
          {/* Toast Notification */}
          <NotificationContainer />
          <Header user={user} />
          <SubHeader />
          <Board />
        </div>

        {/* Stages component - explicitly take all remaining space */}
        <div className="flex-1 overflow-hidden">
          <Stages onTaskUpdate={handleStagesTaskHandler} />
        </div>
      </div>
    </div>
  );
}
