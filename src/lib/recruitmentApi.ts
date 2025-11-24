import type {
  Application,
  ApplicationListResponse,
  BulkUpdateRoleResponse,
  CreateApplicationsRequest,
  CreateJobRequest,
  GetAllUsersResponse,
  JobDescription,
  JobListResponse,
  JobStatistics,
  MyRolesResponse,
  RoleCheckResponse,
  ScreeningPreviewResponse,
  SearchUsersResponse,
  UpdateApplicationRequest,
  UpdateUserRoleRequest,
  UpdateUserRoleResponse,
  UserRole,
} from "@/types/recruitment";
import { authFetch } from "./api";
import { getBaseUrl } from "./utils";

const BASE_URL = getBaseUrl();

// ==================== Role Management ====================

export const roleApi = {
  /**
   * Get current user's roles
   */
  async getMyRoles(): Promise<MyRolesResponse> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/roles/my-roles`
    );
    return response.json();
  },

  /**
   * Check if current user has a specific role
   */
  async checkRole(role: UserRole): Promise<RoleCheckResponse> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/roles/check?role=${role}`
    );
    return response.json();
  },

  /**
   * Register current user as a candidate
   */
  async registerAsCandidate(): Promise<{ success: boolean; message: string }> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/roles/register-candidate`,
      {
        method: "POST",
      }
    );
    return response.json();
  },
};

// ==================== Job Descriptions ====================

export const jobApi = {
  /**
   * Create a new job description (HR/Admin only)
   */
  async createJob(
    data: CreateJobRequest
  ): Promise<{ success: boolean; job: JobDescription }> {
    const response = await authFetch(`${BASE_URL}/api/recruitment/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * List job descriptions with filters
   */
  async listJobs(params?: {
    hr_user_id?: number;
    status?: "active" | "closed" | "draft";
    page?: number;
    limit?: number;
  }): Promise<JobListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.hr_user_id)
      queryParams.append("hr_user_id", params.hr_user_id.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const url = `${BASE_URL}/api/recruitment/jobs${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;
    const response = await authFetch(url);
    return response.json();
  },

  /**
   * Get a single job description
   */
  async getJob(
    jobId: number
  ): Promise<{ success: boolean; job: JobDescription }> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/jobs/${jobId}`
    );
    return response.json();
  },

  /**
   * Update a job description (HR/Admin only)
   */
  async updateJob(
    jobId: number,
    data: Partial<CreateJobRequest>
  ): Promise<{ success: boolean; job: JobDescription }> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/jobs/${jobId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  },

  /**
   * Delete a job description (HR/Admin only)
   */
  async deleteJob(
    jobId: number
  ): Promise<{ success: boolean; message: string }> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/jobs/${jobId}`,
      {
        method: "DELETE",
      }
    );
    return response.json();
  },

  /**
   * Get job statistics (HR/Admin only)
   */
  async getJobStatistics(
    jobId: number
  ): Promise<{ success: boolean; statistics: JobStatistics }> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/jobs/${jobId}/statistics`
    );
    return response.json();
  },
};

// ==================== Resume Screening ====================

export const screeningApi = {
  /**
   * Screen resumes for a job (preview mode)
   */
  async screenResumes(
    jobId: number,
    config?: {
      max_candidates?: number;
      similarity_threshold?: number;
    }
  ): Promise<ScreeningPreviewResponse> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/jobs/${jobId}/screen`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ screening_config: config }),
      }
    );
    return response.json();
  },

  /**
   * Get cached screening preview
   */
  async getScreeningPreview(
    screeningId: string
  ): Promise<ScreeningPreviewResponse> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/screening/${screeningId}`
    );
    return response.json();
  },

  /**
   * Create applications from screening results
   */
  async createApplications(
    jobId: number,
    data: CreateApplicationsRequest
  ): Promise<{
    success: boolean;
    created_count: number;
    applications: Application[];
  }> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/jobs/${jobId}/applications/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  },
};

// ==================== Application Management ====================

