"use client";

import { useNotification } from "@/app/utils/NotificationContext";
import { useTheme } from "@/app/utils/ThemeContext";
import { InterviewSession, historyApi } from "@/lib/historyApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SessionCardProps {
  session: InterviewSession;
}

export default function SessionCard({ session }: SessionCardProps) {
  const { theme } = useTheme();
  const { showSuccess, showError } = useNotification();
  const router = useRouter();
  const [isResuming, setIsResuming] = useState(false);

  const bgCard =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const hoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";

  const handleResumeSession = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    try {
      setIsResuming(true);
      const response = await historyApi.resumeSession(session.id);
      showSuccess(
        `Session resumed! Restored ${response.messageCount} messages. Redirecting to chat...`
      );

      // Redirect to chat page with session ID
      setTimeout(() => {
        router.push(`/chat/${session.id}`);
      }, 1500);
    } catch (err) {
      console.error("Error resuming session:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to resume session";
      showError(errorMessage);
    } finally {
      setIsResuming(false);
    }
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      case "abandoned":
        return "Abandoned";
      default:
        return status;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const completionPercentage =
    session.total_questions > 0
      ? Math.round((session.questions_answered / session.total_questions) * 100)
      : 0;

  return (
    <Link href={`/history/${session.id}`}>
      <div
        className={`${bgCard} border rounded-xl p-5 ${hoverBg} transition-all cursor-pointer hover:shadow-md`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${textPrimary} mb-1`}>
              {session.job_title || "Interview Practice"}
            </h3>
            {session.company_name && (
              <p className={`text-sm ${textSecondary} mb-1`}>
                {session.company_name}
              </p>
            )}
            <p className={`text-xs ${textSecondary}`}>
              Resume: {session.resume_title}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              session.session_status
            )}`}
          >
            {getStatusLabel(session.session_status)}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <div>
            <p className={`text-xs ${textSecondary} mb-1`}>Questions</p>
            <p className={`text-sm font-semibold ${textPrimary}`}>
              {session.questions_answered}/{session.total_questions}
            </p>
          </div>
          <div>
            <p className={`text-xs ${textSecondary} mb-1`}>Duration</p>
            <p className={`text-sm font-semibold ${textPrimary}`}>
              {session.duration_minutes
                ? `${session.duration_minutes} min`
                : "-"}
            </p>
          </div>
          <div>
            <p className={`text-xs ${textSecondary} mb-1`}>Messages</p>
            <p className={`text-sm font-semibold ${textPrimary}`}>
              {session.message_count}
            </p>
          </div>
          <div>
            <p className={`text-xs ${textSecondary} mb-1`}>Progress</p>
            <p className={`text-sm font-semibold ${textPrimary}`}>
              {completionPercentage}%
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div
            className={`w-full h-2 rounded-full ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            } overflow-hidden`}
          >
            <div
              className="h-full bg-indigo-600 transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className={textSecondary}>
            Started: {formatDate(session.started_at)}
          </span>
          {session.completed_at && (
            <span className={textSecondary}>
              Completed: {formatDate(session.completed_at)}
            </span>
          )}
        </div>

        {/* Resume Button for In-Progress Sessions */}
        {session.session_status === "in_progress" && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={handleResumeSession}
              disabled={isResuming}
              className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                isResuming
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              } flex items-center justify-center gap-2`}
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
          </div>
        )}
      </div>
    </Link>
  );
}
