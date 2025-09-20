"use client";

import { auth } from "@/app/lib/firebase";

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    alert("No auth token found. Please log in.");
    throw new Error("No auth token found. User not logged in.");
  }
  const headers: HeadersInit = {};

  // Only set Content-Type if body is not FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });
}
