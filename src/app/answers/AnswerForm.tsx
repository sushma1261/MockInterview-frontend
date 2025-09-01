"use client";

import { useState } from "react";

interface AnswerFormProps {
  question: string;
}

interface Feedback {
  confidence: number;
  grammar: string;
  content_quality: string;
  improvement_suggestions: string[];
}

export default function AnswerForm({ question }: AnswerFormProps) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });

      const data = await res.json();
      setFeedback(data.reply);
    } catch (err) {
      console.error("Error submitting answer", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">{question}</h3>
      <form onSubmit={handleSubmit} className="space-y-3 mt-2">
        <textarea
          className="w-full p-2 border rounded-md"
          rows={4}
          placeholder="Type your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Get Feedback"}
        </button>
      </form>

      {feedback && (
        <div className="mt-4 bg-gray-50 p-3 rounded-md">
          <p>
            <strong>Confidence:</strong> {feedback.confidence}/10
          </p>
          <p>
            <strong>Grammar:</strong> {feedback.grammar}
          </p>
          <p>
            <strong>Content Quality:</strong> {feedback.content_quality}
          </p>
          <p className="font-semibold">Suggestions:</p>
          <ul className="list-disc pl-5">
            {feedback.improvement_suggestions?.map((s: string, idx: number) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
