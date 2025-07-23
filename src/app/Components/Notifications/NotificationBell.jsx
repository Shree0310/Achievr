"use client";
import { useNotifications } from "@/app/contexts/NotificationContext";
import { useState, useEffect } from "react";

const NotificationBell = ({ onCountChange }) => {
  const { notifications } = useNotifications();
  const [notificationsList, setNotificationsList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);

  useEffect(() => {
    const count = notifications.length;
    setUnreadCount(count);

    if (onCountChange) {
      onCountChange(count);
    }
  });

  return (
    <>
      <div className="fixed top-16 right-6 w-80 max-h-56 bg-white rounded-lg shadow-lg">
        {notifications.map((notification) => {
          return (
            <div
              key={notification.id}
              className="text-sm border border-b-0 border-neutral-300 flex p-2 shadow-sm cursor-pointer">
              {notification.message}
              <button className="mx-2 p-1">✔️</button>
              <button>❌</button>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default NotificationBell;
