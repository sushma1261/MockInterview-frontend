"use client";

import { useState } from "react";
import AnswerForm from "./answers/AnswerForm";
import QuestionList from "./questions/QuestionsList";
import VideoRecorder from "./video/VideoRecorder";

export default function HomePage() {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mock Interview App</h1>

      {!selectedQuestion ? (
        <QuestionList onSelect={setSelectedQuestion} />
      ) : (
        <>
          <AnswerForm question={selectedQuestion} />
          <VideoRecorder />
        </>
      )}
    </main>
  );
}
