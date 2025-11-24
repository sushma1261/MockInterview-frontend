"use client";

import { createContext, ReactNode, useContext } from "react";
import { useNotification } from "./NotificationContext";

interface ErrorHandlerContextType {
  handleError: (error: unknown, fallbackMessage?: string) => void;
}

const ErrorHandlerContext = createContext<ErrorHandlerContextType>({
  handleError: () => {},
});

export const useErrorHandler = () => useContext(ErrorHandlerContext);

export function ErrorHandlerProvider({ children }: { children: ReactNode }) {
  const { showError } = useNotification();

  const handleError = (error: unknown, fallbackMessage?: string) => {
    console.error("Error:", error);

    let errorMessage = fallbackMessage || "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String(error.message);
    }

    // Map common error messages to user-friendly ones
    if (errorMessage.includes("Failed to fetch")) {
      errorMessage =
        "Unable to connect to the server. Please check your internet connection.";
    } else if (errorMessage.includes("No auth token")) {
      errorMessage = "Please log in to continue.";
    } else if (
      errorMessage.includes("401") ||
      errorMessage.includes("Unauthorized")
    ) {
      errorMessage = "Your session has expired. Please log in again.";
    } else if (
      errorMessage.includes("403") ||
      errorMessage.includes("Forbidden")
    ) {
      errorMessage = "You don't have permission to perform this action.";
    } else if (
      errorMessage.includes("404") ||
      errorMessage.includes("Not Found")
    ) {
      errorMessage = "The requested resource was not found.";
    } else if (
      errorMessage.includes("500") ||
      errorMessage.includes("Internal Server Error")
    ) {
      errorMessage = "Server error. Please try again later.";
    }

    showError(errorMessage);
  };

  return (
    <ErrorHandlerContext.Provider value={{ handleError }}>
      {children}
    </ErrorHandlerContext.Provider>
  );
}
