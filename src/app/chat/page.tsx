"use client";

import ChatInterface from "@/components/chat/ChatInterface";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const InterviewChatInner: React.FC = () => {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resumeId");

  return <ChatInterface resumeId={resumeId} showResumeUpload={true} />;
};

const InterviewChat: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <InterviewChatInner />
    </Suspense>
  );
};

export default InterviewChat;
