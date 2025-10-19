"use client";

import { useTheme } from "@/app/utils/ThemeContext";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const { theme } = useTheme();
  const router = useRouter();

  const bgMain = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const bgCard =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const featureBg = theme === "dark" ? "bg-gray-700/50" : "bg-gray-50";

  return (
    <div className={`min-h-screen ${bgMain} p-6 transition-colors`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>
            Interview History
          </h1>
          <p className={`${textSecondary}`}>
            Track your progress and review past sessions
          </p>
        </div>

        {/* Main Content Card */}
        <div className={`rounded-xl border ${bgCard} p-8`}>
          {/* Coming Soon Message */}
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-6">
              <svg
                className="w-10 h-10 text-indigo-600 dark:text-indigo-400"
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
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3`}>
              Coming Soon
            </h2>
            <p className={`${textSecondary} max-w-md mx-auto mb-8`}>
              We&apos;re building an amazing feature to help you track all your
              interview sessions, review your performance, and monitor your
              progress over time.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
              <div className={`${featureBg} rounded-lg p-4 text-left`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">�</span>
                  <div>
                    <h3 className={`font-semibold ${textPrimary} mb-1`}>
                      Performance Analytics
                    </h3>
                    <p className={`text-sm ${textSecondary}`}>
                      Track your scores and improvements
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${featureBg} rounded-lg p-4 text-left`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h3 className={`font-semibold ${textPrimary} mb-1`}>
                      Past Sessions
                    </h3>
                    <p className={`text-sm ${textSecondary}`}>
                      Review questions and answers
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${featureBg} rounded-lg p-4 text-left`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📈</span>
                  <div>
                    <h3 className={`font-semibold ${textPrimary} mb-1`}>
                      Progress Tracking
                    </h3>
                    <p className={`text-sm ${textSecondary}`}>
                      See how you&apos;re improving
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${featureBg} rounded-lg p-4 text-left`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h3 className={`font-semibold ${textPrimary} mb-1`}>
                      Insights & Tips
                    </h3>
                    <p className={`text-sm ${textSecondary}`}>
                      Get personalized recommendations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => router.push("/chat")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow"
            >
              Start a New Interview
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div
          className={`mt-6 rounded-lg border ${bgCard} p-4 flex items-start gap-3`}
        >
          <svg
            className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5"
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
          <p className={`text-sm ${textSecondary}`}>
            <span className={`font-semibold ${textPrimary}`}>Stay tuned!</span>{" "}
            We&apos;ll notify you when the History feature is ready. In the
            meantime, keep practicing to improve your interview skills!
          </p>
        </div>
      </div>
    </div>
  );
}
