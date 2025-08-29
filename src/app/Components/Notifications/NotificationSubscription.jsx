"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useNotifications } from "@/app/contexts/NotificationContext";

const NotificationSubscription = () => {
  const [userId, setUserId] = useState(null);
  const { addNotification } = useNotifications();

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id);
      }
    };

    getCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Set up real-time subscription for notifications
  useEffect(() => {
    if (!userId) return;

    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          
          // Trigger the notification display
          addNotification({
            type: "info",
            title: payload.new.title || "New Notification",
            message: payload.new.description || "You have a new notification",
          });
        }
      )
      .subscribe((status) => {
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, addNotification]);

  return null;
};

export default NotificationSubscription;
