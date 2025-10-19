"use client";

import { resumeApi } from "@/lib/api";
import { Resume } from "@/types/profile";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ResumeListProps {
  resumes: Resume[];
  onUpdate: () => void;
  onUploadClick?: () => void;
}

export default function ResumeList({
  resumes,
  onUpdate,
  onUploadClick,
}: ResumeListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const router = useRouter();

  // Format date consistently to avoid hydration issues
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };

  const handleSetPrimary = async (id: number) => {
    setLoading(id);
    setMenuOpen(null);
    try {
      await resumeApi.setPrimaryResume(id);
      onUpdate();
    } catch (error) {
      console.error("Error setting primary resume:", error);
      alert("Failed to set as primary");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    setLoading(id);
    setMenuOpen(null);
    try {
      await resumeApi.deleteResume(id);
      onUpdate();
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Failed to delete resume");
    } finally {
      setLoading(null);
    }
  };

  const handleSaveEdit = async (id: number) => {
    setLoading(id);
    try {
      await resumeApi.updateResume(id, { title: editTitle });
      setEditingId(null);
      onUpdate();
    } catch (error) {
      console.error("Error updating resume:", error);
      alert("Failed to update resume");
    } finally {
      setLoading(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const handleStartInterview = (resumeId: number) => {
    // Navigate to chat page with the resume ID as a query parameter
    router.push(`/chat?resumeId=${resumeId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Upload Card */}
      <button
        onClick={onUploadClick}
        className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-indigo-400 hover:bg-gray-50 transition-all flex flex-col items-center justify-center min-h-[280px] group"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
          <svg
            className="w-8 h-8 text-gray-400 group-hover:text-indigo-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">Upload New Resume</h3>
        <p className="text-sm text-gray-500 text-center">
          Drag & drop your resume file here, or click to browse
        </p>
      </button>

      {/* Resume Cards */}
      {resumes.map((resume) => (
        <div
          key={resume.id}
          className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow relative"
        >
          {/* Three-dot menu */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() =>
                setMenuOpen(menuOpen === resume.id ? null : resume.id)
              }
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {menuOpen === resume.id && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    setEditingId(resume.id);
                    setEditTitle(resume.title);
                    setMenuOpen(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Edit Title
                </button>
                {!resume.is_primary && (
                  <button
                    onClick={() => handleSetPrimary(resume.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Set as Primary
                  </button>
                )}
                <button
                  onClick={() => {
                    handleStartInterview(resume.id);
                    setMenuOpen(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Start Interview
                </button>
              </div>
            )}
          </div>

          {editingId === resume.id ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit(resume.id);
                  if (e.key === "Escape") handleCancelEdit();
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSaveEdit(resume.id)}
                  disabled={loading === resume.id}
                  className="flex-1 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Resume Title & File Name */}
              <div className="mb-4 pr-6">
                <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">
                  {resume.title}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {resume.file_name}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Uploaded: {formatDate(resume.created_at)}
                </p>
              </div>

              {/* Stats */}
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium text-gray-900">
                    {resume.file_size}
                  </span>
                </div>
                {/* <div className="flex justify-between text-sm">
                  <span className="text-gray-600">File Path:</span>
                  <span className="font-medium text-gray-900">
                    {resume.file_path}
                  </span>
                </div> */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  {resume.is_primary ? (
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      Primary
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      Not Primary
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleStartInterview(resume.id)}
                  disabled={loading === resume.id}
                  className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(resume.id)}
                  disabled={loading === resume.id}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </>
          )}

          {loading === resume.id && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
