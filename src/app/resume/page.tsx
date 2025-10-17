"use client";
import Chat from "@/components/Chat";
import ResumeUpload from "@/components/ResumeUpload";
import { useState } from "react";

export default function App() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6">
      {!file ? <ResumeUpload onUpload={setFile} /> : <Chat />}
    </div>
  );
}
