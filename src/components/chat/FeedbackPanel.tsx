"use client";

import { useTheme } from "@/app/utils/ThemeContext";
import { FeedbackData } from "@/types/chat";

interface FeedbackPanelProps {
  feedback: FeedbackData;
  onClose: () => void;
  onRestart: () => void;
}

export default function FeedbackPanel({
  feedback,
  onClose,
  onRestart,
}: FeedbackPanelProps) {
  const { theme } = useTheme();

  const bgCard =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";

  return (
    <div
      className={`w-[400px] ${bgCard} border rounded-xl shadow-lg overflow-hidden flex flex-col max-lg:fixed max-lg:inset-0 max-lg:z-50 max-lg:w-full transition-colors`}
    >
      {/* Header */}
      <div className="bg-indigo-600 text-white px-6 py-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">📊 Your Interview Feedback</h2>
        <button
          className="bg-white/20 hover:bg-white/30 text-white rounded-full w-8 h-8 flex items-center justify-center text-2xl transition-colors"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Confidence Score */}
        <div className="mb-8">
          <h3 className={`${textPrimary} text-lg font-semibold mb-4`}>
            Confidence Score
          </h3>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-indigo-600 flex flex-col items-center justify-center text-white shadow-lg">
              <span className="text-3xl font-bold">
                {feedback.confidence_score}
              </span>
              <span className="text-sm opacity-80">/10</span>
            </div>
            <div
              className={`flex-1 h-3 ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              } rounded-full overflow-hidden`}
            >
              <div
                className="h-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${feedback.confidence_score * 10}%` }}
              />
            </div>
          </div>
        </div>

        {/* Strengths */}
        <div className="mb-8">
          <h3 className={`${textPrimary} text-lg font-semibold mb-4`}>
            💪 Strengths
          </h3>
          <ul className="space-y-2">
            {feedback.strengths.map((strength, idx) => (
              <li
                key={idx}
                className={`p-3 ${
                  theme === "dark"
                    ? "bg-emerald-900/30 text-emerald-300 border-l-4 border-emerald-700"
                    : "bg-emerald-50 text-emerald-900 border-l-4 border-emerald-500"
                } rounded-lg leading-relaxed`}
              >
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Grammar Assessment */}
        <div className="mb-8">
          <h3 className={`${textPrimary} text-lg font-semibold mb-4`}>
            ✍️ Communication & Grammar
          </h3>
          <p
            className={`p-4 ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-50"
            } rounded-lg leading-relaxed ${textSecondary}`}
          >
            {feedback.grammar_assessment}
          </p>
        </div>

        {/* Content Quality */}
        <div className="mb-8">
          <h3 className={`${textPrimary} text-lg font-semibold mb-4`}>
            📝 Content Quality
          </h3>
          <p
            className={`p-4 ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-50"
            } rounded-lg leading-relaxed ${textSecondary}`}
          >
            {feedback.content_quality}
          </p>
        </div>

        {/* Improvement Suggestions */}
        <div className="mb-8">
          <h3 className={`${textPrimary} text-lg font-semibold mb-4`}>
            🎯 Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {feedback.improvement_suggestions.map((suggestion, idx) => (
              <li
                key={idx}
                className={`p-3 ${
                  theme === "dark"
                    ? "bg-amber-900/30 text-amber-300 border-l-4 border-amber-700"
                    : "bg-amber-50 text-amber-900 border-l-4 border-amber-500"
                } rounded-lg leading-relaxed`}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        {/* Final Feedback */}
        {feedback.is_final && (
          <div className="bg-indigo-600 text-white p-6 rounded-xl text-center">
            <p className="mb-4 text-lg">
              🎉 This is your final feedback. Great job completing the
              interview!
            </p>
            <button
              className={`${
                theme === "dark"
                  ? "bg-white text-indigo-600 hover:bg-gray-100"
                  : "bg-white text-indigo-600 hover:bg-gray-100"
              } px-6 py-3 rounded-lg font-semibold transition-colors`}
              onClick={onRestart}
            >
              Start New Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
