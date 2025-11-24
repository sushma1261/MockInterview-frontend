"use client";

import { useErrorHandler } from "@/app/utils/ErrorHandlerContext";
import { useNotification } from "@/app/utils/NotificationContext";
import { useTheme } from "@/app/utils/ThemeContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/lib/AuthContext";
import { jobApi } from "@/lib/recruitmentApi";
import type { JobDescription, JobStatistics } from "@/types/recruitment";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = parseInt(params.id as string);

  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const { handleError } = useErrorHandler();
  const { showSuccess } = useNotification();
  const { isHR, isAdmin, loading: roleLoading } = useUserRole();

  const [job, setJob] = useState<JobDescription | null>(null);
  const [statistics, setStatistics] = useState<JobStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const bgPrimary = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const bgCard = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";

  useEffect(() => {
    if (!user || roleLoading) return;

    if (!isHR && !isAdmin) {
      router.push("/recruitment");
      return;
    }

    loadJobDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isHR, isAdmin, roleLoading]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const [jobResponse, statsResponse] = await Promise.all([
        jobApi.getJob(jobId),
        jobApi.getJobStatistics(jobId),
      ]);
      setJob(jobResponse.job);
      setStatistics(statsResponse.statistics);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    newStatus: "active" | "closed" | "draft"
  ) => {
    if (!job) return;

    try {
      const response = await jobApi.updateJob(jobId, { status: newStatus });
      setJob(response.job);
      showSuccess(`Job status updated to ${newStatus}`);
    } catch (error) {
      handleError(error);
    }
  };

  const handleDelete = async () => {
    try {
      await jobApi.deleteJob(jobId);
      showSuccess("Job deleted successfully");
      router.push("/recruitment");
    } catch (error) {
      handleError(error);
    }
  };

  if (loading || !job) {
    return (
      <div
        className={`min-h-screen ${bgPrimary} ${textPrimary} p-6 flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={textSecondary}>Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className={`flex items-center gap-2 ${textSecondary} hover:text-indigo-600 mb-4`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Jobs
          </button>

          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{job.title}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : job.status === "draft"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {job.status}
                </span>
              </div>
              <p className={textSecondary}>
                Created {new Date(job.created_at).toLocaleDateString()} • Last
                updated {new Date(job.updated_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  router.push(`/recruitment/jobs/${jobId}/screening`)
                }
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Screen Candidates
              </button>
              <div className="relative">
                <button
                  className={`p-2 rounded-lg ${border} hover:bg-gray-100 dark:hover:bg-gray-700`}
                  onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>

                {showDeleteConfirm && (
                  <div
                    className={`absolute right-0 mt-2 w-48 ${bgCard} rounded-lg shadow-lg ${border} z-10`}
                  >
                    <button
                      onClick={() => {
                        handleDelete();
                        setShowDeleteConfirm(false);
                      }}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      Delete Job
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className={`${bgCard} rounded-lg p-6 ${border}`}>
              <p className={`text-sm ${textSecondary} mb-1`}>
                Total Applications
              </p>
              <p className="text-3xl font-bold">
                {statistics.total_applications}
              </p>
            </div>
            <div className={`${bgCard} rounded-lg p-6 ${border}`}>
              <p className={`text-sm ${textSecondary} mb-1`}>Screened</p>
              <p className="text-3xl font-bold text-blue-600">
                {statistics.screened}
              </p>
            </div>
            <div className={`${bgCard} rounded-lg p-6 ${border}`}>
              <p className={`text-sm ${textSecondary} mb-1`}>Shortlisted</p>
              <p className="text-3xl font-bold text-green-600">
                {statistics.shortlisted}
              </p>
            </div>
            <div className={`${bgCard} rounded-lg p-6 ${border}`}>
              <p className={`text-sm ${textSecondary} mb-1`}>Approved</p>
              <p className="text-3xl font-bold text-purple-600">
                {statistics.approved}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className={`${bgCard} rounded-lg p-6 ${border}`}>
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <p className={`${textSecondary} whitespace-pre-wrap`}>
                {job.description}
              </p>
            </div>

            {/* Required Skills */}
            <div className={`${bgCard} rounded-lg p-6 ${border}`}>
              <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.required_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Screening Configuration */}
            {job.screening_config && (
              <div className={`${bgCard} rounded-lg p-6 ${border}`}>
                <h2 className="text-xl font-semibold mb-4">
                  AI Screening Configuration
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={textSecondary}>Max Candidates:</span>
                    <span className="font-medium">
                      {job.screening_config.max_candidates || 50}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={textSecondary}>Similarity Threshold:</span>
                    <span className="font-medium">
                      {job.screening_config.similarity_threshold || 0.6}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={textSecondary}>
                      Application Threshold:
                    </span>
                    <span className="font-medium">
                      {job.screening_config.application_threshold || 0.7}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className={`${bgCard} rounded-lg p-6 ${border}`}>
              <h2 className="text-xl font-semibold mb-4">Job Details</h2>
              <div className="space-y-3">
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>
                    Required Experience
                  </p>
                  <p className="font-medium">
                    {job.required_experience_years} years
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Status</p>
                  <select
                    value={job.status}
                    onChange={(e) =>
                      handleStatusChange(
                        e.target.value as "active" | "closed" | "draft"
                      )
                    }
                    className={`w-full px-3 py-2 rounded-lg border ${border} ${bgCard} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={`${bgCard} rounded-lg p-6 ${border}`}>
              <h2 className="text-xl font-semibold mb-4">Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={() =>
                    router.push(`/recruitment/jobs/${jobId}/applications`)
                  }
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${border} ${textPrimary} hover:bg-gray-100 dark:hover:bg-gray-700 text-left flex items-center justify-between`}
                >
                  <span>View Applications</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    router.push(`/recruitment/jobs/${jobId}/screening`)
                  }
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${border} ${textPrimary} hover:bg-gray-100 dark:hover:bg-gray-700 text-left flex items-center justify-between`}
                >
                  <span>Screen Resumes</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
