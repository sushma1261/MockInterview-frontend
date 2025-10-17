import { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`flex gap-4 mb-6 animate-[slideIn_0.3s_ease-out] ${
        message.type === "user" ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
        {message.type === "assistant" && "🤖"}
        {message.type === "user" && "👤"}
        {message.type === "system" && "ℹ️"}
      </div>

      {/* Message Content */}
      <div
        className={`max-w-[70%] px-5 py-4 shadow-sm ${
          message.type === "user"
            ? "bg-indigo-500 text-white rounded-[18px_18px_4px_18px]"
            : message.type === "assistant"
            ? "bg-gray-50 rounded-[18px_18px_18px_4px]"
            : "bg-amber-50 rounded-xl italic"
        }`}
      >
        {/* Question Badges */}
        {message.metadata?.question_number && (
          <div className="flex gap-2 mb-2">
            <span className="inline-block bg-indigo-500 text-white px-3 py-1 rounded-xl text-xs font-semibold">
              Q{message.metadata.question_number}
            </span>
            {message.metadata.question_type && (
              <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-xl text-xs font-semibold capitalize">
                {message.metadata.question_type}
              </span>
            )}
          </div>
        )}

        {/* Message Text */}
        <div className="leading-relaxed">{message.content}</div>

        {/* Reasoning */}
        {message.metadata?.reasoning && (
          <div className="mt-3 p-3 bg-indigo-50 rounded-lg text-sm text-gray-700">
            💡 {message.metadata.reasoning}
          </div>
        )}

        {/* Timestamp */}
        <div className="mt-2 text-xs text-gray-400">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
