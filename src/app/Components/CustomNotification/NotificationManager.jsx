"use client";

import { useState, useCallback } from 'react';
import CustomNotification from './CustomNotification';

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      ...notification,
      timestamp: Date.now(),
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showNotification = useCallback((title, message, type = 'info', duration = 5000) => {
    return addNotification({
      title,
      message,
      type,
      duration,
    });
  }, [addNotification]);

  // Expose the showNotification function globally
  if (typeof window !== 'undefined') {
    window.showCustomNotification = showNotification;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <CustomNotification
            title={notification.title}
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationManager; 