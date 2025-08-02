class PushNotificationManager {
  constructor() {
    this.permission = "default";
    this.isSupported = typeof window !== 'undefined' && "Notification" in window;
  }

  //check if browser supports notifications
  isNotificationsSupported = () => {
    return typeof window !== 'undefined' && 
           typeof navigator !== 'undefined' && 
           this.isSupported && 
           "serviceWorker" in navigator;
  };

  //Request permission from user
  requestPermission = async () => {
    if (!this.isNotificationsSupported()) {
      throw new Error("Push notifications not supported");
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission;
    } catch (error) {
      console.error("Permission request failed", error);
      throw error;
    }
  };

  //Show immediate Notification
  showNotification = (title, options = {}) => {
    if (typeof window === 'undefined') {
      console.warn("Cannot show notification on server side");
      return null;
    }

    if (this.permission != "granted") {
      console.warn("Notification permission not granted");
      return null;
    }

    const defaultOptions = {
      body: "",
      icon: "",
      badge: "",
      tag: "task-notification",
      requireInteraction: false,
      silent: false,
      timeStamp: Date.now(),
      ...options,
    };

    const notification = new Notification(title, defaultOptions);

    //Auto-close after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);

    return notification;
  };

  //check current permission status
  getCurrentPermissionStatus = () => {
    if (typeof window === 'undefined') {
      return "default";
    }
    return Notification.permission;
  };
}

// Create a function to get the push manager instance
let pushManagerInstance = null;

const getPushManager = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (!pushManagerInstance) {
    pushManagerInstance = new PushNotificationManager();
  }
  
  return pushManagerInstance;
};

// Export both the function and a direct reference
export const pushManager = getPushManager();
export { getPushManager };
