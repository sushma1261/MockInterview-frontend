"use client";

import { useTheme } from "@/app/utils/ThemeContext";
import PreferencesForm from "@/components/profile/PreferencesForm";
import { preferencesApi, profileApi } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { UserPreferences, UserProfile } from "@/types/profile";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { theme } = useTheme();

  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    loadData();
  }, [user, router]);

  // Theme-based classes
  const bgMain = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const bgCard =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const textMain = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const textSub = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const inputBg =
    theme === "dark"
      ? "bg-gray-900 border-gray-700 text-gray-100"
      : "bg-gray-50 border-gray-300 text-gray-800";
  const avatarBg =
    theme === "dark"
      ? "bg-gray-700 text-gray-200"
      : "bg-gray-100 text-gray-700";
  const loadData = async () => {
    setLoading(true);
    try {
      const [profileData, preferencesData] = await Promise.all([
        profileApi.getProfile(),
        preferencesApi.getPreferences().catch(() => null),
      ]);
      setProfile(profileData);
      setPreferences(preferencesData);
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Removed resume logic

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
      <div
        className={`min-h-screen ${bgMain} flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`text-lg ${textSub}`}>Loading profile...</p>
        </div>
      </div>
    );
  }

  // if (!profile) {
  //   return (
  //     <div
  //       className={`min-h-screen ${bgMain} flex items-center justify-center`}
  //     >
  //       <div className={`text-lg ${textSub}`}>No profile data found.</div>
  //     </div>
  //   );
  // }

  return (
    <div className={`min-h-screen ${bgMain} p-4 transition-colors`}>
      <div className="max-w-xl mx-auto">
        {/* Profile Card */}
        <div className={`rounded-xl border ${bgCard} p-6 mb-6`}>
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${avatarBg}`}
            >
              {profile && profile.photo_url ? (
                <Image
                  src={profile.photo_url || ""}
                  alt={profile.display_name || "Profile"}
                  width={64}
                  height={64}
                  className="w-full h-full rounded-full object-cover"
                  priority
                />
              ) : (
                "👤"
              )}
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${textMain}`}>
                {profile?.display_name || "User Profile"}
              </h1>
              <p className={`text-sm ${textSub}`}>{profile?.email}</p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-4 mb-8">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${textSub}`}>
                Display Name
              </label>
              <input
                type="text"
                value={profile?.display_name || ""}
                readOnly
                className={`w-full px-3 py-2 border rounded ${inputBg}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${textSub}`}>
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ""}
                readOnly
                className={`w-full px-3 py-2 border rounded ${inputBg}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${textSub}`}>
                Member Since
              </label>
              <input
                type="text"
                value={
                  profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : ""
                }
                readOnly
                className={`w-full px-3 py-2 border rounded ${inputBg}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${textSub}`}>
                Last Login
              </label>
              <input
                type="text"
                value={
                  profile?.last_login
                    ? new Date(profile.last_login).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""
                }
                readOnly
                className={`w-full px-3 py-2 border rounded ${inputBg}`}
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <PreferencesForm
              preferences={preferences}
              onUpdate={loadPreferences}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
