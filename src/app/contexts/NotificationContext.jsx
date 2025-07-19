"use client";

import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    console.log("NotificationContext - removing notification:", id);
    setNotifications((prev) => prev.filter((notif) => notif.id != id));
  }, []);

  const addNotification = useCallback((notification) => {
    console.log("NotificationContext - addNotification called with:", notification);
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date(),
    };
    console.log("NotificationContext - created new notification:", newNotification);
    setNotifications((prev) => {
      const updated = [...prev, newNotification];
      console.log("NotificationContext - updated notifications array:", updated);
      return updated;
    });

    setTimeout(() => {
      console.log("NotificationContext - auto-removing notification:", id);
      removeNotification(id);
    }, 5000);
  }, [removeNotification]);

  const clearAllNotifications = useCallback(() => {
    console.log("NotificationContext - clearing all notifications");
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };

  console.log("NotificationContext - current notifications:", notifications);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
