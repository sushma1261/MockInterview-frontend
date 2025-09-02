"use client";

import { useRef, useState } from "react";
import { getBaseUrl } from "../utils/utils";

export default function VideoRecorder() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recording, setRecording] = useState(false);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream);
      const localChunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          localChunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(localChunks, { type: "video/webm" });
        setChunks(localChunks);
        setPreviewUrl(URL.createObjectURL(blob));
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error("Error accessing camera/microphone:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);

    // stop camera feed
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const uploadRecording = async () => {
    if (chunks.length === 0) return;

    const blob = new Blob(chunks, { type: "video/webm" });
    const formData = new FormData();
    formData.append("file", blob, "interview.webm");

    try {
      const res = await fetch(`${getBaseUrl()}/api/interview-video`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Upload response:", data);
      alert("Upload successful!");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Record Video Answer</h2>

      <video ref={videoRef} autoPlay muted className="w-full rounded-md mb-2" />

      <div className="space-x-2">
        {!recording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Stop Recording
          </button>
        )}
        {previewUrl && (
          <button
            onClick={uploadRecording}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Upload Recording
          </button>
        )}
      </div>

      {previewUrl && (
        <div className="mt-4">
          <h3 className="font-medium">Preview:</h3>
          <video src={previewUrl} controls className="w-full rounded-md mt-2" />
        </div>
      )}
    </div>
  );
}
