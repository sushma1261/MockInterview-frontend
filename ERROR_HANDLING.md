# Global Error Handling

## Overview

The app now has a global error handling system that automatically handles common errors and displays user-friendly messages via the notification system.

## Features

1. **Improved `authFetch` function**:
   - Automatically extracts error messages from backend responses
   - Handles network errors with user-friendly messages
   - Converts "Failed to fetch" errors to connection error messages

2. **Global Error Handler Context**:
   - Centralized error handling across the app
   - Automatic mapping of common HTTP errors to user-friendly messages
   - Integration with the notification system

## Usage

### Using the Error Handler Hook

```tsx
import { useErrorHandler } from "@/app/utils/ErrorHandlerContext";

function MyComponent() {
  const { handleError } = useErrorHandler();

  const loadData = async () => {
    try {
      const response = await someApi.getData();
      setData(response);
    } catch (err) {
      // Simple error handling - automatically shows notification
      handleError(err);
    }
  };

  // Or with a custom fallback message
  const loadDataWithFallback = async () => {
    try {
      const response = await someApi.getData();
      setData(response);
    } catch (err) {
      handleError(err, "Failed to load data. Please try again.");
    }
  };
}
```

### Error Message Mapping

The error handler automatically maps common errors:

| Backend Error | User-Friendly Message |
|--------------|----------------------|
| "Failed to fetch" | "Unable to connect to the server. Please check your internet connection." |
| "No auth token" | "Please log in to continue." |
| 401 / Unauthorized | "Your session has expired. Please log in again." |
| 403 / Forbidden | "You don't have permission to perform this action." |
| 404 / Not Found | "The requested resource was not found." |
| 500 / Internal Server Error | "Server error. Please try again later." |

### Backend Error Response Format

The `authFetch` function automatically extracts error messages from these formats:

```json
// Option 1
{ "error": "User not found" }

// Option 2
{ "detail": "Invalid credentials" }

// Option 3
{ "message": "Session expired" }
```

## Examples

### History Page (Before)
```tsx
try {
  const response = await historyApi.getSessions();
  setSessions(response.sessions);
} catch (err) {
  console.error("Error loading sessions:", err);
  const errorMessage =
    err instanceof Error
      ? err.message
      : "Failed to load interview history. Please try again.";
  showError(errorMessage);
}
```

### History Page (After)
```tsx
try {
  const response = await historyApi.getSessions();
  setSessions(response.sessions);
} catch (err) {
  handleError(err, "Failed to load interview history");
}
```

## Benefits

1. **Consistency**: All errors are displayed in the same format
2. **User-Friendly**: Technical errors are converted to readable messages
3. **Less Code**: No need to manually extract error messages
4. **Maintainability**: Change error messages in one place
5. **Network Error Handling**: Automatic detection and handling of connection issues

## Migration Guide

Replace manual error handling:

```tsx
// OLD
import { useNotification } from "@/app/utils/NotificationContext";
const { showError } = useNotification();

try {
  // ... API call
} catch (err) {
  console.error("Error:", err);
  const errorMessage = err instanceof Error ? err.message : "Something went wrong";
  showError(errorMessage);
}

// NEW
import { useErrorHandler } from "@/app/utils/ErrorHandlerContext";
const { handleError } = useErrorHandler();

try {
  // ... API call
} catch (err) {
  handleError(err, "Something went wrong");
}
```

## Provider Hierarchy

The ErrorHandlerProvider is integrated into the root layout:

```
AuthProvider
└─ ThemeProvider
   └─ NotificationProvider
      └─ ErrorHandlerProvider  ← Handles errors globally
         └─ SidebarProvider
            └─ App Content
```

This ensures error handling is available everywhere in the app.
