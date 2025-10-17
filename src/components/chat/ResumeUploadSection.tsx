"use client";

import { authFetch } from "@/lib/api";
import { getBaseUrl } from "@/lib/utils";
import React, { useRef, useState } from "react";

interface ResumeUploadSectionProps {
  onStartInterview: () => void;
  uploadedFile: File | null;
  onFileUpload: (file: File) => void;
  jobDescription: string;
  onJobDescriptionChange: (description: string) => void;
}

export default function ResumeUploadSection({
  onStartInterview,
  uploadedFile,
  onFileUpload,
  jobDescription,
  onJobDescriptionChange,
}: ResumeUploadSectionProps) {
  const [resumeUploadLoader, setResumeUploadLoader] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="text-center text-white mb-4">
          <h1 className="text-3xl font-bold mb-3">
            Mocky - Your Interview Assistant
          </h1>
          <p className="text-xl text-white/90">
            Practice behavioral and technical interviews with AI-powered
            feedback
          </p>
        </div>

        {/* About Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            💡 About This Session
          </h2>
          <p className="text-gray-600 text-sm mt-2 leading-relaxed">
            In this session, the AI will generate interview questions
            dynamically based on your uploaded resume and job description,
            creating a personalized interview experience. Focus on explaining
            your experiences clearly and confidently.
          </p>
        </div>

        {/* Upload Resume Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-3 text-center">
            Upload Your Resume
          </h3>
          <p className="text-gray-500 text-sm mb-4 text-center">
            Upload your resume in PDF or DOCX format to receive tailored
            interview questions.
          </p>

          {!uploadedFile ? (
            <div
              onClick={handleFileUploadClick}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 cursor-pointer hover:bg-gray-50 hover:border-indigo-400 transition text-center"
            >
              {resumeUploadLoader ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 text-sm">
                    Analyzing your resume...
                  </p>
                </div>
              ) : (
                <>
                  <span className="text-gray-400 text-5xl block mb-4">📄</span>
                  <p className="text-indigo-600 text-base font-medium">
                    Drag & drop or <span className="underline">browse</span> to
                    upload
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    PDF, DOC, or DOCX (Max 10MB)
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="border-2 border-green-300 bg-green-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">✅</span>
                  <div>
                    <p className="font-medium text-gray-800">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleFileUploadClick}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium underline"
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
        </div>

        {/* Job Description Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Job Description (Optional)
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Paste the job description to get interview questions tailored to the
            specific role.
          </p>
          <textarea
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            placeholder="Paste the job description here... Include responsibilities, requirements, and skills."
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors"
            rows={6}
          />
          <p className="text-gray-400 text-xs mt-2">
            {jobDescription.length > 0 && `${jobDescription.length} characters`}
          </p>
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
            💬 Tips for Resume Interviews
          </h3>
          <ul className="list-disc text-sm pl-5 mt-3 space-y-2 text-gray-700">
            <li>Be ready to elaborate on every point in your resume.</li>
            <li>Connect experiences to the job&apos;s requirements.</li>
            <li>Use metrics and numbers wherever possible.</li>
            <li>Apply the STAR method for behavioral questions.</li>
          </ul>
        </div>

        {/* Features List */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">
            What to Expect:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white/90 text-sm">
            <div className="flex items-start gap-2">
              <span>✓</span>
              <span>Personalized questions based on your experience</span>
            </div>
            <div className="flex items-start gap-2">
              <span>✓</span>
              <span>Intelligent follow-up questions</span>
            </div>
            <div className="flex items-start gap-2">
              <span>✓</span>
              <span>Detailed feedback on your answers</span>
            </div>
            <div className="flex items-start gap-2">
              <span>✓</span>
              <span>Grammar and communication assessment</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        {uploadedFile && (
          <button
            onClick={onStartInterview}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
          >
            Start Interview 🚀
          </button>
        )}
      </div>
    </div>
  );
}
