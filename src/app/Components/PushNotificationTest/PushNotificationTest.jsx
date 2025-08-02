"use client";

import { useState, useEffect } from 'react';
import { getPushManager } from '@/utils/pushNotifications';

const PushNotificationTest = () => {
  const [status, setStatus] = useState('Not tested');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [pushManager, setPushManager] = useState(null);

  // Get push manager instance on mount
  useEffect(() => {
    const manager = getPushManager();
    setPushManager(manager);
    
    const info = {
      pushManagerExists: !!manager,
      windowExists: typeof window !== 'undefined',
      notificationExists: typeof window !== 'undefined' && 'Notification' in window,
      serviceWorkerExists: typeof window !== 'undefined' && 'serviceWorker' in navigator,
    };
    
    setDebugInfo(JSON.stringify(info, null, 2));
    console.log('Push Manager Debug Info:', info);
  }, []);

  const testNotification = async () => {
    setIsLoading(true);
    setStatus('Testing...');
    console.log('Test notification started');

    try {
      // Get fresh push manager instance
      const manager = getPushManager();
      
      // Check if pushManager exists
      if (!manager) {
        setStatus('Push manager not available');
        console.error('Push manager is null or undefined');
        return;
      }

      console.log('Push manager exists:', manager);

      // Check if notifications are supported
      const isSupported = manager.isNotificationsSupported();
      console.log('Notifications supported:', isSupported);
      
      if (!isSupported) {
        setStatus('Push notifications not supported');
        console.error('Notifications not supported');
        return;
      }

      // Request permission
      console.log('Requesting permission...');
      const permission = await manager.requestPermission();
      console.log('Permission result:', permission);
      
      if (permission === 'granted') {
        // Show a test notification
        console.log('Showing notification...');
        const notification = manager.showNotification('Test Notification', {
          body: 'This is a test push notification from your local app!',
          icon: '/favicon.ico',
          tag: 'test-notification',
          requireInteraction: true,
        });
        
        console.log('Notification created:', notification);
        setStatus('Notification sent! Check your browser notifications.');
      } else {
        setStatus(`Permission denied: ${permission}`);
        console.error('Permission denied:', permission);
      }
    } catch (error) {
      console.error('Test notification error:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPermission = () => {
    console.log('Checking permission...');
    const manager = getPushManager();
    if (manager) {
      const permission = manager.getCurrentPermissionStatus();
      console.log('Current permission:', permission);
      setStatus(`Current permission: ${permission}`);
    } else {
      console.error('Push manager not available');
      setStatus('Push manager not available');
    }
  };

  const testSimpleNotification = () => {
    console.log('Testing simple notification...');
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Simple Test', {
          body: 'This is a simple test notification',
        });
        setStatus('Simple notification sent!');
      } else {
        setStatus('Permission not granted for simple notification');
      }
    } else {
      setStatus('Notifications not supported in browser');
    }
  };

  const testDirectNotification = () => {
    console.log('Testing direct notification...');
    // Test if we can directly call the notification function
    if (typeof window !== 'undefined' && window.showCustomNotification) {
      console.log('showCustomNotification function exists');
      try {
        window.showCustomNotification(
          'Direct Test',
          'This is a direct test notification!',
          'success',
          5000
        );
        setStatus('Direct notification sent! Check bottom-right corner.');
      } catch (error) {
        console.error('Error calling showCustomNotification:', error);
        setStatus(`Error: ${error.message}`);
      }
    } else {
      console.log('showCustomNotification function not found');
      setStatus('Custom notification system not available');
    }
  };

  const testCustomNotification = () => {
    console.log('Testing custom notification...');
    if (typeof window !== 'undefined' && window.showCustomNotification) {
      window.showCustomNotification(
        'Custom Test Notification',
        'This is a custom notification that appears on the page!',
        'success',
        5000
      );
      setStatus('Custom notification sent! Look at the bottom-right corner.');
    } else {
      setStatus('Custom notification system not available');
    }
  };

  const testMultipleNotifications = () => {
    console.log('Testing multiple notifications...');
    if (typeof window !== 'undefined' && window.showCustomNotification) {
      // Show different types of notifications
      window.showCustomNotification('Success', 'Task completed successfully!', 'success', 3000);
      setTimeout(() => {
        window.showCustomNotification('Info', 'New message received', 'info', 3000);
      }, 500);
      setTimeout(() => {
        window.showCustomNotification('Warning', 'Please check your settings', 'warning', 3000);
      }, 1000);
      setTimeout(() => {
        window.showCustomNotification('Error', 'Something went wrong', 'error', 3000);
      }, 1500);
      
      setStatus('Multiple notifications sent! Check bottom-right corner.');
    } else {
      setStatus('Custom notification system not available');
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm max-w-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Push Notification Test
      </h3>
      
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          <p><strong>Status:</strong> {status}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={checkPermission}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Check Permission
          </button>
          
          <button
            onClick={testNotification}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Send Test Notification'}
          </button>

          <button
            onClick={testSimpleNotification}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            Simple Test
          </button>

          <button
            onClick={testDirectNotification}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
          >
            Direct Test
          </button>

          <button
            onClick={testCustomNotification}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            Custom Test
          </button>

          <button
            onClick={testMultipleNotifications}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 disabled:opacity-50"
          >
            Multiple Test
          </button>
        </div>

        <details className="text-xs">
          <summary className="cursor-pointer text-gray-500">Debug Info</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
            {debugInfo}
          </pre>
        </details>

        <div className="text-xs text-gray-500 mt-4">
          <p><strong>Instructions:</strong></p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Click "Check Permission" to see current status</li>
            <li>Click "Send Test Notification" to test browser notifications</li>
            <li>Click "Simple Test" to test basic browser notifications</li>
            <li>Click "Custom Test" to test on-page notifications (bottom-right)</li>
            <li>Click "Multiple Test" to test multiple notification types</li>
            <li>Check browser console for detailed logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PushNotificationTest; 