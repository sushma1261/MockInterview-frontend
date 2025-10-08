"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/chat");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-center">
            <div className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-6xl font-bold text-white mb-2">404</h1>
            <p className="text-white/90 text-xl">Page Not Found</p>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-4">
                <span className="text-5xl">🔍</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Oops! Page Not Found
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-md mx-auto mb-4">
                The page you&apos;re looking for doesn&apos;t exist or has been
                moved. Don&apos;t worry, let&apos;s get you back on track!
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-600 font-medium">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Redirecting in {countdown}s
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => router.push("/")}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-2">🏠</div>
                <h3 className="font-semibold text-gray-800 mb-1">Home</h3>
                <p className="text-sm text-gray-600">Go to homepage</p>
              </button>

              <button
                onClick={() => router.push("/chat")}
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-2">🎤</div>
                <h3 className="font-semibold text-gray-800 mb-1">Interview</h3>
                <p className="text-sm text-gray-600">Start practicing</p>
              </button>

              <button
                onClick={() => router.back()}
                className="bg-gradient-to-br from-pink-50 to-indigo-50 p-4 rounded-xl border border-pink-100 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-2">⬅️</div>
                <h3 className="font-semibold text-gray-800 mb-1">Go Back</h3>
                <p className="text-sm text-gray-600">Previous page</p>
              </button>
            </div>

            {/* Primary CTA */}
            <button
              onClick={() => router.push("/")}
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Take Me Home
            </button>
          </div>
        </div>

        {/* Help Banner */}
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
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Need help?</span> If you believe
                this is an error, please contact our support team. 💬
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
