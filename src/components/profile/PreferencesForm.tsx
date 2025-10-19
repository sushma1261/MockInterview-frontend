"use client";

import { preferencesApi } from "@/lib/api";
import { UpdatePreferencesRequest, UserPreferences } from "@/types/profile";
import React, { useEffect, useState } from "react";

interface PreferencesFormProps {
  preferences: UserPreferences | null;
  onUpdate: () => void;
}

export default function PreferencesForm({
  preferences,
  onUpdate,
}: PreferencesFormProps) {
  const [formData, setFormData] = useState<UpdatePreferencesRequest>({
    interview_difficulty: "medium",
    interview_duration: 30,
    preferred_languages: [],
    theme: "light",
    notification_enabled: true,
  });
  const [languageInput, setLanguageInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (preferences) {
      setFormData({
        interview_difficulty: preferences.interview_difficulty,
        interview_duration: preferences.interview_duration,
        preferred_languages: preferences.preferred_languages || [],
        theme: preferences.theme,
        notification_enabled: preferences.notification_enabled,
      });
    }
  }, [preferences]);

  const handleAddLanguage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && languageInput.trim()) {
      e.preventDefault();
      const newLanguage = languageInput.trim();

      if (!formData.preferred_languages?.includes(newLanguage)) {
        setFormData({
          ...formData,
          preferred_languages: [
            ...(formData.preferred_languages || []),
            newLanguage,
          ],
        });
      }
      setLanguageInput("");
    }
  };

  const handleRemoveLanguage = (language: string) => {
    setFormData({
      ...formData,
      preferred_languages: formData.preferred_languages?.filter(
        (lang) => lang !== language
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await preferencesApi.updatePreferences(formData);
      alert("Preferences updated successfully!");
      onUpdate();
    } catch (error) {
      console.error("Error updating preferences:", error);
      alert("Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Interview Difficulty */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Interview Difficulty
        </label>
        <select
          value={formData.interview_difficulty}
          onChange={(e) =>
            setFormData({
              ...formData,
              interview_difficulty: e.target.value as
                | "easy"
                | "medium"
                | "hard",
            })
          }
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Interview Duration */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Interview Duration (minutes)
        </label>
        <input
          type="number"
          min="15"
          max="120"
          step="15"
          value={formData.interview_duration}
          onChange={(e) =>
            setFormData({
              ...formData,
              interview_duration: parseInt(e.target.value),
            })
          }
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <p className="text-xs text-gray-500 mt-1">Recommended: 30-60 minutes</p>
      </div>

      {/* Preferred Languages */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Preferred Programming Languages
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.preferred_languages?.map((language) => (
            <span
              key={language}
              className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {language}
              <button
                type="button"
                onClick={() => handleRemoveLanguage(language)}
                className="hover:text-indigo-600 transition-colors"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={languageInput}
          onChange={(e) => setLanguageInput(e.target.value)}
          onKeyDown={handleAddLanguage}
          placeholder="Type a language and press Enter"
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <p className="text-xs text-gray-500 mt-1">
          Press Enter to add a language (e.g., JavaScript, Python, Java)
        </p>
      </div>

      {/* Theme */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Theme
        </label>
        <select
          value={formData.theme}
          onChange={(e) =>
            setFormData({
              ...formData,
              theme: e.target.value as "light" | "dark",
            })
          }
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="light">☀️ Light</option>
          <option value="dark">🌙 Dark</option>
        </select>
      </div>

      {/* Notifications */}
      {/* <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="notifications"
          checked={formData.notification_enabled}
          onChange={(e) =>
            setFormData({
              ...formData,
              notification_enabled: e.target.checked,
            })
          }
          className="w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
        />
        <label
          htmlFor="notifications"
          className="text-sm font-semibold text-gray-700 cursor-pointer"
        >
          Enable Notifications
        </label>
      </div> */}

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>💾 Save Preferences</>
          )}
        </button>
      </div>
    </form>
  );
}
