"use client";
import React, { useState } from "react";
import FeedbackCard from "../components/Feedback";
import { authFetch } from "../lib/api";
import { useAuth } from "../utils/AuthContext";
import { getBaseUrl } from "../utils/utils";

interface Message {
  sender: "user" | "bot" | "info";
  text: string;
}
const baseUrl = `${getBaseUrl()}/new/search`;

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  // const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  const [resumeUploaded, setResumeUploaded] = useState(false);

  const handleResumeUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("resume", file);
    await authFetch(`${getBaseUrl()}/new/resume/upload/pdf`, {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to upload resume");
        }
        setResumeUploaded(true);
        // Once resume is uploaded, start interview
        await startInterview();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to upload resume. Please try again.");
        return;
      });
  };

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${baseUrl}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();

      const msgs: Message[] = [
        { sender: "bot", text: data?.question?.question },
      ];
      if (data.docs?.length > 0) {
        msgs.push({
          sender: "info",
          text: `📄 Related Info:\n${data.docs.join("\n")}`,
        });
      }
      setMessages(msgs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendAnswer = async () => {
    if (!input.trim() || !resumeUploaded) return;
    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const res = await authFetch(`${baseUrl}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: input }),
      });
      const data = await res.json();
      if (data.type == "next_question") {
        if (data.question) {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: data?.question },
          ]);
        }
        if (data.docs && data.docs.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              sender: "info",
              text: `📄 Related Info:\n${data.docs.join("\n")}`,
            },
          ]);
        }
      } else if (data.type == "feedback") {
        setFeedback(JSON.stringify(data));
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "✅ Interview ended. See feedback below." },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    if (!resumeUploaded) return;
    setLoading(true);
    try {
      const res = await authFetch(`${baseUrl}/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setFeedback(JSON.stringify(data.feedback));
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "✅ Interview ended. See feedback below." },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploadClick = () => {
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", "application/pdf");
    el.addEventListener("change", async () => {
      if (el.files && el.files.length > 0) {
        const file = el.files.item(0);
        if (file) {
          await handleResumeUpload(file);
        }
      }
    });
    el.click();
  };

  if (!isLoggedIn) {
    return (
      <div className="mx-auto p-4 flex flex-col rounded-lg mt-2 w-full">
        <section className="w-full justify-center items-center text-center">
          <div className="mx-auto rounded-2xl text-gray-900 p-6 md:p-10">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Please log in to start the mock interview.
                </h1>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 flex flex-col rounded-lg mt-2 w-full">
      {!resumeUploaded && (
        <section className="w-full justify-center items-center text-center">
          <div className="mx-auto rounded-2xl text-gray-900 p-6 md:p-10">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Get Questions Tailored to Your Resume
                </h1>
                <p className="mt-2 text-sm md:text-base text-gray-700">
                  Upload your resume and our AI will generate interview
                  questions specifically designed to test your experience and
                  skills.
                </p>

                <div className="mt-5">
                  <button
                    onClick={handleFileUploadClick}
                    className="inline-flex items-center justify-center rounded bg-emerald-500 hover:bg-emerald-600 px-4 md:px-5 py-2.5 text-sm font-medium shadow-lg transition"
                  >
                    Start Resume-Based Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Chat Window */}
      {resumeUploaded && (
        <>
          <div className="flex-1 overflow-y-auto space-y-2 p-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg max-w-[75%] ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : msg.sender === "bot"
                    ? "bg-gray-200 text-black self-start"
                    : "bg-yellow-100 text-black text-sm self-center"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          {loading && (
            <div className="p-2 text-gray-500 italic">Thinking...</div>
          )}
          {/* Input Area */}
          {!feedback && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                className="flex-1 border rounded-lg p-2"
                value={input}
                placeholder="Type your answer..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendAnswer()}
              />
              <button
                onClick={sendAnswer}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Send
              </button>
              <button
                onClick={endInterview}
                disabled={loading}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                End
              </button>
            </div>
          )}

          {/* Feedback Section */}
          {feedback && <FeedbackCard feedback={JSON.parse(feedback)} />}
        </>
      )}
    </div>
  );
};

export default ChatComponent;
