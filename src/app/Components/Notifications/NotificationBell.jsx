"use client";
import { useNotifications } from "@/app/contexts/NotificationContext";
import { useState, useEffect } from "react";

const NotificationBell = () => {
  const { notifications, removeNotification, markAsRead, markAllAsRead } =
    useNotifications();
  const [notificationsList, setNotificationsList] = useState([]);

  // Calculate unread count for display in the dropdown header
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (notification) => {
    markAsRead(notification);
  };

  return (
    <div className="absolute top-10 right-0 w-96 max-h-96 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg dark:shadow-neutral-900/30 z-50 overflow-hidden">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">Notifications</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{unreadCount} unread</p>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-neutral-500 dark:text-neutral-400">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-neutral-300 dark:text-neutral-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className={`p-4 border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${
              notification.isRead 
                ? 'bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400' 
                : 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-400 dark:border-l-blue-500'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`text-sm font-medium mb-1 ${
                    notification.isRead ? 'text-neutral-500 dark:text-neutral-400' : 'text-neutral-900 dark:text-white'
                  }`}>
                    {notification.title || "Notification"}
                  </h4>
                  <p className={`text-sm mb-2 ${
                    notification.isRead ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-600 dark:text-neutral-300'
                  }`}>
                    {notification.message || notification.description || "You have a new notification"}
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex space-x-1 ml-2">
                  {!notification.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(notification)}
                      className="p-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                      title="Mark as read"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                  <button
                    className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    onClick={() => removeNotification(notification.id)}>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* {notifications.length > 0 && ( */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
        <button
          className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          onClick={() => markAllAsRead()}>
          Mark all as read
        </button>
      </div>
      {/* )} */}
    </div>
  );
};
export default NotificationBell;
