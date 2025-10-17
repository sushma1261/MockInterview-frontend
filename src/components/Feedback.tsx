import React from "react";

type Feedback = {
  confidence_score: number;
  grammar_assessment: string;
  content_quality: string;
  improvement_suggestions: string[];
};

interface FeedbackCardProps {
  feedback: Feedback;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
  return (
    <div className="mt-6 bg-white shadow-md rounded-xl p-6 space-y-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        📋 Interview Feedback
      </h3>

      {/* Confidence Score */}
      <div>
        <p className="font-medium text-gray-700 mb-1">Confidence Score</p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all"
            style={{ width: `${feedback.confidence_score * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {feedback.confidence_score} / 10
        </p>
      </div>

      {/* Grammar Assessment */}
      <div>
        <p className="font-medium text-gray-700 mb-1">Grammar Assessment</p>
        <p className="text-gray-600 bg-gray-50 p-3 rounded-md text-sm">
          {feedback.grammar_assessment}
        </p>
      </div>

      {/* Content Quality */}
      <div>
        <p className="font-medium text-gray-700 mb-1">Content Quality</p>
        <p className="text-gray-600 bg-gray-50 p-3 rounded-md text-sm">
          {feedback.content_quality}
        </p>
      </div>

      {/* Suggestions */}
      <div>
        <p className="font-medium text-gray-700 mb-2">
          Improvement Suggestions
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          {feedback.improvement_suggestions.map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeedbackCard;
