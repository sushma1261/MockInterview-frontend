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
  return (
    <div className="w-[400px] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col max-lg:fixed max-lg:inset-0 max-lg:z-50 max-lg:w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-6 flex justify-between items-center">
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
          <h3 className="text-gray-800 text-lg font-semibold mb-4">
            Confidence Score
          </h3>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center text-white shadow-lg shadow-indigo-300">
              <span className="text-3xl font-bold">
                {feedback.confidence_score}
              </span>
              <span className="text-sm opacity-80">/10</span>
            </div>
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                style={{ width: `${feedback.confidence_score * 10}%` }}
              />
            </div>
          </div>
        </div>

        {/* Strengths */}
        <div className="mb-8">
          <h3 className="text-gray-800 text-lg font-semibold mb-4">
            💪 Strengths
          </h3>
          <ul className="space-y-2">
            {feedback.strengths.map((strength, idx) => (
              <li
                key={idx}
                className="p-3 bg-emerald-50 text-emerald-900 rounded-lg border-l-4 border-emerald-500 leading-relaxed"
              >
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Grammar Assessment */}
        <div className="mb-8">
          <h3 className="text-gray-800 text-lg font-semibold mb-4">
            ✍️ Communication & Grammar
          </h3>
          <p className="p-4 bg-gray-50 rounded-lg leading-relaxed text-gray-700">
            {feedback.grammar_assessment}
          </p>
        </div>

        {/* Content Quality */}
        <div className="mb-8">
          <h3 className="text-gray-800 text-lg font-semibold mb-4">
            📝 Content Quality
          </h3>
          <p className="p-4 bg-gray-50 rounded-lg leading-relaxed text-gray-700">
            {feedback.content_quality}
          </p>
        </div>

        {/* Improvement Suggestions */}
        <div className="mb-8">
          <h3 className="text-gray-800 text-lg font-semibold mb-4">
            🎯 Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {feedback.improvement_suggestions.map((suggestion, idx) => (
              <li
                key={idx}
                className="p-3 bg-amber-50 text-amber-900 rounded-lg border-l-4 border-amber-500 leading-relaxed"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        {/* Final Feedback */}
        {feedback.is_final && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl text-center">
            <p className="mb-4 text-lg">
              🎉 This is your final feedback. Great job completing the
              interview!
            </p>
            <button
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
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
