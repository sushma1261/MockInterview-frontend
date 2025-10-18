"use client";

import { resumeApi } from "@/lib/api";
import { Resume } from "@/types/profile";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ResumeListProps {
  resumes: Resume[];
  onUpdate: () => void;
}

export default function ResumeList({ resumes, onUpdate }: ResumeListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState<number | null>(null);
  const router = useRouter();

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleSetPrimary = async (id: number) => {
    setLoading(id);
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

  const handleStartEdit = (resume: Resume) => {
    setEditingId(resume.id);
    setEditTitle(resume.title);
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

  if (resumes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-gray-600 font-medium">No resumes uploaded yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Upload your first resume to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          className={`bg-white border-2 rounded-xl p-4 transition-all ${
            resume.is_primary
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            {/* Resume Info */}
            <div className="flex-1 min-w-0">
              {editingId === resume.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-1 border-2 border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(resume.id);
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {resume.title}
                    </h3>
                    {resume.is_primary && (
                      <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Primary
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      📄 {resume.file_name}
                    </span>
                    <span className="flex items-center gap-1">
                      💾 {formatFileSize(resume.file_size)}
                    </span>
                    <span className="flex items-center gap-1">
                      📅{" "}
                      {new Date(resume.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Start Interview Button */}
                  <button
                    onClick={() => handleStartInterview(resume.id)}
                    className="mt-3 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    💬 Start Interview with this Resume
                  </button>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {editingId === resume.id ? (
                <>
                  <button
                    onClick={() => handleSaveEdit(resume.id)}
                    disabled={loading === resume.id}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    ✓ Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    ✕ Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleStartEdit(resume)}
                    disabled={loading === resume.id}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    title="Edit title"
                  >
                    ✏️ Edit
                  </button>

                  {!resume.is_primary && (
                    <button
                      onClick={() => handleSetPrimary(resume.id)}
                      disabled={loading === resume.id}
                      className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      title="Set as primary"
                    >
                      ⭐ Set Primary
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(resume.id)}
                    disabled={loading === resume.id}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    title="Delete resume"
                  >
                    🗑️ Delete
                  </button>
                </>
              )}

              {loading === resume.id && (
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
