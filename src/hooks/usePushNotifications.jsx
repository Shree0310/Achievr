import { useCallback } from "react";
import { usePushPermissions } from "./usePushPermissions";

export const usePushNotifications = () => {
  const { permission, isGranted } = usePushPermissions();

  const showPushNotifications = useCallback(async () => {
    if (!isGranted) {
      console.warn("Cannot show push notification: Permission not granted");
      return null;
    }

    const enhancedOptions = {};
    return PushManager.showPushNotifications(title, enhancedOptions);
  }, [isGranted]);

  return {
    showPushNotifications,
    isGranted,
    permission,
  };
};
