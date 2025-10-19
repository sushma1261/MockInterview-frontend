"use client";

import { useTheme } from "@/app/utils/ThemeContext";
import ResumeList from "@/components/profile/ResumeList";
import { useAuth } from "@/lib/AuthContext";
import { resumeApi } from "@/lib/api";
import { Resume } from "@/types/profile";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { theme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      // Show welcome screen for non-authenticated users
      setLoading(false);
      return;
    }

    loadResumes();
  }, [user, authLoading]);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const resumesData = await resumeApi.getResumes();
      setResumes(resumesData);
    } catch (error) {
      console.error("Error loading resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const bgMain = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const bgCard =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";

  // Welcome screen for non-authenticated users
  if (!user && !authLoading) {
    return (
      <div
        className={`min-h-screen ${bgMain} flex items-center justify-center p-6 transition-colors`}
      >
        <div
          className={`max-w-2xl w-full ${bgCard} rounded-2xl shadow-xl p-12 text-center border`}
        >
          <div className="mb-8">
            <h1 className={`text-5xl font-bold ${textPrimary} mb-4`}>
              Welcome to <span className="text-indigo-600">iHyre</span>
            </h1>
            <p className={`text-xl ${textSecondary} mb-8`}>
              Your AI-powered interview practice platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className={`font-semibold ${textPrimary} mb-2`}>
                Practice Interviews
              </h3>
              <p className={`text-sm ${textSecondary}`}>
                Get AI-powered interview questions
              </p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-3">📄</div>
              <h3 className={`font-semibold ${textPrimary} mb-2`}>
                Resume Analysis
              </h3>
              <p className={`text-sm ${textSecondary}`}>
                Upload and manage your resumes
              </p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-3">📊</div>
              <h3 className={`font-semibold ${textPrimary} mb-2`}>
                Track Progress
              </h3>
              <p className={`text-sm ${textSecondary}`}>
                Monitor your improvement
              </p>
            </div>
          </div>

          <p className={`${textSecondary} mb-4`}>Sign in to get started</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (authLoading || loading) {
    return (
      <div
        className={`min-h-screen ${bgMain} p-6 transition-colors flex items-center justify-center`}
      >
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Dashboard for authenticated users
  return (
    <div className={`min-h-screen ${bgMain} p-6 transition-colors`}>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>
            Welcome back, {user?.displayName?.split(" ")[0] || "there"}!
          </h1>
          {/* <p className={`${textSecondary}`}>
            Ready to practice your interview skills?
          </p> */}
        </div>

        {/* Chat History Section */}
        <div className={`rounded-xl border ${bgCard} p-6 mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-2xl font-bold ${textPrimary}`}>
              Recent Interview Sessions
            </h2>
            <button
              onClick={() => router.push("/chat")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow"
            >
              Start New Interview
            </button>
          </div>

          {/* Coming Soon Message */}
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <p className={`${textSecondary} mb-4`}>
              Chat history feature coming soon!
            </p>
            <p className={`text-sm ${textSecondary}`}>
              Your interview sessions will be displayed here for easy review.
            </p>
          </div>
        </div>

        {/* Resumes Section */}
        <div className={`rounded-xl border ${bgCard} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-2xl font-bold ${textPrimary}`}>My Resumes</h2>
            <button
              onClick={() => router.push("/resumes")}
              className={`${textSecondary} hover:text-indigo-600 font-medium transition-colors text-sm`}
            >
              View All
            </button>
          </div>

          {resumes.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <span className="text-3xl">📄</span>
              </div>
              <p className={`${textSecondary} mb-4`}>No resumes uploaded yet</p>
              <button
                onClick={() => router.push("/resumes")}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow"
              >
                Upload Your First Resume
              </button>
            </div>
          ) : (
            <ResumeList
              resumes={resumes.slice(0, 3)}
              onUpdate={loadResumes}
              onUploadClick={() => router.push("/resumes")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
