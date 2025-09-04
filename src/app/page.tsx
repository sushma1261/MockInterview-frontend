"use client";

import { authFetch } from "@/app/lib/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Question } from "./interface/question";
import { getBaseUrl } from "./utils/utils";

const baseUrl = getBaseUrl();
const baseUrlI = `${baseUrl}/interview`;

export default function QuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);

  const startInterview = async (question: string) => {
    const res = await authFetch(`${baseUrlI}/start`, {
      method: "POST",
      body: JSON.stringify({ question }),
    });
    const data = await res.json();

    // redirect to Answer Session
    router.push(
      `/session/${data.sessionId}?question=${encodeURIComponent(data.question)}`
    );
  };

  useEffect(() => {
    axios.get(`${baseUrl}/api/questions`).then((response) => {
      setQuestions(response.data.questions);
    });
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome to MockItUp</h1>
      <p className="mb-6 text-gray-600">
        Practice your interview skills with confidence. Select a question below
        to start.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((q) => (
          <div key={q.id} className="border rounded p-4 shadow-sm bg-white">
            <span className="text-sm text-green-600 font-semibold">
              {q.level}
            </span>
            <p className="mt-2 font-medium">{q.text}</p>
            <p className="text-xs text-gray-500">{q.type}</p>
            <button
              onClick={() => startInterview(q.text)}
              className="mt-3 px-3 py-1 border border-blue-500 text-blue-500 rounded"
            >
              Answer this question
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
