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
  return (
    <div className="bg-white/95 backdrop-blur-md px-8 py-6 shadow-lg flex justify-between items-center z-10">
      <h1 className="text-2xl font-bold text-gray-800">
        Mocky - Your Interview Assistant
      </h1>
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-3">
          <span className="bg-indigo-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
            Question {currentQuestionNumber}
          </span>
        </div>
        {!interviewComplete && (
          <button
            className="bg-white text-indigo-500 px-4 py-2 rounded-lg border-2 border-indigo-500 text-sm font-semibold hover:bg-indigo-500 hover:text-white transition-colors disabled:opacity-50"
            onClick={onRequestFeedback}
            disabled={isLoading}
          >
            Get Feedback
          </button>
        )}
        <button
          className="bg-white text-indigo-500 px-4 py-2 rounded-lg border-2 border-indigo-500 text-sm font-semibold hover:bg-indigo-500 hover:text-white transition-colors disabled:opacity-50"
          onClick={onRestart}
          disabled={isLoading}
        >
          Restart
        </button>
      </div>
    </div>
  );
}
