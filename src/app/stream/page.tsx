"use client";

import { useState } from "react";
import { useStreamingChat } from "../hooks/useStreaming";

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const { response, isStreaming, error, streamChat, reset } = useStreamingChat({
    onChunk: (text) => console.log("Received chunk:", text),
    onComplete: (fullText) => console.log("Complete response:", fullText),
    onError: (err) => console.error("Error:", err),
    wordDelayMs: 50,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    await streamChat(question);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="w-full p-2 border rounded"
          rows={3}
          disabled={isStreaming}
        />
        <button
          type="submit"
          disabled={isStreaming}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {isStreaming ? "Streaming..." : "Send"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white rounded"
        >
          Reset
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          Error: {error.message}
        </div>
      )}

      {response && (
        <div className="p-4 bg-gray-100 rounded whitespace-pre-wrap">
          {response}
          {isStreaming && <span className="animate-pulse">▊</span>}
        </div>
      )}
    </div>
  );
}
