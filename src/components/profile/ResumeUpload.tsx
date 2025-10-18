"use client";

import { authFetch } from "@/lib/api";
import { getBaseUrl } from "@/lib/utils";
import React, { useRef, useState } from "react";

interface ResumeUploadProps {
  onUploadSuccess: () => void;
}

export default function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type - Only PDF files are accepted per API docs
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setUploading(true);

    try {
      // Use the new unified endpoint that handles both upload AND PostgreSQL storage
      const formData = new FormData();
      formData.append("resume", file);

      // Optional: Add title (defaults to filename without .pdf if not provided)
      const title = file.name.replace(/\.pdf$/i, "");
      formData.append("title", title);

      // Optional: Set as primary (default: false)
      formData.append("is_primary", "false");

      const response = await authFetch(
        `${getBaseUrl()}/api/user/resumes/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload resume");
      }

      const data = await response.json();
      console.log("Upload response:", data);

      // Show success message with details
      const embeddingInfo = data.embeddings_created
        ? ` (${data.chunks} chunks embedded for AI)`
        : " (AI disabled)";

      alert(`Resume uploaded successfully!${embeddingInfo}`);
      onUploadSuccess();
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload resume. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          dragActive
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
        } ${uploading ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Uploading resume...</p>
          </div>
        ) : (
          <>
            <div className="text-6xl mb-4">📄</div>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              {dragActive
                ? "Drop your resume here"
                : "Drag & drop your resume here"}
            </p>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <button
              type="button"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse Files
            </button>
            <p className="text-xs text-gray-400 mt-4">
              Supported format: PDF only (Max 10MB)
            </p>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
