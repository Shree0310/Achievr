class PushNotificationManager {
  constructor() {
    this.permission = "default";
    this.isSupported = "Notification" in window;
  }

  //check if browser supports notifications
  isNotificationsSupported = () => {
    return this.isSupported && "serviceWorker" in navigator;
  };

  //Request permission from user
  requestPermission = async () => {
    if (!this.isNotificationsSupported) {
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
    return Notification.permission;
  };
}

export const pushManager = new PushNotificationManager();
