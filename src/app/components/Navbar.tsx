"use client";

import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, login, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center p-4 shadow-md">
      <h1 className="text-xl font-bold">Mock Interview</h1>
      <div>
        {user ? (
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={login}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
