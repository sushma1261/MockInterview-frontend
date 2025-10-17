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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="bg-white px-8 py-4 shadow-lg flex gap-4 items-end">
      {/* Skip Button */}
      <div className="flex flex-col gap-2">
        <button
          className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50"
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
        className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-base resize-none focus:outline-none focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
        placeholder="Type your answer here... (Press Enter to send, Shift+Enter for new line)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading || disabled}
        rows={3}
      />

      {/* Send Button */}
      <button
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        onClick={onSend}
        disabled={isLoading || !value.trim() || disabled}
      >
        {isLoading ? "⏳" : "📤"} Send
      </button>
    </div>
  );
}
