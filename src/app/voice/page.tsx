"use client";
import { useRef, useState } from "react";
import { MIMETYPE_AUDIO_WEBM } from "../utils/constants";
import { getBaseUrl } from "../utils/utils";

export default function VoiceInterview() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSubmit = async (payload?: { audioBase64?: string }) => {
    if (!question.trim() && !payload?.audioBase64) return;
    setLoading(true);
    setAnswer("");
    setAudioUrl(null);

    try {
      console.log("audioBase64?? ", payload?.audioBase64);
      const res = await fetch(`${getBaseUrl()}/voice/getVoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          payload?.audioBase64
            ? {
                base64data: payload.audioBase64,
                mimeType: MIMETYPE_AUDIO_WEBM,
              }
            : { question }
        ),
      });

      const data = await res.json();

      if (data.error) {
        setAnswer("Error: " + data.error);
        return;
      }

      setAnswer(data.answer);
      if (!data.audioBase64) return;
      else {
        // ✅ convert base64 -> blob -> object URL
        const audioBlob = b64toBlob(data.audioBase64, data.mimeType);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      }
    } catch (err) {
      console.error(err);
      setAnswer("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // 🎤 Start / Stop recording
  const toggleRecording = async () => {
    if (recording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: MIMETYPE_AUDIO_WEBM,
          });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            console.log({ result: reader.result });
            const base64data = (reader.result as string).split(",")[1];
            handleSubmit({ audioBase64: base64data });
          };
        };

        mediaRecorder.start();
        setRecording(true);
      } catch (err) {
        console.error("Mic access denied:", err);
      }
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
        or record your voice to get an AI-generated answer along with a voice
        response!
      </p>

      {/* User Input */}
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your interview question..."
        className="w-full max-w-md p-2 border rounded-md"
      />

      <div className="flex gap-4">
        <button
          onClick={() => handleSubmit()}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Submit Question"}
        </button>

        {/* 🎤 Record Button */}
        <button
          onClick={toggleRecording}
          className={`px-4 py-2 rounded-md text-white shadow-md transition ${
            recording
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {recording ? "Stop Recording" : "Record Voice"}
        </button>
      </div>

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
