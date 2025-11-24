"use client";

import { useErrorHandler } from "@/app/utils/ErrorHandlerContext";
import { useNotification } from "@/app/utils/NotificationContext";
import { useTheme } from "@/app/utils/ThemeContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/lib/AuthContext";
import { jobApi } from "@/lib/recruitmentApi";
import type { CreateJobRequest } from "@/types/recruitment";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateJobPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const { handleError } = useErrorHandler();
  const { showError, showSuccess } = useNotification();
  const { isHR, isAdmin, loading: roleLoading } = useUserRole();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateJobRequest>({
    title: "",
    description: "",
    required_skills: [],
    required_experience_years: 0,
    screening_config: {
      max_candidates: 50,
      similarity_threshold: 0.6,
      application_threshold: 0.7,
    },
  });
  const [skillInput, setSkillInput] = useState("");

  const bgPrimary = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const bgCard = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const inputBg = theme === "dark" ? "bg-gray-700" : "bg-white";

  if (!user || roleLoading) {
    return (
      <div
        className={`min-h-screen ${bgPrimary} ${textPrimary} p-6 flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={textSecondary}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isHR && !isAdmin) {
    router.push("/recruitment");
    return null;
  }

  const handleSubmit = async (
    e: React.FormEvent,
    status: "draft" | "active"
  ) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showError("Please enter a job title");
      return;
    }

    if (!formData.description.trim()) {
      showError("Please enter a job description");
      return;
    }

    if (formData.required_skills.length === 0) {
      showError("Please add at least one required skill");
      return;
    }

    try {
      setLoading(true);
      const response = await jobApi.createJob({
        ...formData,
        status,
      });

      showSuccess(
        `Job ${status === "draft" ? "saved as draft" : "created"} successfully`
      );
      router.push(`/recruitment/jobs/${response.job.id}`);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.required_skills.includes(skill)) {
      setFormData({
        ...formData,
        required_skills: [...formData.required_skills, skill],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      required_skills: formData.required_skills.filter(
        (skill) => skill !== skillToRemove
      ),
    });
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} p-6`}>
      <div className="max-w-4xl mx-auto">
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
            Back
          </button>
          <h1 className="text-3xl font-bold">Create Job Description</h1>
          <p className={`${textSecondary} mt-2`}>
            Fill in the details to create a new job posting
          </p>
        </div>

        {/* Form */}
        <form className={`${bgCard} rounded-lg p-8 ${border}`}>
          {/* Job Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-lg border ${border} ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="e.g., Senior Software Engineer"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={8}
              className={`w-full px-4 py-3 rounded-lg border ${border} ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Describe the role, responsibilities, and requirements..."
              required
            />
          </div>

          {/* Required Experience */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Required Experience (years){" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={formData.required_experience_years}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  required_experience_years: parseInt(e.target.value) || 0,
                })
              }
              className={`w-full px-4 py-3 rounded-lg border ${border} ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              required
            />
          </div>

          {/* Required Skills */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Required Skills <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className={`flex-1 px-4 py-3 rounded-lg border ${border} ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Type a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Add
              </button>
            </div>
            {formData.required_skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.required_skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-lg text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-600"
                    >
                      <svg
                        className="w-4 h-4"
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
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Screening Configuration */}
          <div className={`mb-6 p-6 rounded-lg ${border}`}>
            <h3 className="text-lg font-semibold mb-4">
              AI Screening Configuration
            </h3>
            <p className={`text-sm ${textSecondary} mb-4`}>
              Configure how the AI should screen candidate resumes
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Candidates
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={formData.screening_config?.max_candidates || 50}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      screening_config: {
                        ...formData.screening_config,
                        max_candidates: parseInt(e.target.value) || 50,
                      },
                    })
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${border} ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <p className={`text-xs ${textSecondary} mt-1`}>
                  Maximum candidates to screen
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Similarity Threshold
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.screening_config?.similarity_threshold || 0.6}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      screening_config: {
                        ...formData.screening_config,
                        similarity_threshold: parseFloat(e.target.value) || 0.6,
                      },
                    })
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${border} ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <p className={`text-xs ${textSecondary} mt-1`}>
                  Minimum match score (0-1)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Application Threshold
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={
                    formData.screening_config?.application_threshold || 0.7
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      screening_config: {
                        ...formData.screening_config,
                        application_threshold:
                          parseFloat(e.target.value) || 0.7,
                      },
                    })
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${border} ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <p className={`text-xs ${textSecondary} mt-1`}>
                  Auto-create applications above this score
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${border} ${textSecondary} hover:bg-gray-100 dark:hover:bg-gray-700`}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "draft")}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save as Draft"}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "active")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create & Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
