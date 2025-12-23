'use client'

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
  const [showPushNotification, setShowPushNotification] = useState(null);

  // Load push notification functionality only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@/hooks/usePushNotifications').then(({ usePushNotifications }) => {
        // We can't use the hook here, but we can create a wrapper
        setShowPushNotification(() => {
          // This will be called when needed
          console.log('Push notification functionality loaded');
        });
      }).catch(error => {
        console.warn('Push notifications not available:', error);
      });
    }
  }, []);

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

  const markAllAsRead = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { error } = await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("user_id", session.user.id);

        if (error) {
          console.log("error marking all as read", error);
        } else {
          // Update local state to mark all as read
          setNotifications((prev) =>
            prev.map((notification) => ({ ...notification, isRead: true }))
          );
        }
      }
    } catch (error) {
      console.log("error marking all as read", error);
    }
  }, []);

  const addNotification = useCallback(
    (notification) => {
      const id = Date.now() + Math.random();
      const newNotification = {
        id,
        ...notification,
        timestamp: new Date(),
        isRead: false,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Show push notification if tab is hidden and push notification is available
      const isTabHidden = document.hidden || !document.hasFocus();
      if (isTabHidden && showPushNotification) {
        showPushNotification(notification.title || "New Notification", {
          message: notification.message,
          tag: `notification-${id}`,
        });
      }

      return newNotification;
    },
    [showPushNotification]
  );

  const clearAllNotifications = useCallback(async () => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    markAsRead,
    markAllAsRead,
    loading,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
