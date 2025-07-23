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

  // Load existing notifications from database on mount
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", session.user.id)
            .order("event_time", { ascending: false });

          if (error) {
            console.error("Error loading notifications:", error);
          } else {
            // Transform database notifications to match our format
            const transformedNotifications = data.map((notification) => ({
              id: notification.id,
              title: notification.title,
              message: notification.description,
              type: notification.event_type === "task added" ? "info" : "info",
              timestamp: new Date(notification.event_time),
              isRead: notification.is_read || false,
            }));
            setNotifications(transformedNotifications);
          }
        }
      } catch (error) {
        console.error("Error loading notifications:", error);
      } finally {
        setLoading(false);
      }
    };

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

    // Clear from database
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { error } = await supabase
          .from("notifications")
          .delete()
          .eq("user_id", session.user.id);

        if (error) {
          console.error("Error clearing notifications:", error);
        }
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }

    // Clear local state
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
