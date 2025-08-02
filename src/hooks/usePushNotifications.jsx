import { useCallback } from "react";
import { usePushPermissions } from "./usePushPermissions";
import { pushManager } from "../utils/pushNotifications";

export const usePushNotifications = () => {
  const { permission, isGranted } = usePushPermissions();

  const showPushNotifications = useCallback(async (title, options = {}) => {
    if (!isGranted || !pushManager) {
      console.warn("Cannot show push notification: Permission not granted or push manager not available");
      return null;
    }

    return pushManager.showNotification(title, options);
  }, [isGranted]);

  return {
    showPushNotifications,
    isGranted,
    permission,
  };
};
