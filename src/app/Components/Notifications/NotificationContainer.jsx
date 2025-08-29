"use client";

import { useNotifications } from "@/app/contexts/NotificationContext";
import NotificationToast from "./NotificationToast";

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => {

        // return (
        //   <NotificationToast
        //     key={notification.id}
        //     notification={notification}
        //     onRemove={removeNotification}
        //   />
        // );
      })}
    </div>
  );
};

export default NotificationContainer;
