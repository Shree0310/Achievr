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
    <div className="absolute top-10 right-0 w-96 max-h-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
        <p className="text-sm text-gray-600">{unreadCount} unread</p>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-300"
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
            <div key={notification.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              notification.isRead 
                ? 'bg-gray-50 text-gray-500' 
                : 'bg-blue-50 border-l-4 border-l-blue-400'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`text-sm font-medium mb-1 ${
                    notification.isRead ? 'text-gray-500' : 'text-gray-900'
                  }`}>
                    {notification.title || "Notification"}
                  </h4>
                  <p className={`text-sm mb-2 ${
                    notification.isRead ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {notification.message || notification.description || "You have a new notification"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex space-x-1 ml-2">
                  {!notification.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(notification)}
                      className="p-1 text-green-600 hover:text-green-700 transition-colors"
                      title="Mark as read"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                  <button
                    className="p-1 text-red-600 hover:text-red-700 transition-colors"
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
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <button
          className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
          onClick={() => markAllAsRead()}>
          Mark all as read
        </button>
      </div>
      {/* )} */}
    </div>
  );
};
export default NotificationBell;
