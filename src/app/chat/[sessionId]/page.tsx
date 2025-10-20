"use client";

import ChatInterface from "@/components/chat/ChatInterface";
import { useParams } from "next/navigation";
import React from "react";

const SessionChatPage: React.FC = () => {
  const params = useParams();
  const sessionId = params?.sessionId as string;

  return (
    <ChatInterface
      sessionId={sessionId}
      showResumeUpload={false}
      showSessionBanner={true}
    />
  );
};

export default SessionChatPage;
