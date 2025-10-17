"use client";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessage from "@/components/chat/ChatMessage";
import FeedbackPanel from "@/components/chat/FeedbackPanel";
import LoadingIndicator from "@/components/chat/LoadingIndicator";
import ResumeUploadSection from "@/components/chat/ResumeUploadSection";
import { useInterviewChat } from "@/hooks/useInterviewChat";
import React, { useEffect, useRef } from "react";

const InterviewChat: React.FC = () => {
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
  } = useInterviewChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show resume upload screen if interview hasn't started
  if (!interviewStarted) {
    return (
      <ResumeUploadSection
        onStartInterview={startInterview}
        uploadedFile={uploadedFile}
        onFileUpload={setUploadedFile}
        jobDescription={jobDescription}
        onJobDescriptionChange={setJobDescription}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 font-sans">
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
        <div className="flex-1 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
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

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default InterviewChat;
