"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../utils/AuthContext";

export default function Navbar() {
  const { user, login, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get initials from name
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

  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-white">
      <h1 className="text-xl font-bold">Mock Interview</h1>
      <div className="relative" ref={menuRef}>
        {user ? (
          <>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white font-bold bg-pink-400"
            >
              {getInitials()}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </>
        ) : (
          <button
            onClick={login}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
