"use client";

import { useTheme } from "@/app/utils/ThemeContext";
import ResumeList from "@/components/profile/ResumeList";
import ResumeUpload from "@/components/profile/ResumeUpload";
import { useAuth } from "@/lib/AuthContext";
import { resumeApi } from "@/lib/api";
import { Resume } from "@/types/profile";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResumesPage() {
  const { theme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to initialize

    if (!user) {
      router.push("/"); // Redirect to home if not logged in
      return;
    }

    loadResumes();
  }, [user, authLoading, router]);

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

  // Show loading spinner while auth is initializing
  if (authLoading || (loading && resumes.length === 0)) {
    return (
      <div
        className={`min-h-screen ${bgMain} p-6 transition-colors flex items-center justify-center`}
      >
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgMain} p-6 transition-colors`}>
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-xl border ${bgCard} p-6 mb-6 relative`}>
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-2xl font-bold ${textPrimary}`}>My Resumes</h1>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow"
            >
              + Upload Resume
            </button>
          </div>

          <ResumeList
            resumes={resumes}
            onUpdate={loadResumes}
            onUploadClick={() => setShowUpload(true)}
          />
        </div>
        {/* Modal for ResumeUpload */}
        {showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-md relative">
              <button
                onClick={() => setShowUpload(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Upload Resume
              </h2>
              <ResumeUpload
                onUploadSuccess={() => {
                  setShowUpload(false);
                  loadResumes();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
