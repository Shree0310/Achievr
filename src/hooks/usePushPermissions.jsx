import { useCallback, useEffect, useState } from "react";
import { pushManager } from "../utils/pushNotifications";

export const usePushPermissions = () => {
  const [permission, setPermisssion] = useState("default");
  const [isSupported, setIsSupported] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    setIsSupported(pushManager.isNotificationsSupported);
    setPermisssion(pushManager.getCurrentPermissionStatus);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      throw new Error("Push Notifications are not supported in this Browser");
    }

    setIsRequesting(true);
    try {
      const resultPermission = await pushManager.requestPermission();
      setPermisssion(resultPermission);
      return resultPermission;
    } catch (error) {
      console.error("Permission request failed", error);
      throw error;
    } finally {
      setIsRequesting(false);
    }
  }, [isSupported]);

  return {
    permission,
    isSupported,
    isRequesting,
    requestPermission,
    isGranted: permission === "granted",
    isDenied: permission === "denied",
    isDefault: permission === "default",
  };
};
