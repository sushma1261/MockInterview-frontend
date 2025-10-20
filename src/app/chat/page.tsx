"use client";

import ChatInterface from "@/components/chat/ChatInterface";
import { useSearchParams } from "next/navigation";
import React from "react";

const InterviewChat: React.FC = () => {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resumeId");

  return <ChatInterface resumeId={resumeId} showResumeUpload={true} />;
};

export default InterviewChat;
