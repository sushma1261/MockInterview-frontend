"use client";
import { useState } from "react";
import { authFetch } from "../lib/api";
import { getBaseUrl } from "../utils/utils";

/**
 * Hook for streaming chat - handles SSE connection
 */
export function useStreamingChat() {
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [question, setQuestion] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Send message with streaming response
   */
  const sendStreamingMessage = async (
    message: string,
    action: string = "continue",
    questionNumber?: number
  ) => {
    setIsStreaming(true);
    setStreamingText("");
    setError(null);

    try {
      const response = await authFetch(`${getBaseUrl()}/api/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          action,
          question_number: questionNumber,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Read the stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("Stream complete");
          break;
        }

        // Decode chunk
        buffer += decoder.decode(value, { stream: true });

        // Process complete messages (SSE messages end with \n\n)
        const messages = buffer.split("\n\n");
        buffer = messages.pop() || ""; // Keep incomplete message in buffer

        for (const message of messages) {
          if (message.startsWith("data: ")) {
            const data = JSON.parse(message.slice(6));

            // Handle different chunk types
            switch (data.type) {
              case "text":
                // Append text incrementally
                setStreamingText((prev) => prev + data.content);
                break;

              case "function_call":
                // Handle function call result (e.g., question)
                console.log("Function called:", data.functionName);
                if (data.functionResult) {
                  setQuestion(data.functionResult);
                }
                break;

              case "complete":
                // Stream is complete
                console.log("Stream complete, full text:", data.fullText);
                break;

              case "final":
                // Final response with metadata
                console.log("Final response:", data.response);
                break;

              case "error":
                // Error occurred
                console.error("Stream error:", data.error);
                setError(data.error);
                break;

              default:
                console.log("Unknown chunk type:", data.type);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error in streaming chat:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsStreaming(false);
    }
  };

  /**
   * Send message without streaming (original behavior)
   */
  const sendMessage = async (
    message: string,
    action: string = "continue",
    questionNumber?: number
  ) => {
    setIsStreaming(true);
    setError(null);

    try {
      const response = await authFetch(`${getBaseUrl()}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          action,
          question_number: questionNumber,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.question) {
        setQuestion(data);
      }

      return data;
    } catch (err) {
      console.error("Error in chat:", err);
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setIsStreaming(false);
    }
  };

  return {
    streamingText,
    isStreaming,
    question,
    error,
    sendStreamingMessage,
    sendMessage,
    setStreamingText,
    setQuestion,
  };
}

/**
 * Example React component using streaming chat
 */
export default function InterviewChat() {
  const {
    streamingText,
    isStreaming,
    question,
    error,
    sendStreamingMessage,
    sendMessage,
  } = useStreamingChat();

  const [answer, setAnswer] = useState("");
  const [useStreaming, setUseStreaming] = useState(true);

  const handleStartInterview = async () => {
    if (useStreaming) {
      await sendStreamingMessage("", "start");
    } else {
      await sendMessage("", "start");
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;

    if (useStreaming) {
      await sendStreamingMessage(answer, "continue", question?.question_number);
    } else {
      await sendMessage(answer, "continue", question?.question_number);
    }

    setAnswer("");
  };

  const handleRequestFeedback = async () => {
    if (useStreaming) {
      await sendStreamingMessage("", "feedback");
    } else {
      await sendMessage("", "feedback");
    }
  };

  return (
    <div className="interview-chat">
      <h1>AI Interview Practice</h1>

      {/* Streaming toggle */}
      <div className="controls">
        <label>
          <input
            type="checkbox"
            checked={useStreaming}
            onChange={(e) => setUseStreaming(e.target.checked)}
          />
          Enable Streaming (ChatGPT-like typing effect)
        </label>
      </div>

      {/* Error display */}
      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Question display */}
      {question && (
        <div className="question">
          <h3>Question #{question.question_number}</h3>
          <p>{question.question}</p>
          {question.question_type && (
            <span className="badge">{question.question_type}</span>
          )}
        </div>
      )}

      {/* Streaming text display */}
      {useStreaming && streamingText && (
        <div className="streaming-text">
          <h4>AI Response:</h4>
          <p>{streamingText}</p>
          {isStreaming && <span className="typing-indicator">▌</span>}
        </div>
      )}

      {/* Answer input */}
      {question && !isStreaming && (
        <div className="answer-input">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            rows={6}
          />
          <div className="button-group">
            <button onClick={handleSubmitAnswer} disabled={!answer.trim()}>
              Submit Answer
            </button>
            <button onClick={handleRequestFeedback} className="secondary">
              Request Feedback
            </button>
          </div>
        </div>
      )}

      {/* Start button */}
      {!question && !isStreaming && (
        <button onClick={handleStartInterview} className="primary">
          Start Interview
        </button>
      )}

      {/* Loading indicator */}
      {isStreaming && !useStreaming && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example: Advanced streaming with more control
 */
export function AdvancedStreamingExample() {
  const [chunks, setChunks] = useState<any[]>([]);

  const handleStreamingChat = async () => {
    const response = await authFetch("/api/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: "Hello", action: "continue" }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = JSON.parse(line.slice(6));

          // Store all chunks for debugging/analysis
          setChunks((prev) => [...prev, data]);

          // Handle specific types
          if (data.type === "text") {
            console.log("Text chunk:", data.content);
          } else if (data.type === "function_call") {
            console.log(
              "Function called:",
              data.functionName,
              data.functionResult
            );
          }
        }
      }
    }
  };

  return (
    <div>
      <button onClick={handleStreamingChat}>Start Streaming</button>

      <div>
        <h3>Chunks Received: {chunks.length}</h3>
        {chunks.map((chunk, i) => (
          <div
            key={i}
            style={{ marginBottom: 10, padding: 10, border: "1px solid #ccc" }}
          >
            <strong>Type:</strong> {chunk.type}
            <br />
            <strong>Content:</strong> {JSON.stringify(chunk, null, 2)}
          </div>
        ))}
      </div>
    </div>
  );
}
