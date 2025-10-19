"use client";

import { useTheme } from "@/app/utils/ThemeContext";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessage from "@/components/chat/ChatMessage";
import FeedbackPanel from "@/components/chat/FeedbackPanel";
import LoadingIndicator from "@/components/chat/LoadingIndicator";
import ResumeUploadSection from "@/components/chat/ResumeUploadSection";
import { useInterviewChat } from "@/hooks/useInterviewChat";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

const InterviewChat: React.FC = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resumeId");

  const {
    messages,
    inputMessage,
    isLoading,
    interviewStarted,
    interviewComplete,
    currentQuestionNumber,
    feedback,
    showFeedback,
    uploadedFile,
    jobDescription,
    setInputMessage,
    setShowFeedback,
    setUploadedFile,
    setJobDescription,
    startInterview,
    sendAnswer,
    requestFeedback,
    skipQuestion,
    restartInterview,
  } = useInterviewChat({ resumeId });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const bgMain = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const bgChat =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";

  // Show resume upload screen if interview hasn't started
  if (!interviewStarted) {
    return (
      <ResumeUploadSection
        onStartInterview={startInterview}
        uploadedFile={uploadedFile}
        onFileUpload={setUploadedFile}
        jobDescription={jobDescription}
        onJobDescriptionChange={setJobDescription}
        resumeId={resumeId}
      />
    );
  }

  return (
    <div
      className={`flex flex-col h-screen ${bgMain} font-sans transition-colors`}
    >
      {/* Header */}
      <ChatHeader
        currentQuestionNumber={currentQuestionNumber}
        onRequestFeedback={requestFeedback}
        onRestart={restartInterview}
        isLoading={isLoading}
        interviewComplete={interviewComplete}
      />

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Chat Area */}
        <div
          className={`flex-1 ${bgChat} rounded-xl border shadow-sm overflow-hidden flex flex-col`}
        >
          <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading && <LoadingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Feedback Panel */}
        {showFeedback && feedback && (
          <FeedbackPanel
            feedback={feedback}
            onClose={() => setShowFeedback(false)}
            onRestart={restartInterview}
          />
        )}
      </div>

      {/* Input Area */}
      {!interviewComplete && (
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={sendAnswer}
          onSkip={skipQuestion}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default InterviewChat;
