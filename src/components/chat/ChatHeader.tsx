"use client";

import { useTheme } from "@/app/utils/ThemeContext";

interface ChatHeaderProps {
  currentQuestionNumber: number;
  onRequestFeedback: () => void;
  onRestart: () => void;
  isLoading: boolean;
  interviewComplete: boolean;
}

export default function ChatHeader({
  currentQuestionNumber,
  onRequestFeedback,
  onRestart,
  isLoading,
  interviewComplete,
}: ChatHeaderProps) {
  const { theme } = useTheme();

  const bgHeader =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-800";

  return (
    <div
      className={`${bgHeader} border-b px-8 py-6 shadow-sm flex justify-between items-center z-10 transition-colors`}
    >
      <h1 className={`text-2xl font-bold ${textPrimary}`}>
        <span className="text-indigo-600">iHyre</span> Interview
      </h1>
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-3">
          <span className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow">
            Question {currentQuestionNumber}
          </span>
        </div>
        {!interviewComplete && (
          <button
            className={`${
              theme === "dark"
                ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
                : "bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-50"
            } px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-colors disabled:opacity-50`}
            onClick={onRequestFeedback}
            disabled={isLoading}
          >
            Get Feedback
          </button>
        )}
        <button
          className={`${
            theme === "dark"
              ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
              : "bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-50"
          } px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-colors disabled:opacity-50`}
          onClick={onRestart}
          disabled={isLoading}
        >
          Restart
        </button>
      </div>
    </div>
  );
}
