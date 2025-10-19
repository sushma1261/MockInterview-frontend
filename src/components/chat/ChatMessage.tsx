"use client";

import { useTheme } from "@/app/utils/ThemeContext";
import { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { theme } = useTheme();

  const userBg = "bg-indigo-600 text-white";
  const assistantBg =
    theme === "dark"
      ? "bg-gray-700 text-gray-100"
      : "bg-gray-100 text-gray-800";
  const systemBg =
    theme === "dark"
      ? "bg-amber-900/30 text-amber-300"
      : "bg-amber-50 text-amber-900";

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
            ? `${userBg} rounded-[18px_18px_4px_18px]`
            : message.type === "assistant"
            ? `${assistantBg} rounded-[18px_18px_18px_4px]`
            : `${systemBg} rounded-xl italic`
        }`}
      >
        {/* Question Badges */}
        {message.metadata?.question_number && (
          <div className="flex gap-2 mb-2">
            <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-xl text-xs font-semibold">
              Q{message.metadata.question_number}
            </span>
            {message.metadata.question_type && (
              <span
                className={`inline-block ${
                  theme === "dark"
                    ? "bg-gray-600 text-gray-200"
                    : "bg-gray-200 text-gray-700"
                } px-3 py-1 rounded-xl text-xs font-semibold capitalize`}
              >
                {message.metadata.question_type}
              </span>
            )}
          </div>
        )}

        {/* Message Text */}
        <div className="leading-relaxed">{message.content}</div>

        {/* Reasoning */}
        {message.metadata?.reasoning && (
          <div
            className={`mt-3 p-3 ${
              theme === "dark"
                ? "bg-indigo-900/30 text-gray-300"
                : "bg-indigo-50 text-gray-700"
            } rounded-lg text-sm`}
          >
            💡 {message.metadata.reasoning}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`mt-2 text-xs ${
            message.type === "user"
              ? "text-white/60"
              : theme === "dark"
              ? "text-gray-500"
              : "text-gray-400"
          }`}
        >
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
