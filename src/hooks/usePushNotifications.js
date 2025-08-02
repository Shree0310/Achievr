import { useState, useEffect, useCallback } from 'react';

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [registration, setRegistration] = useState(null);

  // Check if push notifications are supported
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
    }
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      setRegistration(reg);
      console.log('Service Worker registered:', reg);
      return reg;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async () => {
    try {
      if (!registration) {
        await registerServiceWorker();
      }

      const hasPermission = await requestPermission();
      if (!hasPermission) {
        throw new Error('Notification permission denied');
      }

      // Get push subscription
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      setSubscription(sub);
      setIsSubscribed(true);
      console.log('Push subscription:', sub);

      // Send subscription to your server
      await sendSubscriptionToServer(sub);

      return sub;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    }
  }, [registration, registerServiceWorker, requestPermission]);

  // Unsubscribe from push notifications
  const unsubscribeFromPush = useCallback(async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
        setIsSubscribed(false);
        console.log('Unsubscribed from push notifications');
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
    }
  }, [subscription]);

  // Send subscription to server
  const sendSubscriptionToServer = async (sub) => {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: sub,
          userId: 'current-user-id' // Replace with actual user ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send subscription to server');
      }

      console.log('Subscription sent to server successfully');
    } catch (error) {
      console.error('Error sending subscription to server:', error);
    }
  };

  // Test push notification
  const testPushNotification = useCallback(async () => {
    try {
      const response = await fetch('/api/push/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription,
          title: 'Test Notification',
          message: 'This is a test push notification!',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send test notification');
      }

      console.log('Test notification sent successfully');
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  }, [subscription]);

  return {
    isSupported,
    isSubscribed,
    subscription,
    registration,
    subscribeToPush,
    unsubscribeFromPush,
    testPushNotification,
    requestPermission,
  };
}; 