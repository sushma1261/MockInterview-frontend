// ==================== Role Management ====================

export type UserRole =
  | "admin"
  | "hr"
  | "candidate"
  | "interviewer"
  | "hiring_manager";

export interface UserRoleInfo {
  id: number;
  firebase_uid: string;
  email: string;
  display_name: string | null;
  roles: UserRole[];
}

export interface RoleCheckResponse {
  success: boolean;
  has_role: boolean;
  role: UserRole;
}

export interface MyRolesResponse {
  success: boolean;
  roles: UserRole[];
  user: UserRoleInfo;
}

// ==================== User Management ====================

export interface User {
  id: number;
  firebase_uid: string;
  email: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserWithRoles extends User {
  roles: UserRole[];
  department?: string | null;
}

export interface GetAllUsersResponse {
  success: boolean;
  users: UserWithRoles[];
  total: number;
  limit: number;
  offset: number;
}

export interface SearchUsersResponse {
  success: boolean;
  users: UserWithRoles[];
  total: number;
  limit: number;
  offset: number;
}

export interface UpdateUserRoleRequest {
  role: UserRole;
  department?: string;
}

export interface UpdateUserRoleResponse {
  success: boolean;
  message: string;
  user: UserWithRoles;
}

export interface BulkUpdateRoleRequest {
  updates: Array<{
    userId: number;
    roles: UserRole[];
  }>;
}

export interface BulkUpdateRoleResponse {
  success: boolean;
  message: string;
  results: {
    successful: number;
    failed: number;
    details: Array<{
      userId: number;
      success: boolean;
      roles?: UserRole[];
      error?: string;
    }>;
  };
}

// ==================== Job Descriptions ====================

export interface ScreeningConfig {
  max_candidates?: number;
  similarity_threshold?: number;
  application_threshold?: number;
}

export interface JobDescription {
  id: number;
  title: string;
  description: string;
  required_skills: string[];
  required_experience_years: number;
  hr_user_id: number;
  status: "active" | "closed" | "draft";
  screening_config: ScreeningConfig | null;
  created_at: string;
  updated_at: string;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  required_skills: string[];
  required_experience_years: number;
  screening_config?: ScreeningConfig;
  status?: "active" | "closed" | "draft";
}

export interface JobListResponse {
  success: boolean;
  jobs: JobDescription[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface JobStatistics {
  total_applications: number;
  screened: number;
  shortlisted: number;
  rejected: number;
  pending: number;
  approved: number;
  average_score: number;
}

// ==================== Resume Screening ====================

export interface CandidatePreview {
  resume_id: number;
  user_id: number;
  candidate_name: string;
  candidate_email: string;
  resume_title: string;
  ai_match_score: number;
  recommendation: "strong_match" | "good_match" | "weak_match" | "no_match";
  preview_analysis: {
    matched_skills: string[];
    missing_skills: string[];
    strengths: string[];
    concerns: string[];
  };
}

export interface ScreeningPreviewResponse {
  success: boolean;
  screening_id: string;
  preview: {
    total_resumes_found: number;
    candidates_screened: number;
    candidates: CandidatePreview[];
  };
  message: string;
}

export interface CreateApplicationsRequest {
  screening_id: string;
  min_score?: number;
  selected_resume_ids?: number[];
}

// ==================== Applications ====================

export interface Application {
  id: number;
  job_description_id: number;
  resume_id: number;
  user_id: number;
  ai_match_score: number;
  screening_status: "screened" | "shortlisted" | "rejected";
  hr_status: "pending" | "approved" | "rejected";
  hr_notes: string | null;
  created_at: string;
  updated_at: string;
  candidate?: {
    id: number;
    email: string;
    display_name: string | null;
  };
  resume?: {
    id: number;
    title: string;
    content: string;
  };
  job?: {
    id: number;
    title: string;
  };
}

export interface ApplicationListResponse {
  success: boolean;
  applications: Application[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateApplicationRequest {
  screening_status?: "screened" | "shortlisted" | "rejected";
  hr_status?: "pending" | "approved" | "rejected";
  hr_notes?: string;
}
