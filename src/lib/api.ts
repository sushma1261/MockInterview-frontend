"use client";

import { auth } from "@/lib/firebase";
import {
  CreateResumeRequest,
  Resume,
  UpdatePreferencesRequest,
  UpdateResumeRequest,
  UserPreferences,
  UserProfile,
} from "@/types/profile";
import { getBaseUrl } from "./utils";

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    alert("No auth token found. Please log in.");
    throw new Error("No auth token found. User not logged in.");
  }
  const headers: HeadersInit = {};

  // Only set Content-Type if body is not FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });
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
    data: UpdatePreferencesRequest
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
  async createResume(data: CreateResumeRequest): Promise<Resume> {
    const response = await authFetch(`${getBaseUrl()}/api/user/resumes`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create resume");
    return response.json();
  },

  async getResumes(limit = 50, offset = 0): Promise<Resume[]> {
    const response = await authFetch(
      `${getBaseUrl()}/api/user/resumes?limit=${limit}&offset=${offset}`
    );
    if (!response.ok) throw new Error("Failed to fetch resumes");
    return response.json();
  },

  async getPrimaryResume(): Promise<Resume> {
    const response = await authFetch(
      `${getBaseUrl()}/api/user/resumes/primary`
    );
    if (!response.ok) throw new Error("Failed to fetch primary resume");
    return response.json();
  },

  async getResumeById(id: number): Promise<Resume> {
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
      }
    );
    if (!response.ok) throw new Error("Failed to set primary resume");
    return response.json();
  },
};
