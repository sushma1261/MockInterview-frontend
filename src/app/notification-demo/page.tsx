"use client";

import { useNotification } from "@/app/utils/NotificationContext";
import { useTheme } from "@/app/utils/ThemeContext";

export default function NotificationDemo() {
  const { theme } = useTheme();
  const { showSuccess, showError, showWarning, showInfo, showNotification } =
    useNotification();

  const bgMain = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const bgCard =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";

  return (
    <div className={`min-h-screen ${bgMain} p-6 transition-colors`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>
            Notification System Demo
          </h1>
          <p className={textSecondary}>
            Test the notification strip with different types and options
          </p>
        </div>

        <div className={`${bgCard} border rounded-xl p-6 space-y-6`}>
          {/* Basic Notifications */}
          <div>
            <h2 className={`text-xl font-semibold ${textPrimary} mb-4`}>
              Basic Notifications
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => showSuccess("Operation completed successfully!")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Success Notification
              </button>
              <button
                onClick={() =>
                  showError("Something went wrong. Please try again.")
                }
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Error Notification
              </button>
              <button
                onClick={() =>
                  showWarning("Warning: This action may have consequences.")
                }
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Warning Notification
              </button>
              <button
                onClick={() =>
                  showInfo("Here's some helpful information for you.")
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Info Notification
              </button>
            </div>
          </div>

          {/* With Action Button */}
          <div>
            <h2 className={`text-xl font-semibold ${textPrimary} mb-4`}>
              With Action Button
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  showNotification({
                    type: "error",
                    message: "Upload failed. Would you like to retry?",
                    action: {
                      label: "Retry",
                      onClick: () => showInfo("Retrying upload..."),
                    },
                  })
                }
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Error with Retry
              </button>
              <button
                onClick={() =>
                  showNotification({
                    type: "success",
                    message: "Profile updated successfully!",
                    action: {
                      label: "View Profile",
                      onClick: () => showInfo("Navigating to profile..."),
                    },
                    autoClose: 0,
                  })
                }
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Success with Action
              </button>
            </div>
          </div>

          {/* Custom Duration */}
          <div>
            <h2 className={`text-xl font-semibold ${textPrimary} mb-4`}>
              Custom Auto-Close Duration
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => showSuccess("Quick message (2s)", 2000)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                2 Seconds
              </button>
              <button
                onClick={() => showInfo("Standard message (5s)", 5000)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                5 Seconds
              </button>
              <button
                onClick={() =>
                  showNotification({
                    type: "warning",
                    message: "This stays until you dismiss it",
                    autoClose: 0,
                  })
                }
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                No Auto-Close
              </button>
            </div>
          </div>

          {/* Real-World Examples */}
          <div>
            <h2 className={`text-xl font-semibold ${textPrimary} mb-4`}>
              Real-World Scenarios
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => showSuccess("Resume uploaded successfully!")}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-left"
              >
                Simulate: Resume Upload Success
              </button>
              <button
                onClick={() =>
                  showError(
                    "Failed to save interview session. Please check your connection."
                  )
                }
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-left"
              >
                Simulate: Save Session Error
              </button>
              <button
                onClick={() =>
                  showWarning(
                    "Your session will expire in 5 minutes. Please save your work."
                  )
                }
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-left"
              >
                Simulate: Session Warning
              </button>
              <button
                onClick={() =>
                  showNotification({
                    type: "info",
                    message: "New feature available: Voice interview mode",
                    action: {
                      label: "Try Now",
                      onClick: () =>
                        showSuccess("Redirecting to voice mode..."),
                    },
                    autoClose: 0,
                  })
                }
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-left"
              >
                Simulate: Feature Announcement
              </button>
            </div>
          </div>
        </div>

        {/* Usage Info */}
        <div className={`${bgCard} border rounded-xl p-6 mt-6`}>
          <h2 className={`text-lg font-semibold ${textPrimary} mb-3`}>
            How to Use in Your Components
          </h2>
          <pre
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-gray-100"
            } p-4 rounded-lg text-xs overflow-x-auto`}
          >
            <code
              className={textPrimary}
            >{`import { useNotification } from "@/app/utils/NotificationContext";

export default function MyComponent() {
  const { showSuccess, showError } = useNotification();

  const handleSave = async () => {
    try {
      await saveData();
      showSuccess("Saved successfully!");
    } catch (error) {
      showError("Failed to save");
    }
  };

  return <button onClick={handleSave}>Save</button>;
}`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
