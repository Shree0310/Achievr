import { useEffect } from "react";
import { useNotifications } from "../app/contexts/NotificationContext";
import { supabase } from "@/utils/supabase/client";

const useNotificationSubscription = (userId) => {
  const { addNotification } = useNotifications();

  useEffect(() => {
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
          //Triggering the notification display
          addNotification({
            type: "info",
            title: payload.new.title,
            description: `A new comment was added on task ${taskName}`,
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, addNotification]);
};

export default useNotificationSubscription;
