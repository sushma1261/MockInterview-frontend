/**
 * Notification System Integration Guide
 * =====================================
 *
 * This file shows how to integrate the notification system into your app.
 */

/**
 * STEP 1: Update your root layout.tsx
 * -----------------------------------
 * File: src/app/layout.tsx
 */

import { NotificationProvider } from "@/app/utils/NotificationContext";
import NotificationStrip from "@/components/NotificationStrip";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            {/* Add NotificationProvider wrapper */}
            <NotificationProvider>
              <Sidebar />

              {/* Add NotificationStrip below navbar/sidebar */}
              <div className="flex-1 flex flex-col">
                <NotificationStrip />
                <main className="flex-1">{children}</main>
              </div>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

/**
 * STEP 2: Use notifications anywhere in your app
 * ----------------------------------------------
 */

// Example 1: Basic usage in any component
import { useNotification } from "@/app/utils/NotificationContext";

export default function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  const handleSave = async () => {
    try {
      await saveData();
      showSuccess("Data saved successfully!");
    } catch (error) {
      showError("Failed to save data. Please try again.");
    }
  };

  return <button onClick={handleSave}>Save</button>;
}

// Example 2: With action button
export default function UploadComponent() {
  const { showNotification } = useNotification();

  const handleUploadError = () => {
    showNotification({
      type: "error",
      message: "Upload failed. Would you like to retry?",
      action: {
        label: "Retry",
        onClick: () => {
          // Handle retry logic
        },
      },
      autoClose: 0, // Don't auto-close
    });
  };

  return <button onClick={handleUploadError}>Upload</button>;
}

// Example 3: Custom duration
export default function FormComponent() {
  const { showWarning } = useNotification();

  const handleValidation = () => {
    showWarning("Please fill in all required fields", 3000); // 3 seconds
  };

  return <button onClick={handleValidation}>Submit</button>;
}

/**
 * AVAILABLE METHODS
 * -----------------
 *
 * 1. showSuccess(message, autoClose?) - Green success notification
 * 2. showError(message, autoClose?) - Red error notification
 * 3. showWarning(message, autoClose?) - Amber warning notification
 * 4. showInfo(message, autoClose?) - Blue info notification
 * 5. showNotification(config) - Full control with custom config
 * 6. hideNotification() - Manually hide current notification
 *
 * Config object for showNotification:
 * {
 *   type: "success" | "error" | "warning" | "info",
 *   message: string,
 *   dismissible?: boolean,  // default: true
 *   autoClose?: number,     // milliseconds, no auto-close if not provided
 *   action?: {
 *     label: string,
 *     onClick: () => void
 *   }
 * }
 */

/**
 * MIGRATION FROM ALERTS
 * ---------------------
 *
 * Before:
 * alert("Operation successful!");
 *
 * After:
 * showSuccess("Operation successful!");
 *
 * ---
 *
 * Before:
 * alert("Error: Something went wrong");
 *
 * After:
 * showError("Something went wrong");
 *
 * ---
 *
 * Before:
 * if (confirm("Are you sure?")) {
 *   // do something
 * }
 *
 * After:
 * showWarning("This action cannot be undone", {
 *   action: {
 *     label: "Continue",
 *     onClick: () => {
 *       // do something
 *     }
 *   }
 * });
 */
