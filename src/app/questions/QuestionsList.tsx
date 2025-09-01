"use client";

import { useEffect, useState } from "react";

interface QuestionListProps {
  onSelect: (q: string) => void;
}

export default function QuestionList({ onSelect }: QuestionListProps) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8080/api/questions");
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error("Error fetching questions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) return <p>Loading questions...</p>;

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Choose a question:</h2>
      <ul className="space-y-2">
        {questions.map((q, idx) => (
          <li
            key={idx}
            className="p-2 border rounded-md cursor-pointer hover:bg-gray-100"
            onClick={() => onSelect(q)}
          >
            {q}
          </li>
        ))}
      </ul>
    </div>
  );
}
