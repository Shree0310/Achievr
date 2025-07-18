import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useNotifications } from "../app/contexts/NotificationContext";

const NotificationSubscription = () => {
  const [userId, setUserId] = useState(null);
  const { addNotification } = useNotifications();
  useEffect(() => {
    //Get current user
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
            message:
              payload.new.description ||
              `A new comment was added on task "${
                payload.new.task_title || "Unknown tasks"
              }"`,
          });
        }
      )
      .subscribe();
  }, [userId, addNotification]);

  return null;
};

export default NotificationSubscription;
