// User Profile Types
export interface UserProfile {
  id: number;
  firebase_uid: string;
  email: string;
  display_name: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
  last_login: string;
}

// User Preferences Types
export interface UserPreferences {
  id: number;
  user_id: number;
  interview_difficulty: "easy" | "medium" | "hard";
  interview_duration: number; // in minutes
  preferred_languages: string[];
  theme: "light" | "dark";
  notification_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdatePreferencesRequest {
  interview_difficulty?: "easy" | "medium" | "hard";
  interview_duration?: number;
  preferred_languages?: string[];
  theme?: "light" | "dark";
  notification_enabled?: boolean;
}

// Resume Types
export interface Resume {
  id: number;
  user_id: number;
  title: string;
  file_name: string;
  file_path: string;
  file_size: number;
  content: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateResumeRequest {
  title: string;
  file_name: string;
  file_path: string;
  file_size: number;
  content?: string;
  is_primary?: boolean;
}

export interface UpdateResumeRequest {
  title?: string;
  content?: string;
}
