"use client";
import { useState } from "react";
import { getBaseUrl } from "../utils/utils";

export default function VoiceInterview() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    setAudioUrl(null);

    try {
      const res = await fetch(`${getBaseUrl()}/voice/voiceRes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (data.error) {
        setAnswer("Error: " + data.error);
        return;
      }

      setAnswer(data.answer);

      // ✅ convert base64 -> blob -> object URL
      const audioBlob = b64toBlob(data.audioBase64, data.mimeType);
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (err) {
      console.error(err);
      setAnswer("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // helper: convert base64 to Blob
  function b64toBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <h2 className="text-xl font-bold">Voice Setup!!</h2>
      <p className="text-center max-w-md">
        This is a demo of voice-based interview questions. Type a question below
        and get an AI-generated answer along with a voice response!
      </p>

      {/* User Input */}
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your interview question..."
        className="w-full max-w-md p-2 border rounded-md"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Submit Question"}
      </button>

      {/* Show Answer */}
      {answer && (
        <div className="w-full max-w-md p-4 border rounded-md bg-gray-50">
          <p className="font-semibold">AI Answer:</p>
          <p>{answer}</p>
        </div>
      )}

      {/* Play Audio */}
      {audioUrl && (
        <audio controls src={audioUrl} className="mt-2 w-full max-w-md" />
      )}
    </div>
  );
}
