"use client";

import PreferencesForm from "@/components/profile/PreferencesForm";
import ResumeList from "@/components/profile/ResumeList";
import ResumeUpload from "@/components/profile/ResumeUpload";
import { preferencesApi, profileApi, resumeApi } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { Resume, UserPreferences, UserProfile } from "@/types/profile";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Tab = "profile" | "resumes" | "preferences";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    loadData();
  }, [user, router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileData, preferencesData, resumesData] = await Promise.all([
        profileApi.getProfile(),
        preferencesApi.getPreferences().catch(() => null),
        resumeApi.getResumes().catch(() => []),
      ]);

      setProfile(profileData);
      setPreferences(preferencesData);
      setResumes(resumesData);
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadResumes = async () => {
    try {
      const resumesData = await resumeApi.getResumes();
      setResumes(resumesData);
    } catch (error) {
      console.error("Error loading resumes:", error);
    }
  };

  const loadPreferences = async () => {
    try {
      const preferencesData = await preferencesApi.getPreferences();
      setPreferences(preferencesData);
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
                {profile?.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt={profile.display_name || "Profile"}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  "👤"
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-1">
                  {profile?.display_name || "User Profile"}
                </h1>
                <p className="text-white/90">{profile?.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-white">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "profile"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              👤 Profile Info
            </button>
            <button
              onClick={() => setActiveTab("resumes")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "resumes"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              📄 My Resumes
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "preferences"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              ⚙️ Preferences
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Profile Info Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profile?.display_name || ""}
                    readOnly
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile?.email || ""}
                    readOnly
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Member Since
                  </label>
                  <input
                    type="text"
                    value={
                      profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : ""
                    }
                    readOnly
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Login
                  </label>
                  <input
                    type="text"
                    value={
                      profile?.last_login
                        ? new Date(profile.last_login).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : ""
                    }
                    readOnly
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resumes Tab */}
          {activeTab === "resumes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Resumes</h2>
                <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {resumes.length} Resume{resumes.length !== 1 ? "s" : ""}
                </span>
              </div>

              <ResumeUpload onUploadSuccess={loadResumes} />

              <div className="pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Uploaded Resumes
                </h3>
                <ResumeList resumes={resumes} onUpdate={loadResumes} />
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Interview Preferences
              </h2>
              <PreferencesForm
                preferences={preferences}
                onUpdate={loadPreferences}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
