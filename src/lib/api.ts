"use client";

import { auth } from "@/lib/firebase";
import {
  Resume,
  UpdatePreferencesRequest,
  UpdateResumeRequest,
  UserPreferences,
  UserProfile,
} from "@/types/profile";
import { getBaseUrl } from "./utils";

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = await auth.currentUser?.getIdToken();
  // console.log("Auth token:", token);
  if (!token) {
    throw new Error("No auth token found. Please log in.");
  }
  const headers: HeadersInit = {};

  // Only set Content-Type if body is not FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });

    // If response is not ok, try to extract error message from backend
    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;

      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "Unable to connect to the server. Please check your internet connection and try again.",
      );
    }

    // Re-throw other errors
    throw error;
  }
}

// ==================== Profile API ====================

export const profileApi = {
  async getProfile(): Promise<UserProfile> {
    const response = await authFetch(`${getBaseUrl()}/api/user/profile`);
    if (!response.ok) throw new Error("Failed to fetch profile");
    return response.json();
  },

  async updateProfile(data: {
    display_name?: string;
    photo_url?: string;
  }): Promise<UserProfile> {
    const response = await authFetch(`${getBaseUrl()}/api/user/profile`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update profile");
    return response.json();
  },
};

// ==================== Preferences API ====================

export const preferencesApi = {
  async getPreferences(): Promise<UserPreferences> {
    const response = await authFetch(`${getBaseUrl()}/api/user/preferences`);
    if (!response.ok) throw new Error("Failed to fetch preferences");
    return response.json();
  },

  async updatePreferences(
    data: UpdatePreferencesRequest,
  ): Promise<UserPreferences> {
    const response = await authFetch(`${getBaseUrl()}/api/user/preferences`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update preferences");
    return response.json();
  },
};

// ==================== Resume API ====================

export const resumeApi = {
  async createResume(data: {
    file: File;
    title?: string;
    is_primary?: boolean;
    store_in_db?: boolean;
  }): Promise<Resume> {
    const formData = new FormData();
    formData.append("resume", data.file);
    if (data.title) formData.append("title", data.title);
    if (data.is_primary !== undefined)
      formData.append("is_primary", String(data.is_primary));
    if (data.store_in_db !== undefined)
      formData.append("store_in_db", String(data.store_in_db));

    const response = await authFetch(
      `${getBaseUrl()}/api/user/resumes/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
    if (!response.ok) throw new Error("Failed to upload resume");
    return response.json();
  },

  async getResumes(limit = 50, offset = 0): Promise<Resume[]> {
    const response = await authFetch(
      `${getBaseUrl()}/api/user/resumes?limit=${limit}&offset=${offset}`,
    );
    if (!response.ok) throw new Error("Failed to fetch resumes");
    return response.json();
  },

  async getPrimaryResume(): Promise<Resume> {
    const response = await authFetch(
      `${getBaseUrl()}/api/user/resumes/primary`,
    );
    if (!response.ok) throw new Error("Failed to fetch primary resume");
    return response.json();
  },

  async getResumeById(id: number): Promise<Resume> {
    console.log("Fetching resume with ID:", id);
    const response = await authFetch(`${getBaseUrl()}/api/user/resumes/${id}`);
    if (!response.ok) throw new Error("Failed to fetch resume");
    return response.json();
  },

  async updateResume(id: number, data: UpdateResumeRequest): Promise<Resume> {
    const response = await authFetch(`${getBaseUrl()}/api/user/resumes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update resume");
    return response.json();
  },

  async deleteResume(id: number): Promise<void> {
    const response = await authFetch(`${getBaseUrl()}/api/user/resumes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete resume");
  },

  async setPrimaryResume(id: number): Promise<Resume> {
    const response = await authFetch(
      `${getBaseUrl()}/api/user/resumes/${id}/set-primary`,
      {
        method: "PUT",
      },
    );
    if (!response.ok) throw new Error("Failed to set primary resume");
    return response.json();
  },
};
