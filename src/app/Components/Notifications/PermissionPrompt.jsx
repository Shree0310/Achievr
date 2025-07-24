"use client";
import { useState } from "react";
import { usePushPermissions } from "@/hooks/usePushPermissions";

const PermissionPrompt = ({ onPermissionGranted, onDismiss }) => {
  const { requestPermission, isRequesting, isSupported } = usePushPermissions();
  const [isVisible, setIsVisible] = useState(true);

  const handleAllow = async () => {
    try {
      const result = await requestPermission();
      if (result === "granted") {
        onPermissionGranted?.();
        setIsVisible(false);
      }
    } catch (error) {
      console.error("Permission request failed:", error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible || !isSupported) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">
            Enable Push Notifications
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Get notified instantly when new comments are added to your tasks,
            even when the app is closed.
          </p>
          <div className="flex space-x-2 mt-3">
            <button
              onClick={handleAllow}
              disabled={isRequesting}
              className="bg-blue-500 text-white px-3 py-1.5 text-sm rounded hover:bg-blue-600 disabled:opacity-50">
              {isRequesting ? "Requesting..." : "Allow"}
            </button>
            <button
              onClick={handleDismiss}
              className="bg-gray-200 text-gray-700 px-3 py-1.5 text-sm rounded hover:bg-gray-300">
              Not Now
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PermissionPrompt;
