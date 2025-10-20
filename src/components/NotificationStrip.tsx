"use client";

import { useNotification } from "@/app/utils/NotificationContext";
import { useTheme } from "@/app/utils/ThemeContext";
import { useEffect, useState } from "react";
import { useSidebar } from "./SidebarLayout";

export default function NotificationStrip() {
  const { theme } = useTheme();
  const { notification, hideNotification } = useNotification();
  const { collapsed } = useSidebar();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [notification]);

  if (!notification || !isVisible) {
    return null;
  }

  const getStyles = () => {
    const baseStyles = "";

    switch (notification.type) {
      case "success":
        return theme === "dark"
          ? `${baseStyles} bg-green-900/30 border-green-500 text-green-200`
          : `${baseStyles} bg-green-50 border-green-500 text-green-800`;
      case "error":
        return theme === "dark"
          ? `${baseStyles} bg-red-900/30 border-red-500 text-red-200`
          : `${baseStyles} bg-red-50 border-red-500 text-red-800`;
      case "warning":
        return theme === "dark"
          ? `${baseStyles} bg-amber-900/30 border-amber-500 text-amber-200`
          : `${baseStyles} bg-amber-50 border-amber-500 text-amber-800`;
      case "info":
        return theme === "dark"
          ? `${baseStyles} bg-blue-900/30 border-blue-500 text-blue-200`
          : `${baseStyles} bg-blue-50 border-blue-500 text-blue-800`;
      default:
        return baseStyles;
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getActionButtonStyles = () => {
    switch (notification.type) {
      case "success":
        return theme === "dark"
          ? "text-green-300 hover:text-green-100 font-medium"
          : "text-green-700 hover:text-green-900 font-medium";
      case "error":
        return theme === "dark"
          ? "text-red-300 hover:text-red-100 font-medium"
          : "text-red-700 hover:text-red-900 font-medium";
      case "warning":
        return theme === "dark"
          ? "text-amber-300 hover:text-amber-100 font-medium"
          : "text-amber-700 hover:text-amber-900 font-medium";
      case "info":
        return theme === "dark"
          ? "text-blue-300 hover:text-blue-100 font-medium"
          : "text-blue-700 hover:text-blue-900 font-medium";
      default:
        return "";
    }
  };

  return (
    <div
      className={`fixed top-16 right-0 z-50 transition-all duration-300 ${
        collapsed ? "left-0 md:left-16" : "left-0 md:left-64"
      } ${getStyles()} px-4 py-1 shadow-lg animate-slideDown`}
      role="alert"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {getIcon()}
          <p className="text-sm font-medium flex-1">{notification.message}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className={`text-sm px-3 py-1 rounded transition-colors ${getActionButtonStyles()}`}
            >
              {notification.action.label}
            </button>
          )}

          {notification.dismissible && (
            <button
              onClick={hideNotification}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              aria-label="Dismiss notification"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
