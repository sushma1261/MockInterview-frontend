"use client";

import { useTheme } from "@/app/utils/ThemeContext";
import { UserStats } from "@/lib/historyApi";

interface SessionStatsProps {
  stats: UserStats;
  loading?: boolean;
}

export default function SessionStats({ stats, loading }: SessionStatsProps) {
  const { theme } = useTheme();

  const bgCard =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";

  if (loading) {
    return (
      <div className={`${bgCard} border rounded-xl p-6`}>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const statItems = [
    {
      label: "Total Sessions",
      value: stats.total_sessions,
      icon: "📊",
      color: "text-blue-600",
    },
    {
      label: "Completed",
      value: stats.completed_sessions,
      icon: "✅",
      color: "text-green-600",
    },
    {
      label: "Resumes Practiced",
      value: stats.resumes_practiced,
      icon: "📄",
      color: "text-purple-600",
    },
    {
      label: "Job Descriptions",
      value: stats.job_descriptions_used,
      icon: "💼",
      color: "text-indigo-600",
    },
    {
      label: "Total Questions",
      value: stats.total_questions,
      icon: "❓",
      color: "text-yellow-600",
    },
    {
      label: "Answers Given",
      value: stats.total_answers,
      icon: "💬",
      color: "text-pink-600",
    },
    {
      label: "Avg Duration",
      value: stats.avg_duration_minutes
        ? `${Number(stats.avg_duration_minutes).toFixed(1)} min`
        : "0 min",
      icon: "⏱️",
      color: "text-orange-600",
    },
    {
      label: "Avg Score",
      value: stats.avg_score
        ? `${Number(stats.avg_score).toFixed(1)}/10`
        : "N/A",
      icon: "⭐",
      color: "text-amber-600",
    },
  ];

  return (
    <div className={`${bgCard} border rounded-xl p-6`}>
      <h2
        className={`text-xl font-bold ${textPrimary} mb-6 flex items-center gap-2`}
      >
        <span>📈</span> Your Performance Summary
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div
            key={index}
            className={`${
              theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
            } rounded-lg p-4 text-center`}
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className={`text-2xl font-bold ${item.color} mb-1`}>
              {item.value}
            </div>
            <div className={`text-xs ${textSecondary}`}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Completion Rate */}
      {stats.total_sessions > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${textPrimary}`}>
              Completion Rate
            </span>
            <span className={`text-sm font-bold ${textPrimary}`}>
              {Math.round(
                (stats.completed_sessions / stats.total_sessions) * 100
              )}
              %
            </span>
          </div>
          <div
            className={`w-full h-3 rounded-full ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            } overflow-hidden`}
          >
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all"
              style={{
                width: `${
                  (stats.completed_sessions / stats.total_sessions) * 100
                }%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