export const applicationApi = {
  /**
   * Get applications for a specific job
   */
  async getJobApplications(
    jobId: number,
    params?: {
      screening_status?: "screened" | "shortlisted" | "rejected";
      hr_status?: "pending" | "approved" | "rejected";
      min_score?: number;
      page?: number;
      limit?: number;
    }
  ): Promise<ApplicationListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.screening_status)
      queryParams.append("screening_status", params.screening_status);
    if (params?.hr_status) queryParams.append("hr_status", params.hr_status);
    if (params?.min_score)
      queryParams.append("min_score", params.min_score.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const url = `${BASE_URL}/api/recruitment/jobs/${jobId}/applications${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;
    const response = await authFetch(url);
    return response.json();
  },

  /**
   * Get all applications across jobs (dashboard view)
   */
  async getAllApplications(params?: {
    job_id?: number;
    screening_status?: "screened" | "shortlisted" | "rejected";
    hr_status?: "pending" | "approved" | "rejected";
    min_score?: number;
    page?: number;
    limit?: number;
  }): Promise<ApplicationListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.job_id) queryParams.append("job_id", params.job_id.toString());
    if (params?.screening_status)
      queryParams.append("screening_status", params.screening_status);
    if (params?.hr_status) queryParams.append("hr_status", params.hr_status);
    if (params?.min_score)
      queryParams.append("min_score", params.min_score.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const url = `${BASE_URL}/api/recruitment/applications${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;
    const response = await authFetch(url);
    return response.json();
  },

  /**
   * Get a single application with full details
   */
  async getApplication(
    applicationId: number
  ): Promise<{ success: boolean; application: Application }> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/applications/${applicationId}`
    );
    return response.json();
  },

  /**
   * Update an application
   */
  async updateApplication(
    applicationId: number,
    data: UpdateApplicationRequest
  ): Promise<{ success: boolean; application: Application }> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/applications/${applicationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  },

  /**
   * Shortlist a candidate
   */
  async shortlistCandidate(
    applicationId: number
  ): Promise<{ success: boolean; application: Application }> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/applications/${applicationId}/shortlist`,
      {
        method: "POST",
      }
    );
    return response.json();
  },

  /**
   * Reject a candidate
   */
  async rejectCandidate(
    applicationId: number,
    reason?: string
  ): Promise<{ success: boolean; application: Application }> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/applications/${applicationId}/reject`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      }
    );
    return response.json();
  },

  /**
   * Approve a candidate
   */
  async approveCandidate(
    applicationId: number,
    notes?: string
  ): Promise<{ success: boolean; application: Application }> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/applications/${applicationId}/approve`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      }
    );
    return response.json();
  },

  /**
   * Export applications (CSV/JSON)
   */
  async exportApplications(
    jobId: number,
    format: "csv" | "json" = "json"
  ): Promise<Response> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/applications/bulk-export?job_id=${jobId}&format=${format}`
    );
    return response; // Return raw response for file download
  },
};

// ==================== User Management ====================

export const userManagementApi = {
  /**
   * Get all users with their roles (Admin only)
   */
  async getAllUsers(params?: {
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<GetAllUsersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());

    const url = `${BASE_URL}/api/recruitment/roles/users${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;
    const response = await authFetch(url);
    return response.json();
  },

  /**
   * Search users by query (Admin only)
   */
  async searchUsers(params: {
    q: string;
    limit?: number;
    offset?: number;
  }): Promise<SearchUsersResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("q", params.q);
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.offset) queryParams.append("offset", params.offset.toString());

    const url = `${BASE_URL}/api/recruitment/roles/users/search?${queryParams}`;
    const response = await authFetch(url);
    return response.json();
  },

  /**
   * Update a user's role (Admin only)
   */
  async updateUserRole(
    userId: number,
    data: UpdateUserRoleRequest
  ): Promise<UpdateUserRoleResponse> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/roles/users/${userId}/role`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  },

  /**
   * Bulk update multiple user roles (Admin only)
   */
  async bulkUpdateRoles(
    updates: Array<{ userId: number; roles: UserRole[] }>
  ): Promise<BulkUpdateRoleResponse> {
    const response = await authFetch(
      `${BASE_URL}/api/recruitment/roles/users/bulk-update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      }
    );
    return response.json();
  },
};
