"use client";

import { useErrorHandler } from "@/app/utils/ErrorHandlerContext";
import { useTheme } from "@/app/utils/ThemeContext";
import SessionCard from "@/components/history/SessionCard";
import SessionStats from "@/components/history/SessionStats";
import { useAuth } from "@/lib/AuthContext";
import { historyApi, InterviewSession, UserStats } from "@/lib/historyApi";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const { theme } = useTheme();
  const { handleError } = useErrorHandler();
  const { user, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "in_progress">(
    "all"
  );

  const bgMain = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const bgCard =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";

  useEffect(() => {
    // Only load data if auth has finished loading and user is logged in
    if (!authLoading && user) {
      loadSessions();
      loadStats();
    } else if (!authLoading && !user) {
      // Auth finished loading but no user - stop loading states
      setLoading(false);
      setStatsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, authLoading, user]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await historyApi.getSessions(
        filter !== "all"
          ? { status: filter as "completed" | "in_progress" }
          : undefined
      );
      setSessions(response.sessions);
    } catch (err) {
      handleError(err, "Failed to load interview history");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const response = await historyApi.getStats();
      setStats(response.stats);
    } catch (err) {
      handleError(err, "Failed to load statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  const getFilterButtonClass = (filterValue: string) => {
    const isActive = filter === filterValue;
    return `px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
      isActive
        ? "bg-indigo-600 text-white"
        : theme === "dark"
        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
    }`;
  };

  return (
    <div className={`min-h-screen ${bgMain} transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>
            Interview History
          </h1>
          <p className={textSecondary}>
            Track your progress and review past interview sessions
          </p>
        </div>

        {/* Auth Required Message */}
        {!authLoading && !user ? (
          <div className={`${bgCard} border rounded-xl p-12 text-center`}>
            <span className="text-6xl block mb-4">🔒</span>
            <h3 className={`text-xl font-semibold ${textPrimary} mb-2`}>
              Authentication Required
            </h3>
            <p className={`${textSecondary} mb-6`}>
              Please log in to view your interview history
            </p>
            <Link
              href="/"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            {stats && <SessionStats stats={stats} loading={statsLoading} />}

            <div className="mt-8">
              {/* Filter Tabs */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={getFilterButtonClass("all")}
                  >
                    All Sessions
                  </button>
                  <button
                    onClick={() => setFilter("completed")}
                    className={getFilterButtonClass("completed")}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => setFilter("in_progress")}
                    className={getFilterButtonClass("in_progress")}
                  >
                    In Progress
                  </button>
                </div>
                <span className={`text-sm ${textSecondary}`}>
                  {sessions.length} session{sessions.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className={`${bgCard} border rounded-xl p-12`}>
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className={textSecondary}>
                      Loading your interview history...
                    </p>
                  </div>
                </div>
              ) : sessions.length === 0 ? (
                /* Empty State */
                <div className={`${bgCard} border rounded-xl p-12 text-center`}>
                  <span className="text-6xl block mb-4">📚</span>
                  <h3 className={`text-xl font-semibold ${textPrimary} mb-2`}>
                    {filter === "all"
                      ? "No Interview Sessions Yet"
                      : filter === "completed"
                      ? "No Completed Sessions"
                      : "No In-Progress Sessions"}
                  </h3>
                  <p className={`${textSecondary} mb-6`}>
                    {filter === "all"
                      ? "Start your first practice interview to see your history here"
                      : filter === "completed"
                      ? "Complete an interview session to see it here"
                      : "Start a new interview to see in-progress sessions"}
                  </p>
                  <Link
                    href="/chat"
                    className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Start Practice Interview
                  </Link>
                </div>
              ) : (
                /* Sessions Grid */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {sessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
