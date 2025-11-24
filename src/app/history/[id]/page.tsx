"use client";

import { useNotification } from "@/app/utils/NotificationContext";
import { useTheme } from "@/app/utils/ThemeContext";
import ConversationView from "@/components/history/ConversationView";
import FeedbackCard from "@/components/history/FeedbackCard";
import { historyApi, SessionDetailResponse } from "@/lib/historyApi";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SessionDetailPage() {
  const { theme } = useTheme();
  const { showSuccess, showError } = useNotification();
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.id as string;

  const [sessionData, setSessionData] = useState<SessionDetailResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"conversation" | "feedback">(
    "conversation"
  );
  const [isResuming, setIsResuming] = useState(false);

  const bgMain = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const bgCard =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";

  useEffect(() => {
    if (sessionId) {
      loadSessionDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const loadSessionDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await historyApi.getSessionDetail(parseInt(sessionId));
      setSessionData(response);
    } catch (err) {
      console.error("Error loading session detail:", err);
      setError("Failed to load session details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResumeSession = async () => {
    try {
      setIsResuming(true);
      const response = await historyApi.resumeSession(parseInt(sessionId));
      showSuccess(
        `Session resumed! Restored ${response.messageCount} messages. Redirecting to chat...`
      );

      // Redirect to chat page with session ID
      setTimeout(() => {
        router.push(`/chat/${sessionId}`);
      }, 1500);
    } catch (err) {
      console.error("Error resuming session:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to resume session";
      showError(errorMessage);
      setIsResuming(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return theme === "dark"
          ? "bg-green-900/30 text-green-300 border-green-700"
          : "bg-green-50 text-green-700 border-green-200";
      case "in_progress":
        return theme === "dark"
          ? "bg-blue-900/30 text-blue-300 border-blue-700"
          : "bg-blue-50 text-blue-700 border-blue-200";
      case "abandoned":
        return theme === "dark"
          ? "bg-gray-700 text-gray-400 border-gray-600"
          : "bg-gray-100 text-gray-600 border-gray-300";
      default:
        return "";
    }
  };

  const getTabButtonClass = (tab: string) => {
    const isActive = activeTab === tab;
    return `flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
      isActive
        ? "bg-indigo-600 text-white"
        : theme === "dark"
        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${bgMain} transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`${bgCard} border rounded-xl p-12`}>
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className={textSecondary}>Loading session details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className={`min-h-screen ${bgMain} transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div
            className={`${bgCard} border border-red-500 rounded-xl p-12 text-center`}
          >
            <p className="text-red-600 mb-3">{error || "Session not found"}</p>
            <Link
              href="/history"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Back to History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { session, messages, feedback } = sessionData;

  return (
    <div className={`min-h-screen ${bgMain} transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/history"
          className={`inline-flex items-center gap-2 ${textSecondary} hover:${textPrimary} mb-6 transition-colors`}
        >
          <span>←</span> Back to History
        </Link>

        {/* Session Header */}
        <div className={`${bgCard} border rounded-xl p-6 mb-6`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className={`text-2xl font-bold ${textPrimary} mb-2`}>
                {session.job_title || "Interview Practice Session"}
              </h1>
              {session.company_name && (
                <p className={`text-lg ${textSecondary} mb-2`}>
                  {session.company_name}
                </p>
              )}
              <p className={`text-sm ${textSecondary}`}>
                Resume: {session.resume_title}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  session.session_status
                )}`}
              >
                {session.session_status.replace("_", " ").toUpperCase()}
              </span>
              {session.session_status === "in_progress" && (
                <button
                  onClick={handleResumeSession}
                  disabled={isResuming}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    isResuming
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  } flex items-center gap-2`}
                >
                  {isResuming ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Resuming...
                    </>
                  ) : (
                    <>
                      <span>▶️</span>
                      Resume Interview
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className={`text-xs ${textSecondary} mb-1`}>Questions</p>
              <p className={`text-lg font-semibold ${textPrimary}`}>
                {session.questions_answered}/{session.total_questions}
              </p>
            </div>
            <div>
              <p className={`text-xs ${textSecondary} mb-1`}>Duration</p>
              <p className={`text-lg font-semibold ${textPrimary}`}>
                {session.duration_minutes
                  ? `${session.duration_minutes} min`
                  : "-"}
              </p>
            </div>
            <div>
              <p className={`text-xs ${textSecondary} mb-1`}>Messages</p>
              <p className={`text-lg font-semibold ${textPrimary}`}>
                {messages.length}
              </p>
            </div>
            <div>
              <p className={`text-xs ${textSecondary} mb-1`}>Feedback Items</p>
              <p className={`text-lg font-semibold ${textPrimary}`}>
                {feedback.length > 0
                  ? feedback.length
                  : session.overall_feedback
                  ? "Overall"
                  : "0"}
              </p>
            </div>
            <div>
              <p className={`text-xs ${textSecondary} mb-1`}>Started</p>
              <p className={`text-sm font-semibold ${textPrimary}`}>
                {formatDate(session.started_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("conversation")}
            className={getTabButtonClass("conversation")}
          >
            💬 Conversation ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={getTabButtonClass("feedback")}
          >
            📝 Feedback{" "}
            {feedback.length > 0
              ? `(${feedback.length})`
              : session.overall_feedback
              ? "(Available)"
              : "(0)"}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "conversation" ? (
          <ConversationView messages={messages} />
        ) : (
          <div className="space-y-4">
            {/* Overall Feedback (if available) */}
            {session.overall_feedback && (
              <div className={`${bgCard} border rounded-xl p-6`}>
                <h3
                  className={`text-xl font-semibold ${textPrimary} mb-4 flex items-center gap-2`}
                >
                  <span>📊</span> Overall Interview Feedback
                </h3>

                {/* Confidence Score */}
                {typeof session.overall_feedback.confidence_score ===
                  "number" && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${textSecondary}`}>
                        Confidence Score
                      </span>
                      <span className={`text-lg font-bold ${textPrimary}`}>
                        {session.overall_feedback.confidence_score}/10
                      </span>
                    </div>
                    <div
                      className={`w-full h-3 rounded-full ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                      } overflow-hidden`}
                    >
                      <div
                        className={`h-full transition-all ${
                          session.overall_feedback.confidence_score >= 7
                            ? "bg-green-500"
                            : session.overall_feedback.confidence_score >= 5
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${
                            (session.overall_feedback.confidence_score / 10) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Content Quality */}
                {session.overall_feedback.content_quality && (
                  <div className="mb-4">
                    <h4 className={`text-sm font-semibold ${textPrimary} mb-2`}>
                      Content Quality
                    </h4>
                    <p className={`${textSecondary} text-sm leading-relaxed`}>
                      {session.overall_feedback.content_quality}
                    </p>
                  </div>
                )}

                {/* Grammar Assessment */}
                {session.overall_feedback.grammar_assessment && (
                  <div className="mb-4">
                    <h4 className={`text-sm font-semibold ${textPrimary} mb-2`}>
                      Grammar & Communication
                    </h4>
                    <p className={`${textSecondary} text-sm leading-relaxed`}>
                      {session.overall_feedback.grammar_assessment}
                    </p>
                  </div>
                )}

                {/* Strengths */}
                {session.overall_feedback.strengths &&
                  session.overall_feedback.strengths.length > 0 && (
                    <div className="mb-4">
                      <h4
                        className={`text-sm font-semibold ${textPrimary} mb-2 flex items-center gap-2`}
                      >
                        <span>💪</span> Strengths
                      </h4>
                      <ul
                        className={`list-disc list-inside ${textSecondary} text-sm space-y-1`}
                      >
                        {session.overall_feedback.strengths.map(
                          (strength, idx) => (
                            <li key={idx}>{strength}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {/* Improvement Suggestions */}
                {session.overall_feedback.improvement_suggestions &&
                  session.overall_feedback.improvement_suggestions.length >
                    0 && (
                    <div className="mb-4">
                      <h4
                        className={`text-sm font-semibold ${textPrimary} mb-2 flex items-center gap-2`}
                      >
                        <span>💡</span> Areas for Improvement
                      </h4>
                      <ul
                        className={`list-disc list-inside ${textSecondary} text-sm space-y-2`}
                      >
                        {session.overall_feedback.improvement_suggestions.map(
                          (suggestion, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {suggestion}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            )}

            {/* Question-specific Feedback */}
            {feedback.length > 0 && (
              <>
                <h3
                  className={`text-lg font-semibold ${textPrimary} mt-6 mb-3`}
                >
                  Question-by-Question Feedback
                </h3>
                {feedback.map((fb) => (
                  <FeedbackCard key={fb.id} feedback={fb} />
                ))}
              </>
            )}

            {/* No Feedback Message */}
            {feedback.length === 0 && !session.overall_feedback && (
              <div className={`${bgCard} border rounded-xl p-12 text-center`}>
                <span className="text-6xl block mb-4">📝</span>
                <h3 className={`text-xl font-semibold ${textPrimary} mb-2`}>
                  No Feedback Yet
                </h3>
                <p className={textSecondary}>
                  Complete the interview to receive detailed feedback on your
                  answers
                </p>
              </div>
            )}
          </div>
        )}

        {/* Job Description (if available) */}
        {session.job_description && (
          <div className={`${bgCard} border rounded-xl p-6 mt-6`}>
            <h3 className={`text-lg font-semibold ${textPrimary} mb-3`}>
              Job Description
            </h3>
            <p className={`${textSecondary} text-sm whitespace-pre-wrap`}>
              {session.job_description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
