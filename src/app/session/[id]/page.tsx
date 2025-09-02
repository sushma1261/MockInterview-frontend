"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

const baseUrl = "https://mockinterview-backend-b4ek.onrender.com/interview";

export default function SessionPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const firstQuestion = searchParams.get("question") || "";

  const [question, setQuestion] = useState(firstQuestion);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitAnswer = async () => {
    setLoading(true);
    const res = await fetch(`${baseUrl}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: params.id, answer }),
    });
    const data = await res.json();
    setHistory((prev) => [...prev, `${question} → ${answer}`]);
    setQuestion(data.followUp);
    setAnswer("");
    setLoading(false);
  };

  const endInterview = async () => {
    const res = await fetch(`${baseUrl}/end`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: params.id }),
    });
    const data = await res.json();
    setFeedback(data.feedback);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {!feedback ? (
        <>
          <div className="border border-gray-100 rounded p-4 mtb-8">
            <h1 className="font-bold">Current Question</h1>
            <p className="mb-4 text-sm text-gray-500">{question}</p>
          </div>
          <div className="mt-8 border border-gray-100 rounded p-4 mb-8">
            <h1 className="font-bold">Your Answer</h1>
            <textarea
              className="w-full border p-2 rounded border-gray-300 text-sm"
              rows={10}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your detailed answer here, focusing on the STAR method (Situation, Task, Action, Result)..."
            />
          </div>
          <div className="flex justify-end mb-4">
            <button
              onClick={submitAnswer}
              disabled={loading || !answer.trim()}
              className="px-4 py-2 border border-green-500 text-green-500 rounded"
            >
              {loading ? "Thinking..." : "Submit Answer"}
            </button>
          </div>

          <div className="mt-6">
            <h3 className="font-bold">Previous Q&A</h3>
            <ul className="list-disc ml-6">
              {history.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <button
              onClick={endInterview}
              className="px-4 py-2 border border-red-500 text-red-500 rounded"
            >
              End Interview
            </button>
          </div>
        </>
      ) : (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-bold">Interview Feedback</h2>
          <p className="whitespace-pre-line">{feedback}</p>
        </div>
      )}
    </div>
  );
}
