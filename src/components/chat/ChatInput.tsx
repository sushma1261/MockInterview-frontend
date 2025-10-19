"use client";

import { useTheme } from "@/app/utils/ThemeContext";
import React, { useRef } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onSkip: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  onSkip,
  isLoading,
  disabled = false,
}: ChatInputProps) {
  const { theme } = useTheme();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const bgInput =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const inputBorder = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-800";

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      className={`${bgInput} border-t px-8 py-4 shadow-sm flex gap-4 items-end transition-colors`}
    >
      {/* Skip Button */}
      <div className="flex flex-col gap-2">
        <button
          className={`${
            theme === "dark"
              ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
          } px-4 py-2 rounded-lg text-sm font-semibold border transition-colors disabled:opacity-50`}
          onClick={onSkip}
          disabled={isLoading || disabled}
          title="Skip to next question"
        >
          ⏭️ Skip
        </button>
      </div>

      {/* Text Input */}
      <textarea
        ref={inputRef}
        className={`flex-1 border-2 ${inputBorder} ${
          theme === "dark" ? "bg-gray-700" : "bg-white"
        } ${textPrimary} rounded-xl px-4 py-3 text-base resize-none focus:outline-none focus:border-indigo-600 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors`}
        placeholder="Type your answer here... (Press Enter to send, Shift+Enter for new line)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading || disabled}
        rows={3}
      />

      {/* Send Button */}
      <button
        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onSend}
        disabled={isLoading || !value.trim() || disabled}
      >
        {isLoading ? "⏳" : "📤"} Send
      </button>
    </div>
  );
}
