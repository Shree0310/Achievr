"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { supabase } from "@/utils/supabase/client";

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
  const [loading, setLoading] = useState(true);

  // Load existing notifications from database
  const loadNotifications = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        //Add into database
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", session.user.id)
          .order("event_time", { ascending: false });

        if (error) {
          console.log("error while fetching notifications", error);
        } else {
          const transformNotifications = data.map((notification) => ({
            id: notification.id,
            type: "info",
            message: notification.description,
            title: notification.title,
            timestamp: notification.event_time,
            isRead: notification.is_read,
          }));
          //Add into local state
          setNotifications(transformNotifications);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  const removeNotification = useCallback(async (id) => {
    console.log("NotificationContext - removing notification:", id);

    // Remove from database
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting notification:", error);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }

    // Remove from local state
    setNotifications((prev) => prev.filter((notif) => notif.id != id));
  }, []);

  const markAsRead = useCallback(async (notification) => {
    console.log("marked as read", notification.isRead);

    // Update in database
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notification.id);

      if (error) {
        console.error("Error marking notification as read:", error);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }

    // Update local state
    notification.isRead = true;
    setNotifications((prev) => [...prev]); // Trigger re-render
  }, []);

  const addNotification = useCallback(
    (notification) => {
      console.log(
        "NotificationContext - addNotification called with:",
        notification
      );
      const id = Date.now() + Math.random();
      const newNotification = {
        id,
        ...notification,
        timestamp: new Date(),
        isRead: false,
      };
      console.log(
        "NotificationContext - created new notification:",
        newNotification
      );
      setNotifications((prev) => {
        const updated = [...prev, newNotification];
        console.log(
          "NotificationContext - updated notifications array:",
          updated
        );
        return updated;
      });

      // setTimeout(() => {
      //   console.log("NotificationContext - auto-removing notification:", id);
      //   removeNotification(id);
      // }, 10000);
    },
    [removeNotification, markAsRead]
  );

  const clearAllNotifications = useCallback(async () => {
    console.log("NotificationContext - clearing all notifications");
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    markAsRead,
    loading,
  };

  console.log("NotificationContext - current notifications:", notifications);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
