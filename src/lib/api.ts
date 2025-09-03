"use client";

import { auth } from "@/lib/firebase";

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    alert("No auth token found. Please log in.");
    throw new Error("No auth token found. User not logged in.");
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
