"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useNotifications } from "@/app/contexts/NotificationContext";

const NotificationSubscription = () => {
  const [userId, setUserId] = useState(null);
  const { addNotification } = useNotifications();

  useEffect(() => {}, [addNotification]);

  // Get current user (for future use if needed)
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

  return null;
};

export default NotificationSubscription;
