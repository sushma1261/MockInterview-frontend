"use client";

import { useAuth } from "@/lib/AuthContext";
import { resumeApi } from "@/lib/api";
import { Resume } from "@/types/profile";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function ResumeViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const resumeId = parseInt(resolvedParams.id);
  
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { loading: authLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        setError(null);
        const resumeData = await resumeApi.getResumeById(resumeId);
        setResume(resumeData);
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError("Failed to load resume. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Wait for auth to finish loading before making API call
    if (!authLoading && isLoggedIn && resumeId) {
      fetchResume();
    } else if (!authLoading && !isLoggedIn) {
      setLoading(false);
      setError("Please log in to view resumes.");
    }
  }, [resumeId, authLoading, isLoggedIn]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {authLoading ? "Authenticating..." : "Loading resume..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Resume
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "Resume not found"}
          </p>
          <button
            onClick={() => router.push("/resumes")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Resumes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {resume.title}
                </h1>
                {resume.is_primary && (
                  <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs px-2 py-1 rounded-full font-medium">
                    Primary
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {resume.file_name}
              </p>
            </div>
            <button
              onClick={() => router.push("/resumes")}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                File Size
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {resume.file_size}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Uploaded
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(resume.created_at)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Last Updated
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(resume.updated_at)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Status
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {resume.is_primary ? "Primary" : "Secondary"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => router.push(`/chat?resumeId=${resume.id}`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start Interview
            </button>
            <button
              onClick={() => router.push("/resumes")}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Back to List
            </button>
          </div>
        </div>

        {/* Resume Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Resume Content
          </h2>
          {resume.content ? (
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
                {resume.content}
              </pre>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                No text content available for this resume
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                The resume was uploaded but content extraction may not have
                completed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
