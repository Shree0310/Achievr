"use client";
import { useEffect, useState } from "react";
import { usePushPermissions } from "@/hooks/usePushPermissions";
import PermissionPrompt from "./PermissionPrompt";

const PushNotificationManager = () => {
  const { permission, isSupported } = usePushPermissions();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Show permission prompt after user has been active for 30 seconds
    // and if permission is still default
    if (isSupported && permission === "default") {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 30000); // 30 seconds delay

      return () => clearTimeout(timer);
    }
  }, [permission, isSupported]);

  // Handle notification clicks (when notification is clicked)
  useEffect(() => {
    const handleNotificationClick = (event) => {
      event.notification.close();

      // Get data from notification
      const data = event.notification.data;

      if (data?.taskId) {
        // Navigate to task
        window.focus();
        // Add your navigation logic here:
        // router.push(`/tasks/${data.taskId}`);
      }
    };

    // Listen for notification clicks
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener(
        "message",
        handleNotificationClick
      );
      return () => {
        navigator.serviceWorker.removeEventListener(
          "message",
          handleNotificationClick
        );
      };
    }
  }, []);

  return (
    <>
      {showPrompt && (
        <PermissionPrompt
          onPermissionGranted={() => setShowPrompt(false)}
          onDismiss={() => setShowPrompt(false)}
        />
      )}
    </>
  );
};

export default PushNotificationManager;
