"use client";

import { useTheme } from "@/app/utils/ThemeContext";
import { useAuth } from "@/lib/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const { theme } = useTheme();
  const { user, login, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = () => {
    if (!user) return "";
    if (user.displayName) {
      const parts = user.displayName.trim().split(" ");
      if (parts.length >= 2) {
        return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
      }
      return parts[0][0].toUpperCase();
    }
    return user.email ? user.email[0].toUpperCase() : "U";
  };

  // Get random gradient for avatar
  const getAvatarGradient = () => {
    const gradients = [
      "from-purple-500 to-pink-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500",
    ];
    const email = user?.email || "";
    const index = email.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <nav
      className={`sticky top-0 z-50 ${
        theme === "dark"
          ? "bg-gray-900 border-gray-700"
          : "bg-white/80 border-gray-200/50"
      } backdrop-blur-lg shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 group"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center group-hover:scale-105 transition-all duration-300`}
              >
                <span className="text-white font-bold text-xl">i</span>
              </div>
              <h1 className="text-2xl font-bold text-indigo-600 group-hover:scale-105 transition-transform duration-300">
                iHyre
              </h1>
            </button>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            {/* <button
              onClick={toggleTheme}
              className={`px-3 py-1 rounded border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-100 border-gray-700"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button> */}

            <div className="relative" ref={menuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-full transition-all duration-200 group"
                  >
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        width={40}
                        height={40}
                        className="rounded-full shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200 ring-2 ring-white object-cover"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${getAvatarGradient()} shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200 ring-2 ring-white`}
                      >
                        {getInitials()}
                      </div>
                    )}
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        menuOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden animate-[slideDown_0.2s_ease-out]">
                      {/* User Info in Dropdown */}
                      <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <p className="font-semibold text-gray-800 dark:text-gray-100">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Sign Out Only */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            logout();
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 flex items-center gap-3"
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
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span className="font-medium">Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={login}
                  className="px-6 py-2.5 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 hover:scale-105 transition-all duration-300 flex items-center gap-2"
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
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
}
