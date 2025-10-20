import { authFetch } from "@/lib/api";
import { historyApi } from "@/lib/historyApi";
import { getBaseUrl } from "@/lib/utils";
import { ChatResponse, FeedbackData, Message } from "@/types/chat";
import { useEffect, useState } from "react";

interface UseInterviewChatProps {
  resumeId?: string | null;
  sessionId?: string | null;
}

export function useInterviewChat(props?: UseInterviewChatProps) {
  const { resumeId, sessionId } = props || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");

  // Load session messages if sessionId is provided
  useEffect(() => {
    if (sessionId) {
      loadSessionMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const loadSessionMessages = async () => {
    if (!sessionId) return;

    try {
      const response = await historyApi.getSessionDetail(parseInt(sessionId));

      // Convert session messages to chat messages
      const loadedMessages: Message[] = response.messages.map((msg) => ({
        id: msg.id.toString(),
        type: msg.role as "user" | "assistant" | "system",
        content: msg.content,
        timestamp: new Date(msg.created_at),
        metadata: {
          question_number: msg.question_number || undefined,
          question_type: msg.question_type || undefined,
          message_type: msg.message_type,
        },
      }));

      setMessages(loadedMessages);
      setInterviewStarted(true);

      // Set current question number from session data
      const lastQuestion = response.messages
        .filter((m) => m.question_number)
        .sort((a, b) => (b.question_number || 0) - (a.question_number || 0))[0];

      if (lastQuestion?.question_number) {
        setCurrentQuestionNumber(lastQuestion.question_number);
      }
    } catch (error) {
      console.error("Error loading session messages:", error);
    }
  };

  const addMessage = (
    type: "user" | "assistant" | "system",
    content: string,
    metadata?: Record<string, unknown>
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
      const body: Record<string, unknown> = {
        action,
        message,
        question_number: currentQuestionNumber,
      };

      // Include job_description when starting the interview
      if (action === "start") {
        body.job_description = jobDescription;

        // Include resume_id if provided (from profile page)
        if (resumeId) {
          body.resume_id = parseInt(resumeId, 10);
        }
      }

      const response = await authFetch(`${getBaseUrl()}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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
    addMessage("system", "⏭️ Skipping to next question...");

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

  const restartInterview = () => {
    setMessages([]);
    setFeedback(null);
    setShowFeedback(false);
    setInterviewComplete(false);
    setCurrentQuestionNumber(0);
    setInterviewStarted(false);
    setUploadedFile(null);
    setJobDescription("");
    setInputMessage("");
  };

  return {
    // State
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

    // Setters
    setInputMessage,
    setShowFeedback,
    setUploadedFile,
    setJobDescription,
    setMessages,
    setInterviewStarted,
    setCurrentQuestionNumber,
    setInterviewComplete,

    // Actions
    startInterview,
    sendAnswer,
    requestFeedback,
    skipQuestion,
    restartInterview,
  };
}
