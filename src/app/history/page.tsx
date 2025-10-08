"use client";

import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-center">
            <div className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <svg
                className="w-16 h-16 text-white animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Interview History
            </h1>
            <p className="text-white/90 text-lg">
              Track your progress and review past sessions
            </p>
          </div>

          {/* Content Section */}
          <div className="p-8 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-4">
                <span className="text-4xl">🚀</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Coming Soon!
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
                We&apos;re building an amazing feature to help you track all
                your interview sessions, review your performance, and monitor
                your progress over time.
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Performance Analytics
                </h3>
                <p className="text-sm text-gray-600">
                  Track your scores and improvements
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Past Sessions
                </h3>
                <p className="text-sm text-gray-600">
                  Review questions and answers
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-indigo-50 p-4 rounded-xl border border-pink-100">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Progress Tracking
                </h3>
                <p className="text-sm text-gray-600">
                  See how you&apos;re improving
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-pink-50 p-4 rounded-xl border border-indigo-100">
                <div className="text-3xl mb-2">💡</div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Insights & Tips
                </h3>
                <p className="text-sm text-gray-600">
                  Get personalized recommendations
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => router.push("/chat")}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Start a New Interview
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/80 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Stay tuned!</span> We&apos;ll
                notify you when the History feature is ready. In the meantime,
                keep practicing to improve your interview skills! 🎉
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
