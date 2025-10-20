/**
 * Example: How to use Notification System with API calls
 *
 * This file demonstrates various patterns for showing notifications
 * when API calls succeed or fail.
 */

import { useNotification } from "@/app/utils/NotificationContext";
import { profileApi, resumeApi } from "@/lib/api";

// ==================== Pattern 1: Basic Try-Catch ====================
export function useProfileWithNotifications() {
  const { showSuccess, showError } = useNotification();

  const updateProfile = async (data: {
    display_name?: string;
    photo_url?: string;
  }) => {
    try {
      const profile = await profileApi.updateProfile(data);
      showSuccess("Profile updated successfully!");
      return profile;
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Failed to update profile"
      );
      throw error;
    }
  };

  return { updateProfile };
}

// ==================== Pattern 2: With Loading State ====================
export function useResumeWithNotifications() {
  const { showSuccess, showError, showInfo } = useNotification();

  const deleteResume = async (id: number) => {
    try {
      showInfo("Deleting resume...");
      await resumeApi.deleteResume(id);
      showSuccess("Resume deleted successfully!");
      return true;
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Failed to delete resume"
      );
      return false;
    }
  };

  const setPrimaryResume = async (id: number) => {
    try {
      const resume = await resumeApi.setPrimaryResume(id);
      showSuccess(`${resume.title} is now your primary resume!`);
      return resume;
    } catch (error) {
      showError("Failed to set primary resume. Please try again.");
      throw error;
    }
  };

  return { deleteResume, setPrimaryResume };
}

// ==================== Pattern 3: With Action Button ====================
export function useResumeWithRetry() {
  const { showNotification } = useNotification();

  const uploadResume = async (file: File, retryCount = 0) => {
    try {
      // Your upload logic here
      const formData = new FormData();
      formData.append("file", file);
      // await uploadAPI(formData);

      showNotification({
        type: "success",
        message: "Resume uploaded successfully!",
        autoClose: 5000,
      });
    } catch (error) {
      if (retryCount < 3) {
        showNotification({
          type: "error",
          message: "Upload failed. Would you like to retry?",
          action: {
            label: "Retry",
            onClick: () => uploadResume(file, retryCount + 1),
          },
          autoClose: 0, // Don't auto-close
        });
      } else {
        showNotification({
          type: "error",
          message:
            "Upload failed after multiple attempts. Please try again later.",
          autoClose: 0,
        });
      }
    }
  };

  return { uploadResume };
}

// ==================== Pattern 4: Inline Usage in Components ====================
/**
 * Usage in a React component:
 *
 * import { useNotification } from "@/app/utils/NotificationContext";
 * import { profileApi } from "@/lib/api";
 *
 * export default function ProfilePage() {
 *   const { showSuccess, showError } = useNotification();
 *
 *   const handleSave = async () => {
 *     try {
 *       await profileApi.updateProfile({ display_name: "John Doe" });
 *       showSuccess("Profile updated!");
 *     } catch (error) {
 *       showError("Failed to update profile");
 *     }
 *   };
 *
 *   return <button onClick={handleSave}>Save</button>;
 * }
 */

// ==================== Pattern 5: Global Error Handler ====================
export function createApiWithNotifications(
  showError: (message: string) => void
) {
  return {
    async fetchWithErrorHandling<T>(
      apiCall: () => Promise<T>,
      errorMessage?: string
    ): Promise<T | null> {
      try {
        return await apiCall();
      } catch (error) {
        const message =
          errorMessage ||
          (error instanceof Error ? error.message : "An error occurred");
        showError(message);
        return null;
      }
    },
  };
}

/**
 * Usage of global error handler:
 *
 * const { showError } = useNotification();
 * const apiHelper = createApiWithNotifications(showError);
 *
 * const profile = await apiHelper.fetchWithErrorHandling(
 *   () => profileApi.getProfile(),
 *   "Unable to load profile"
 * );
 */
