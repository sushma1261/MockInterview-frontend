"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  dismissible?: boolean;
  autoClose?: number; // milliseconds
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notification: Notification | null;
  showNotification: (notification: Omit<Notification, "id">) => void;
  hideNotification: () => void;
  showSuccess: (message: string, autoClose?: number) => void;
  showError: (message: string, autoClose?: number) => void;
  showWarning: (message: string, autoClose?: number) => void;
  showInfo: (message: string, autoClose?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notification, setNotification] = useState<Notification | null>(null);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const showNotification = useCallback((notif: Omit<Notification, "id">) => {
    const id = `notification-${Date.now()}`;
    const newNotification: Notification = {
      id,
      dismissible: true,
      ...notif,
    };

    setNotification(newNotification);

    // Auto close if specified
    if (newNotification.autoClose) {
      setTimeout(() => {
        setNotification((current) => (current?.id === id ? null : current));
      }, newNotification.autoClose);
    }
  }, []);

  // Convenience methods
  const showSuccess = useCallback(
    (message: string, autoClose = 5000) => {
      showNotification({
        type: "success",
        message,
        autoClose,
      });
    },
    [showNotification]
  );

  const showError = useCallback(
    (message: string, autoClose?: number) => {
      showNotification({
        type: "error",
        message,
        autoClose,
      });
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string, autoClose = 5000) => {
      showNotification({
        type: "warning",
        message,
        autoClose,
      });
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string, autoClose = 5000) => {
      showNotification({
        type: "info",
        message,
        autoClose,
      });
    },
    [showNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        notification,
        showNotification,
        hideNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
