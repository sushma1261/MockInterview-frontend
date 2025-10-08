"use client";

import { useRouter } from "next/navigation";

interface ComingSoonProps {
  title?: string;
  description?: string;
  icon?: string;
  features?: Array<{
    emoji: string;
    title: string;
    description: string;
  }>;
}

export default function ComingSoon({
  title = "Coming Soon",
  description = "We're working hard to bring you this amazing feature. Stay tuned!",
  icon = "🚀",
  features = [
    {
      emoji: "✨",
      title: "Amazing Features",
      description: "Exciting functionality coming your way",
    },
    {
      emoji: "⚡",
      title: "Lightning Fast",
      description: "Optimized for performance",
    },
    {
      emoji: "🎯",
      title: "User Focused",
      description: "Built with you in mind",
    },
    {
      emoji: "🔒",
      title: "Secure & Private",
      description: "Your data is protected",
    },
  ],
}: ComingSoonProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-center">
            <div className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <span className="text-6xl">{icon}</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
            <p className="text-white/90 text-lg">{description}</p>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-4">
                <span className="text-4xl">⏳</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Almost There!
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
                Our team is putting the finishing touches on this feature. It
                will be worth the wait!
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100"
                >
                  <div className="text-3xl mb-2">{feature.emoji}</div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
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
              Go to Home
            </button>
          </div>
        </div>

        {/* Info Banner */}
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
                <span className="font-semibold">Want to be notified?</span>{" "}
                We&apos;ll let you know as soon as this feature goes live! 🎉
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
