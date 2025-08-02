"use client";

import { useState, useEffect } from 'react';

const CustomNotification = ({ message, title, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600';
      default:
        return 'bg-blue-500 border-blue-600';
    }
  };

  return (
    <div className={`w-full max-w-sm ${getTypeStyles()} text-white rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-in-out`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {title && (
              <h4 className="text-sm font-semibold mb-1">
                {title}
              </h4>
            )}
            <p className="text-sm opacity-90">
              {message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 text-white hover:text-gray-200 transition-colors"
            aria-label="Close notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomNotification; 