import { authFetch } from "./api";
import { getBaseUrl } from "./utils";

export interface InterviewSession {
  id: number;
  resume_id: number;
  resume_title: string;
  job_title: string | null;
  company_name: string | null;
  session_status: "in_progress" | "completed" | "abandoned";
  total_questions: number;
  questions_answered: number;
  started_at: string;
  completed_at: string | null;
  duration_minutes: number | null;
  message_count: number;
}

export interface SessionMessage {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  message_type: string;
  question_number: number | null;
  question_type: string | null;
  created_at: string;
}

export interface QuestionFeedback {
  id: number;
  question_number: number;
  question_text: string;
  question_type: string;
  user_answer: string;
  feedback_text: string;
  strengths: string[];
  areas_for_improvement: string[];
  score: number;
  created_at: string;
}

export interface OverallFeedback {
  type: string;
  is_final: boolean;
  strengths: string[];
  content_quality: string;
  confidence_score: number;
  grammar_assessment: string;
  improvement_suggestions: string[];
}

export interface SessionDetail {
  id: number;
  user_id: number;
  resume_id: number;
  resume_title: string;
  resume_file_name: string;
  job_title: string | null;
  company_name: string | null;
  job_description: string | null;
  session_status: string;
  total_questions: number;
  questions_answered: number;
  started_at: string;
  completed_at: string | null;
  duration_minutes: number | null;
  overall_feedback: OverallFeedback | null;
}

export interface SessionDetailResponse {
  success: boolean;
  session: SessionDetail;
  messages: SessionMessage[];
  feedback: QuestionFeedback[];
}

export interface UserStats {
  total_sessions: number;
  completed_sessions: number;
  resumes_practiced: number;
  job_descriptions_used: number;
  total_questions: number;
  total_answers: number;
  avg_duration_minutes: number;
  avg_score: number;
}

export interface JobDescription {
  id: number;
  title: string | null;
  company_name: string | null;
  description: string;
  created_at: string;
}

export const historyApi = {
  /**
   * Get all interview sessions for the user
   */
  async getSessions(params?: {
    resume_id?: number;
    status?: "in_progress" | "completed" | "abandoned";
    limit?: number;
  }): Promise<{
    success: boolean;
    count: number;
    sessions: InterviewSession[];
  }> {
    const queryParams = new URLSearchParams();
    if (params?.resume_id)
      queryParams.append("resume_id", params.resume_id.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const url = `${getBaseUrl()}/api/history${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;
    const response = await authFetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch interview sessions");
    }

    return response.json();
  },

  /**
   * Get detailed information for a specific session
   */
  async getSessionDetail(sessionId: number): Promise<SessionDetailResponse> {
    const response = await authFetch(
      `${getBaseUrl()}/api/history/${sessionId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch session details");
    }

    return response.json();
  },

  /**
   * Get conversation history as formatted text
   */
  async getConversation(
    sessionId: number,
    limit?: number
  ): Promise<{ success: boolean; sessionId: number; conversation: string }> {
    const url = `${getBaseUrl()}/api/history/${sessionId}/conversation${
      limit ? `?limit=${limit}` : ""
    }`;
    const response = await authFetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch conversation");
    }

    return response.json();
  },

  /**
   * Get user statistics and performance metrics
   */
  async getStats(): Promise<{ success: boolean; stats: UserStats }> {
    const response = await authFetch(
      `${getBaseUrl()}/api/history/stats/summary`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user statistics");
    }

    return response.json();
  },

  /**
   * Get all saved job descriptions for the user
   */
  async getJobDescriptions(): Promise<{
    success: boolean;
    count: number;
    jobDescriptions: JobDescription[];
  }> {
    const response = await authFetch(
      `${getBaseUrl()}/api/history/job-descriptions/all`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch job descriptions");
    }

    return response.json();
  },

  /**
   * Manually save a job description
   */
  async saveJobDescription(data: {
    description: string;
    title?: string;
    company_name?: string;
  }): Promise<{ success: boolean; message: string; jobDescriptionId: number }> {
    const response = await authFetch(
      `${getBaseUrl()}/api/history/job-descriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save job description");
    }

    return response.json();
  },

  /**
   * Resume an in-progress session (restores from PostgreSQL to Redis)
   */
  async resumeSession(sessionId: number): Promise<{
    success: boolean;
    message: string;
    session: {
      id: number;
      resume_id: number;
      job_description_id: number | null;
      status: string;
      started_at: string;
      total_questions: number;
      questions_answered: number;
    };
    messageCount: number;
  }> {
    const response = await authFetch(
      `${getBaseUrl()}/api/chat/resume/${sessionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.details || errorData.error || "Failed to resume session"
      );
    }

    return response.json();
  },
};
