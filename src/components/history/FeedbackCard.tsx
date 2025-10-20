"use client";

import { useTheme } from "@/app/utils/ThemeContext";
import { QuestionFeedback } from "@/lib/historyApi";

interface FeedbackCardProps {
  feedback: QuestionFeedback;
}

export default function FeedbackCard({ feedback }: FeedbackCardProps) {
  const { theme } = useTheme();

  const bgCard =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    if (score >= 4) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className={`${bgCard} border rounded-xl p-5`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                theme === "dark"
                  ? "bg-indigo-900/50 text-indigo-300"
                  : "bg-indigo-100 text-indigo-700"
              }`}
            >
              Question {feedback.question_number}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {feedback.question_type}
            </span>
          </div>
          <h4 className={`text-base font-semibold ${textPrimary}`}>
            {feedback.question_text}
          </h4>
        </div>
        <div className="text-right ml-4">
          <div
            className={`text-3xl font-bold ${getScoreColor(feedback.score)}`}
          >
            {feedback.score}
            <span className="text-lg">/10</span>
          </div>
          <div className={`text-xs ${getScoreColor(feedback.score)}`}>
            {getScoreLabel(feedback.score)}
          </div>
        </div>
      </div>

      {/* Your Answer */}
      <div className="mb-4">
        <h5 className={`text-sm font-semibold ${textPrimary} mb-2`}>
          Your Answer:
        </h5>
        <p
          className={`${textSecondary} text-sm p-3 rounded-lg ${
            theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
          }`}
        >
          {feedback.user_answer}
        </p>
      </div>

      {/* Feedback */}
      <div className="mb-4">
        <h5 className={`text-sm font-semibold ${textPrimary} mb-2`}>
          Feedback:
        </h5>
        <p className={`${textSecondary} text-sm`}>{feedback.feedback_text}</p>
      </div>

      {/* Strengths and Areas for Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        {feedback.strengths && feedback.strengths.length > 0 && (
          <div
            className={`p-3 rounded-lg ${
              theme === "dark"
                ? "bg-green-900/20 border-green-700"
                : "bg-green-50 border-green-200"
            } border`}
          >
            <h5
              className={`text-sm font-semibold mb-2 flex items-center gap-1 ${
                theme === "dark" ? "text-green-300" : "text-green-700"
              }`}
            >
              <span>✅</span> Strengths
            </h5>
            <ul className="space-y-1">
              {feedback.strengths.map((strength, index) => (
                <li
                  key={index}
                  className={`text-xs flex items-start gap-2 ${
                    theme === "dark" ? "text-green-200" : "text-green-900"
                  }`}
                >
                  <span className="mt-0.5">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas for Improvement */}
        {feedback.areas_for_improvement &&
          feedback.areas_for_improvement.length > 0 && (
            <div
              className={`p-3 rounded-lg ${
                theme === "dark"
                  ? "bg-amber-900/20 border-amber-700"
                  : "bg-amber-50 border-amber-200"
              } border`}
            >
              <h5
                className={`text-sm font-semibold mb-2 flex items-center gap-1 ${
                  theme === "dark" ? "text-amber-300" : "text-amber-700"
                }`}
              >
                <span>💡</span> Areas for Improvement
              </h5>
              <ul className="space-y-1">
                {feedback.areas_for_improvement.map((area, index) => (
                  <li
                    key={index}
                    className={`text-xs flex items-start gap-2 ${
                      theme === "dark" ? "text-amber-200" : "text-amber-900"
                    }`}
                  >
                    <span className="mt-0.5">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
}
