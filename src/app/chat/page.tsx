"use client";

import React, { useEffect, useRef, useState } from "react";
import { authFetch } from "../lib/api";
import { getBaseUrl } from "../utils/utils";

// Types
interface Message {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: {
    question_number?: number;
    question_type?: string;
    reasoning?: string;
  };
}

interface FeedbackData {
  confidence_score: number;
  grammar_assessment: string;
  content_quality: string;
  improvement_suggestions: string[];
  strengths: string[];
  is_final: boolean;
}

interface ChatResponse {
  success: boolean;
  action: string;
  type?: string;
  question?: string;
  question_number?: number;
  question_type?: string;
  reasoning?: string;
  feedback?: FeedbackData;
  is_complete?: boolean;
  context?: string;
  turn_count?: number;
}

interface ResumeUploadSectionProps {
  onStartInterview: () => void;
  uploadedFile: File | null;
  onFileUpload: (file: File) => void;
}

const ResumeUploadSection: React.FC<ResumeUploadSectionProps> = ({
  onStartInterview,
  uploadedFile,
  onFileUpload,
}) => {
  const [resumeUploadLoader, setResumeUploadLoader] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleResumeUpload = async (file: File) => {
    setResumeUploadLoader(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await authFetch(
        `${getBaseUrl()}/new/resume/upload/pdf`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload resume");
      }

      setResumeUploadLoader(false);
      onFileUpload(file);
    } catch (err) {
      console.error(err);
      alert("Failed to upload resume. Please try again.");
      setResumeUploadLoader(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleResumeUpload(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="text-center text-white mb-4">
          <h1 className="text-3xl font-bold mb-3">
            Mocky - Your Interview Assistant
          </h1>
          <p className="text-xl text-white/90">
            Practice behavioral and technical interviews with AI-powered
            feedback
          </p>
        </div>

        {/* About Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            💡 About This Session
          </h2>
          <p className="text-gray-600 text-sm mt-2 leading-relaxed">
            In this session, the AI will generate interview questions
            dynamically based on your uploaded resume, creating a personalized
            interview experience. Focus on explaining your experiences clearly
            and confidently.
          </p>
        </div>

        {/* Upload Resume Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-3 text-center">
            Upload Your Resume
          </h3>
          <p className="text-gray-500 text-sm mb-4 text-center">
            Upload your resume in PDF or DOCX format to receive tailored
            interview questions.
          </p>

          {!uploadedFile ? (
            <div
              onClick={handleFileUploadClick}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 cursor-pointer hover:bg-gray-50 hover:border-indigo-400 transition text-center"
            >
              {resumeUploadLoader ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 text-sm">
                    Analyzing your resume...
                  </p>
                </div>
              ) : (
                <>
                  <span className="text-gray-400 text-5xl block mb-4">📄</span>
                  <p className="text-indigo-600 text-base font-medium">
                    Drag & drop or <span className="underline">browse</span> to
                    upload
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    PDF, DOC, or DOCX (Max 10MB)
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="border-2 border-green-300 bg-green-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">✅</span>
                  <div>
                    <p className="font-medium text-gray-800">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleFileUploadClick}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium underline"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {uploadedFile && (
            <button
              onClick={onStartInterview}
              className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              Start Interview 🚀
            </button>
          )}
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
            💬 Tips for Resume Interviews
          </h3>
          <ul className="list-disc text-sm pl-5 mt-3 space-y-2 text-gray-700">
            <li>Be ready to elaborate on every point in your resume.</li>
            <li>Connect experiences to the job&apos;s requirements.</li>
            <li>Use metrics and numbers wherever possible.</li>
            <li>Apply the STAR method for behavioral questions.</li>
          </ul>
        </div>

        {/* Features List */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">
            What to Expect:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white/90 text-sm">
            <div className="flex items-start gap-2">
              <span>✓</span>
              <span>Personalized questions based on your experience</span>
            </div>
            <div className="flex items-start gap-2">
              <span>✓</span>
              <span>Intelligent follow-up questions</span>
            </div>
            <div className="flex items-start gap-2">
              <span>✓</span>
              <span>Detailed feedback on your answers</span>
            </div>
            <div className="flex items-start gap-2">
              <span>✓</span>
              <span>Grammar and communication assessment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InterviewChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (interviewStarted && !isLoading) {
      inputRef.current?.focus();
    }
  }, [interviewStarted, isLoading]);

  const addMessage = (
    type: "user" | "assistant" | "system",
    content: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: any
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      metadata,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const sendRequest = async (
    action: string,
    message?: string
  ): Promise<ChatResponse | null> => {
    try {
      const response = await authFetch(`${getBaseUrl()}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          message,
          question_number: currentQuestionNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending request:", error);
      addMessage("system", "Error: Failed to communicate with the server.");
      return null;
    }
  };

  const startInterview = async () => {
    setIsLoading(true);
    setInterviewStarted(true);
    addMessage("system", "🎯 Starting your interview...");

    const response = await sendRequest("start");

    if (response && response.question) {
      setCurrentQuestionNumber(response.question_number || 1);

      addMessage("assistant", response.question, {
        question_number: response.question_number,
        question_type: response.question_type,
        reasoning: response.reasoning,
      });
    }

    setIsLoading(false);
  };

  const sendAnswer = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    addMessage("user", userMessage);

    const response = await sendRequest("continue", userMessage);

    if (response) {
      if (response.type === "ask_next_question" && response.question) {
        setCurrentQuestionNumber(
          response.question_number || currentQuestionNumber + 1
        );
        addMessage("assistant", response.question, {
          question_number: response.question_number,
          question_type: response.question_type,
          reasoning: response.reasoning,
        });
      } else if (response.type === "generate_feedback" && response.feedback) {
        setFeedback(response.feedback);
        setShowFeedback(true);

        if (response.is_complete) {
          setInterviewComplete(true);
          addMessage(
            "system",
            "✅ Interview complete! Your feedback is ready."
          );
        }
      }
    }

    setIsLoading(false);
  };

  const requestFeedback = async () => {
    setIsLoading(true);
    addMessage("system", "📊 Generating your feedback...");

    const response = await sendRequest("feedback");

    if (response && response.feedback) {
      setFeedback(response.feedback);
      setShowFeedback(true);
      setInterviewComplete(true);
      addMessage("system", "✅ Your feedback is ready!");
    }

    setIsLoading(false);
  };

  const skipQuestion = async () => {
    setIsLoading(true);
    addMessage("system", "Skipping to next question...");

    const response = await sendRequest("skip");

    if (response && response.question) {
      setCurrentQuestionNumber(
        response.question_number || currentQuestionNumber + 1
      );
      addMessage("assistant", response.question, {
        question_number: response.question_number,
        question_type: response.question_type,
        reasoning: response.reasoning,
      });
    }

    setIsLoading(false);
  };

  const restartInterview = async () => {
    setIsLoading(true);
    setMessages([]);
    setFeedback(null);
    setShowFeedback(false);
    setInterviewComplete(false);
    setCurrentQuestionNumber(0);
    setInterviewStarted(false);
    setUploadedFile(null);

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendAnswer();
    }
  };

  // Show resume upload screen if interview hasn't started
  if (!interviewStarted) {
    return (
      <ResumeUploadSection
        onStartInterview={startInterview}
        uploadedFile={uploadedFile}
        onFileUpload={setUploadedFile}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 font-sans">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md px-8 py-6 shadow-lg flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold text-gray-800">
          Mocky - Your Interview Assistant
        </h1>
        <div className="flex gap-4 items-center">
          <span className="bg-indigo-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
            Question {currentQuestionNumber}
          </span>
          {!interviewComplete && (
            <button
              className="bg-white text-indigo-500 px-4 py-2 rounded-lg border-2 border-indigo-500 text-sm font-semibold hover:bg-indigo-500 hover:text-white transition-colors disabled:opacity-50"
              onClick={requestFeedback}
              disabled={isLoading}
            >
              Get Feedback
            </button>
          )}
          <button
            className="bg-white text-indigo-500 px-4 py-2 rounded-lg border-2 border-indigo-500 text-sm font-semibold hover:bg-indigo-500 hover:text-white transition-colors disabled:opacity-50"
            onClick={restartInterview}
            disabled={isLoading}
          >
            Restart
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 mb-6 animate-[slideIn_0.3s_ease-out] ${
                  message.type === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                  {message.type === "assistant" && "🤖"}
                  {message.type === "user" && "👤"}
                  {message.type === "system" && "ℹ️"}
                </div>

                <div
                  className={`max-w-[70%] px-5 py-4 shadow-sm ${
                    message.type === "user"
                      ? "bg-indigo-500 text-white rounded-[18px_18px_4px_18px]"
                      : message.type === "assistant"
                      ? "bg-gray-50 rounded-[18px_18px_18px_4px]"
                      : "bg-amber-50 rounded-xl italic"
                  }`}
                >
                  {message.metadata?.question_number && (
                    <div className="flex gap-2 mb-2">
                      <span className="inline-block bg-indigo-500 text-white px-3 py-1 rounded-xl text-xs font-semibold">
                        Q{message.metadata.question_number}
                      </span>
                      {message.metadata.question_type && (
                        <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-xl text-xs font-semibold capitalize">
                          {message.metadata.question_type}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="leading-relaxed">{message.content}</div>
                  {message.metadata?.reasoning && (
                    <div className="mt-3 p-3 bg-indigo-50 rounded-lg text-sm text-gray-700">
                      💡 {message.metadata.reasoning}
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-400">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div className="bg-gray-50 px-5 py-4 rounded-[18px_18px_18px_4px]">
                  <div className="flex gap-1 py-2">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Feedback Panel */}
        {showFeedback && feedback && (
          <div className="w-[400px] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col max-lg:fixed max-lg:inset-0 max-lg:z-50 max-lg:w-full">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">📊 Your Interview Feedback</h2>
              <button
                className="bg-white/20 hover:bg-white/30 text-white rounded-full w-8 h-8 flex items-center justify-center text-2xl transition-colors"
                onClick={() => setShowFeedback(false)}
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Confidence Score */}
              <div className="mb-8">
                <h3 className="text-gray-800 text-lg font-semibold mb-4">
                  Confidence Score
                </h3>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center text-white shadow-lg shadow-indigo-300">
                    <span className="text-3xl font-bold">
                      {feedback.confidence_score}
                    </span>
                    <span className="text-sm opacity-80">/10</span>
                  </div>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                      style={{ width: `${feedback.confidence_score * 10}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div className="mb-8">
                <h3 className="text-gray-800 text-lg font-semibold mb-4">
                  💪 Strengths
                </h3>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-emerald-50 text-emerald-900 rounded-lg border-l-4 border-emerald-500 leading-relaxed"
                    >
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Grammar Assessment */}
              <div className="mb-8">
                <h3 className="text-gray-800 text-lg font-semibold mb-4">
                  ✍️ Communication & Grammar
                </h3>
                <p className="p-4 bg-gray-50 rounded-lg leading-relaxed text-gray-700">
                  {feedback.grammar_assessment}
                </p>
              </div>

              {/* Content Quality */}
              <div className="mb-8">
                <h3 className="text-gray-800 text-lg font-semibold mb-4">
                  📝 Content Quality
                </h3>
                <p className="p-4 bg-gray-50 rounded-lg leading-relaxed text-gray-700">
                  {feedback.content_quality}
                </p>
              </div>

              {/* Improvement Suggestions */}
              <div className="mb-8">
                <h3 className="text-gray-800 text-lg font-semibold mb-4">
                  🎯 Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {feedback.improvement_suggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-amber-50 text-amber-900 rounded-lg border-l-4 border-amber-500 leading-relaxed"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              {feedback.is_final && (
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl text-center">
                  <p className="mb-4 text-lg">
                    🎉 This is your final feedback. Great job completing the
                    interview!
                  </p>
                  <button
                    className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    onClick={restartInterview}
                  >
                    Start New Interview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      {!interviewComplete && (
        <div className="bg-white px-8 py-4 shadow-lg flex gap-4 items-end">
          <div className="flex flex-col gap-2">
            <button
              className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50"
              onClick={skipQuestion}
              disabled={isLoading}
              title="Skip to next question"
            >
              ⏭️ Skip
            </button>
          </div>
          <textarea
            ref={inputRef}
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-base resize-none focus:outline-none focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
            placeholder="Type your answer here... (Press Enter to send, Shift+Enter for new line)"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            rows={3}
          />
          <button
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={sendAnswer}
            disabled={isLoading || !inputMessage.trim()}
          >
            {isLoading ? "⏳" : "📤"} Send
          </button>
        </div>
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
