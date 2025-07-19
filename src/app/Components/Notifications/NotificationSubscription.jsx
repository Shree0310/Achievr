"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useNotifications } from "@/app/contexts/NotificationContext";

const NotificationSubscription = () => {
  const [userId, setUserId] = useState(null);
  const { addNotification } = useNotifications();

  console.log("NotificationSubscription - userId:", userId);

  // Test function to manually trigger notification
  const testNotification = () => {
    console.log("NotificationSubscription - Testing manual notification");
    addNotification({
      type: "info",
      title: "Test Notification",
      message: "This is a test notification",
    });
  };

  // Add test button to the page
  useEffect(() => {
    const testButton = document.createElement("button");
    testButton.textContent = "Test Notification";
    testButton.style.cssText =
      "position: fixed; top: 10px; left: 10px; z-index: 9999; padding: 10px; background: red; color: white;";
    testButton.onclick = testNotification;
    document.body.appendChild(testButton);

    return () => {
      document.body.removeChild(testButton);
    };
  }, [addNotification]);

  // Get current user (for future use if needed)
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id);
        console.log("NotificationSubscription - set userId:", session.user.id);
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
