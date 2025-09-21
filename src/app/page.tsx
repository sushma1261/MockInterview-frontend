"use client";

import { useRouter } from "next/navigation";

export default function QuestionsPage() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome to MockItUp</h1>
      <p className="mb-6 text-gray-600">
        Practice your interview skills with confidence. Do you want to get
        started?
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => router.push("/resume-parser")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 justify-self shadow-lg transition"
        >
          Continue
        </button>

        <button
          onClick={() => router.push("/voice")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow-lg transition"
        >
          Try Voice!
        </button>
      </div>
    </div>
  );
}
