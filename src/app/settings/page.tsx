"use client";

import { useTheme } from "@/app/utils/ThemeContext";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
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
          <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>Settings</h1>
          <p className={`${textSecondary}`}>Customize your experience</p>
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3`}>
              Coming Soon
            </h2>
            <p className={`${textSecondary} max-w-md mx-auto mb-8`}>
              We&apos;re creating a powerful settings panel to give you complete
              control over your iHyre experience.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
              <div className={`${featureBg} rounded-lg p-4 text-left`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🔔</span>
                  <div>
                    <h3 className={`font-semibold ${textPrimary} mb-1`}>
                      Notifications
                    </h3>
                    <p className={`text-sm ${textSecondary}`}>
                      Manage alerts and reminders
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${featureBg} rounded-lg p-4 text-left`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎨</span>
                  <div>
                    <h3 className={`font-semibold ${textPrimary} mb-1`}>
                      Appearance
                    </h3>
                    <p className={`text-sm ${textSecondary}`}>
                      Customize themes and colors
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${featureBg} rounded-lg p-4 text-left`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <h3 className={`font-semibold ${textPrimary} mb-1`}>
                      Privacy & Security
                    </h3>
                    <p className={`text-sm ${textSecondary}`}>
                      Control your data and privacy
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${featureBg} rounded-lg p-4 text-left`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <h3 className={`font-semibold ${textPrimary} mb-1`}>
                      Language & Region
                    </h3>
                    <p className={`text-sm ${textSecondary}`}>
                      Set your preferences
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
              Start Practicing
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
            <span className={`font-semibold ${textPrimary}`}>
              Your feedback matters!
            </span>{" "}
            Let us know what settings you&apos;d like to see.
          </p>
        </div>
      </div>
    </div>
  );
}
