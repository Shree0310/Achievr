"use client";
import { useNotifications } from "@/app/contexts/NotificationContext";
import { useState, useEffect } from "react";

const NotificationBell = ({ onUnreadCountChange, onShowNotifications }) => {
  const { notifications } = useNotifications();
  const [unreadCount, setUnreadCount] = useState(1);
  const [notificationsList, setNotificationsList] = useState([]);
  const [notificationDropdown, setNotificationDropdown] = useState(false);

  useEffect(() => {
    const count = notifications.length;
    setUnreadCount(count);
    if (onUnreadCountChange) {
      onUnreadCountChange(count);
    }

    if (onShowNotifications) {
      onShowNotifications(notificationDropdown);
    }
    notifications.map((notification) => {
      console.log(notification);
    });
  });

  return (
    <>
      <div className="top-6 right-0 w-60 max-h-56 bg-gray-400 border border-l-2 border-blue-500">
        {notifications.map((notification) => {
          return (
            <div
              key={notification.id}
              className="text-lg font-semibold border border-b-2 border-black flex">
              {notification.message}
              <button>✔️</button>
              <button>❌</button>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default NotificationBell;
