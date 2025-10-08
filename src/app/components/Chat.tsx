"use client";
import { useState } from "react";
import FeedbackCard from "../components/Feedback";
import { authFetch } from "../lib/api";

interface Message {
  sender: "user" | "bot" | "system";
  text: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const sendAnswer = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user" as const, text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Call backend API (mock example below)
      const response = await authFetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: input }),
      });
      const data = await response.json();

      if (data.feedback) {
        setFeedback(JSON.stringify(data.feedback));
      } else if (data.question) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.question },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "system", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6 flex">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Interview Session
        </h2>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2 bg-gray-50 rounded-lg min-h-0">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg max-w-[75%] ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : msg.sender === "bot"
                  ? "bg-gray-200 text-gray-800"
                  : "bg-yellow-100 text-gray-700 text-sm mx-auto"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <p className="text-gray-400 italic">Thinking...</p>}
        </div>

        {/* Input */}
        {!feedback && (
          <div className="flex gap-2 flex-shrink-0">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
              placeholder="Type your answer..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendAnswer()}
            />
            <button
              onClick={sendAnswer}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              Send
            </button>
          </div>
        )}

        {/* Feedback */}
        {feedback && <FeedbackCard feedback={JSON.parse(feedback)} />}
      </div>
    </div>
  );
};

export default Chat;
