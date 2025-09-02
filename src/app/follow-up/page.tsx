"use client";

import { useState } from "react";
import { getBaseUrl } from "../utils/utils";

const baseUrl = `${getBaseUrl()}/interview`;

export default function Home() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    const res = await fetch(`${baseUrl}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "Tell me about yourself" }),
    });
    const data = await res.json();
    setSessionId(data.sessionId);
    setQuestion(data.question);
  };

  const submitAnswer = async () => {
    if (!sessionId) return;
    setLoading(true);
    const res = await fetch(`${baseUrl}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, answer }),
    });
    const data = await res.json();
    setFollowUps((prev) => [...prev, question + " → " + answer]);
    setQuestion(data.followUp);
    setAnswer("");
    setLoading(false);
  };

  const endInterview = async () => {
    if (!sessionId) return;
    const res = await fetch(`${baseUrl}/end`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const data = await res.json();
    setFeedback(data.feedback);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎤 Mock Interview</h1>

      {!sessionId && (
        <button
          onClick={startInterview}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Start Interview
        </button>
      )}

      {sessionId && !feedback && (
        <div className="space-y-4">
          <p className="text-lg font-semibold">❓ {question}</p>
          <textarea
            className="w-full border p-2 rounded"
            rows={4}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={submitAnswer}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              {loading ? "Thinking..." : "Submit Answer"}
            </button>
            <button
              onClick={endInterview}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              End Interview
            </button>
          </div>

          <div className="mt-4">
            <h2 className="font-bold">Previous Q&A</h2>
            <ul className="list-disc ml-6">
              {followUps.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {feedback && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h2 className="font-bold text-xl">📊 Interview Feedback</h2>
          <p className="whitespace-pre-line">{feedback}</p>
        </div>
      )}
    </div>
  );
}
