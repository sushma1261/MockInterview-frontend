"use client";

import { useTheme } from "@/app/utils/ThemeContext";
import { SessionMessage } from "@/lib/historyApi";

interface ConversationViewProps {
  messages: SessionMessage[];
}

export default function ConversationView({ messages }: ConversationViewProps) {
  const { theme } = useTheme();

  const bgCard =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMessageStyle = (role: string) => {
    if (role === "user") {
      return theme === "dark"
        ? "bg-indigo-900/40 border-indigo-700"
        : "bg-indigo-50 border-indigo-200";
    } else if (role === "assistant") {
      return theme === "dark"
        ? "bg-gray-700 border-gray-600"
        : "bg-gray-50 border-gray-200";
    } else {
      return theme === "dark"
        ? "bg-amber-900/30 border-amber-700"
        : "bg-amber-50 border-amber-200";
    }
  };

  const getMessageIcon = (role: string, messageType: string) => {
    if (role === "user") return "👤";
    if (messageType === "ask_next_question") return "❓";
    if (messageType === "feedback") return "📝";
    if (messageType === "final_feedback") return "🎯";
    return "🤖";
  };

  return (
    <div className={`${bgCard} border rounded-xl p-6`}>
      <h3
        className={`text-lg font-semibold ${textPrimary} mb-4 flex items-center gap-2`}
      >
        💬 Conversation History
      </h3>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className={textSecondary}>No messages in this session</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`border ${getMessageStyle(
                message.role
              )} rounded-lg p-4`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">
                  {getMessageIcon(message.role, message.message_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${textPrimary} text-sm`}>
                        {message.role === "user"
                          ? "You"
                          : message.role === "assistant"
                          ? "AI Interviewer"
                          : "System"}
                      </span>
                      {message.question_number && (
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            theme === "dark"
                              ? "bg-indigo-900/50 text-indigo-300"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          Q{message.question_number}
                        </span>
                      )}
                      {message.question_type && (
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            theme === "dark"
                              ? "bg-gray-600 text-gray-300"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {message.question_type}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs ${textSecondary}`}>
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                  <p className={`${textPrimary} text-sm whitespace-pre-wrap`}>
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
