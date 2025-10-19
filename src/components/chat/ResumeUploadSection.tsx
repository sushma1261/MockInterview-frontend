"use client";

import { useTheme } from "@/app/utils/ThemeContext";
import { useAuth } from "@/lib/AuthContext";
import { authFetch, resumeApi } from "@/lib/api";
import { getBaseUrl } from "@/lib/utils";
import { Resume } from "@/types/profile";
import React, { useEffect, useRef, useState } from "react";

interface ResumeUploadSectionProps {
  onStartInterview: () => void;
  uploadedFile: File | null;
  onFileUpload: (file: File) => void;
  jobDescription: string;
  onJobDescriptionChange: (description: string) => void;
  resumeId?: string | null;
}

export default function ResumeUploadSection({
  onStartInterview,
  uploadedFile,
  onFileUpload,
  jobDescription,
  onJobDescriptionChange,
  resumeId,
}: ResumeUploadSectionProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [resumeUploadLoader, setResumeUploadLoader] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "select">("upload");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(
    resumeId ? parseInt(resumeId) : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bgMain = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const bgCard =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const inputBorder = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const inputBg = theme === "dark" ? "bg-gray-700" : "bg-white";
  const hoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";

  // Load user's resumes
  useEffect(() => {
    if (user && activeTab === "select") {
      loadResumes();
    }
  }, [user, activeTab]);

  const loadResumes = async () => {
    setLoadingResumes(true);
    try {
      const resumesData = await resumeApi.getResumes();
      setResumes(resumesData);
    } catch (error) {
      console.error("Error loading resumes:", error);
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleResumeUpload = async (file: File) => {
    setResumeUploadLoader(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await authFetch(
        `${getBaseUrl()}/new/resume/upload/pdf`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload resume");
      }

      setResumeUploadLoader(false);
      onFileUpload(file);
      setSelectedResumeId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to upload resume. Please try again.");
      setResumeUploadLoader(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleResumeUpload(file);
    }
  };

  const handleResumeSelect = (id: number) => {
    // Toggle selection: if clicking the same resume, unselect it
    setSelectedResumeId(selectedResumeId === id ? null : id);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const canStartInterview = uploadedFile || selectedResumeId || resumeId;

  return (
    <div
      className={`min-h-screen ${bgMain} p-6 transition-colors overflow-y-auto`}
    >
      <div className="w-full max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>
            <span className="text-indigo-600">iHyre</span> Interview Practice
          </h1>
          <p className={`${textSecondary}`}>
            Prepare for your interview with AI-powered feedback
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Resume Selection (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Section with Tabs */}
            <div className={`${bgCard} border p-6 rounded-xl`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${textPrimary}`}>
                  📄 Choose Your Resume
                </h3>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    activeTab === "upload"
                      ? "bg-indigo-600 text-white"
                      : theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  📤 Upload New
                </button>
                <button
                  onClick={() => setActiveTab("select")}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    activeTab === "select"
                      ? "bg-indigo-600 text-white"
                      : theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  📋 Select Existing
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "upload" ? (
                /* Upload Tab */
                <>
                  {!uploadedFile ? (
                    <div
                      onClick={handleFileUploadClick}
                      className={`border-2 border-dashed ${inputBorder} rounded-xl p-8 cursor-pointer ${hoverBg} hover:border-indigo-600 transition text-center`}
                    >
                      {resumeUploadLoader ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                          <p className={`${textSecondary} text-sm`}>
                            Uploading...
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 mx-auto mb-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                            <span className="text-3xl">📄</span>
                          </div>
                          <p className="text-indigo-600 font-medium mb-1">
                            Click to browse or drag & drop
                          </p>
                          <p className={`${textSecondary} text-xs`}>
                            PDF, DOC, DOCX • Max 10MB
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`border-2 ${
                        theme === "dark"
                          ? "border-green-700 bg-green-900/30"
                          : "border-green-300 bg-green-50"
                      } rounded-xl p-4`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">✅</span>
                          <div>
                            <p className={`font-medium ${textPrimary} text-sm`}>
                              {uploadedFile.name}
                            </p>
                            <p className={`text-xs ${textSecondary}`}>
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleFileUploadClick}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </>
              ) : (
                /* Select Tab */
                <>
                  {loadingResumes ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : resumes.length === 0 ? (
                    <div className="text-center py-8">
                      <span className={`${textSecondary} text-4xl block mb-3`}>
                        �
                      </span>
                      <p className={`${textSecondary} text-sm mb-3`}>
                        No resumes found
                      </p>
                      <button
                        onClick={() => setActiveTab("upload")}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Upload One
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {resumes.map((resume) => (
                        <button
                          key={resume.id}
                          onClick={() => handleResumeSelect(resume.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            selectedResumeId === resume.id
                              ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 ring-2 ring-indigo-600"
                              : theme === "dark"
                              ? "border-gray-700 hover:border-gray-600"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4
                                  className={`font-semibold ${textPrimary} text-sm truncate`}
                                >
                                  {resume.title}
                                </h4>
                                {resume.is_primary && (
                                  <span className="bg-indigo-100 text-indigo-700  px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">
                                    Primary
                                  </span>
                                )}
                              </div>
                              <p
                                className={`text-xs ${textSecondary} truncate`}
                              >
                                {resume.file_name}
                              </p>
                              <p className={`text-xs ${textSecondary} mt-1`}>
                                {formatDate(resume.created_at)}
                              </p>
                            </div>
                            {selectedResumeId === resume.id && (
                              <span className="text-indigo-600 text-xl">✓</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Job Description Section */}
            <div className={`${bgCard} border p-6 rounded-xl`}>
              <h3
                className={`text-lg font-semibold ${textPrimary} flex items-center gap-2 mb-3`}
              >
                💼 Job Description{" "}
                <span className={`text-xs font-normal ${textSecondary}`}>
                  (Optional)
                </span>
              </h3>
              <textarea
                value={jobDescription}
                onChange={(e) => onJobDescriptionChange(e.target.value)}
                placeholder="Paste the job description here to get tailored interview questions..."
                className={`w-full border-2 ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-indigo-600 transition-colors`}
                rows={5}
              />
              {jobDescription.length > 0 && (
                <p className={`${textSecondary} text-xs mt-2`}>
                  {jobDescription.length} characters
                </p>
              )}
            </div>
            {/* Start Button */}

            <div className="mt-8 max-w-md mx-auto">
              <button
                onClick={onStartInterview}
                disabled={!canStartInterview}
                className={`w-full px-8 py-4 rounded-xl text-base font-semibold shadow-lg transition-all ${
                  canStartInterview
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl cursor-pointer"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed opacity-60"
                }`}
              >
                Start Interview
              </button>
            </div>
          </div>

          {/* Right Column - Tips & Info (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tips Section */}
            <div
              className={`${
                theme === "dark"
                  ? "bg-blue-900/30 border-blue-700"
                  : "bg-blue-50 border-blue-200"
              } border p-5 rounded-xl`}
            >
              <h3
                className={`text-base font-semibold ${
                  theme === "dark" ? "text-blue-300" : "text-blue-700"
                } flex items-center gap-2 mb-3`}
              >
                💡 Interview Tips
              </h3>
              <ul
                className={`space-y-2 text-xs ${
                  theme === "dark" ? "text-blue-200" : "text-blue-900"
                }`}
              >
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Elaborate on every point in your resume</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Connect experiences to job requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Use metrics and numbers where possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Apply the STAR method for behavioral questions</span>
                </li>
              </ul>
            </div>

            {/* What to Expect Section */}
            <div className={`${bgCard} border p-5 rounded-xl`}>
              <h3
                className={`text-base font-semibold ${textPrimary} flex items-center gap-2 mb-3`}
              >
                ✨ What to Expect
              </h3>
              <ul className={`space-y-2 text-xs ${textSecondary}`}>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Personalized questions based on your resume</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Intelligent follow-up questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Detailed feedback on your answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Grammar and communication assessment</span>
                </li>
              </ul>
            </div>

            {/* Info Box */}
            <div
              className={`${
                theme === "dark"
                  ? "bg-indigo-900/30 border-indigo-700"
                  : "bg-indigo-50 border-indigo-200"
              } border p-4 rounded-xl`}
            >
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                }`}
              >
                <span className="font-semibold">💬 Pro Tip:</span> The AI
                generates questions dynamically based on your resume and job
                description for a personalized interview experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
