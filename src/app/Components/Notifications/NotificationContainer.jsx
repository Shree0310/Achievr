"use client";

import { useNotifications } from "@/app/contexts/NotificationContext";
import NotificationToast from "./NotificationToast";

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  console.log("NotificationContainer - notifications array:", notifications);
  console.log("NotificationContainer - notifications length:", notifications.length);

  if (notifications.length === 0) {
    console.log("NotificationContainer - no notifications, returning null");
    return null;
  }

  console.log("NotificationContainer - rendering notifications:", notifications);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => {
        console.log("NotificationContainer - rendering notification:", notification);
        return (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        );
      })}
    </div>
  );
};

export default NotificationContainer;
