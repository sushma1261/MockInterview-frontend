// Message types
export interface Message {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: {
    question_number?: number;
    question_type?: string;
    reasoning?: string;
  };
}

// Feedback types
export interface FeedbackData {
  confidence_score: number;
  grammar_assessment: string;
  content_quality: string;
  improvement_suggestions: string[];
  strengths: string[];
  is_final: boolean;
}

// API response types
export interface ChatResponse {
  success: boolean;
  action: string;
  type?: string;
  question?: string;
  question_number?: number;
  question_type?: string;
  reasoning?: string;
  feedback?: FeedbackData;
  is_complete?: boolean;
  context?: string;
  turn_count?: number;
}
