"use client";

import { useErrorHandler } from "@/app/utils/ErrorHandlerContext";
import { useTheme } from "@/app/utils/ThemeContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/lib/AuthContext";
import { jobApi } from "@/lib/recruitmentApi";
import type { JobDescription } from "@/types/recruitment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RecruitmentDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const { handleError } = useErrorHandler();
  const { isHR, isAdmin, loading: roleLoading } = useUserRole();

  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "closed" | "draft">(
    "all"
  );

  const bgPrimary = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const bgCard = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    if (!roleLoading && !isHR && !isAdmin) {
      handleError(new Error("You need HR or Admin role to access recruitment"));
      router.push("/");
      return;
    }

    if (!roleLoading) {
      loadJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isHR, isAdmin, roleLoading, filter]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await jobApi.listJobs({
        status: filter === "all" ? undefined : filter,
      });
      setJobs(response.jobs);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { value: "all", label: "All Jobs" },
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
    { value: "closed", label: "Closed" },
  ] as const;

  if (roleLoading || loading) {
    return (
      <div
        className={`min-h-screen ${bgPrimary} ${textPrimary} p-6 flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={textSecondary}>Loading recruitment dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Recruitment Dashboard</h1>
            <p className={`${textSecondary} mt-2`}>
              Manage job descriptions and candidate applications
            </p>
          </div>
          <button
            onClick={() => router.push("/recruitment/jobs/new")}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Job
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === option.value
                  ? "bg-indigo-600 text-white"
                  : `${bgCard} ${textSecondary} hover:bg-opacity-80`
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <div className={`${bgCard} rounded-lg p-12 text-center ${border}`}>
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className={textSecondary}>
              {filter === "all"
                ? "Create your first job description to get started"
                : `No ${filter} jobs found`}
            </p>
            {filter === "all" && (
              <button
                onClick={() => router.push("/recruitment/jobs/new")}
                className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Create Job
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => router.push(`/recruitment/jobs/${job.id}`)}
                className={`${bgCard} rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow ${border}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                    <p className={`text-sm ${textSecondary}`}>
                      {job.required_experience_years} years experience
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
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

                <p className={`text-sm ${textSecondary} mb-4 line-clamp-2`}>
                  {job.description}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className={textSecondary}>
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {job.required_skills && job.required_skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.required_skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs ${
                          theme === "dark"
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                    {job.required_skills.length > 3 && (
                      <span className={`text-xs ${textSecondary}`}>
                        +{job.required_skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
