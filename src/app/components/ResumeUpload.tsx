import { useRef, useState } from "react";
import { authFetch } from "../lib/api";
import { getBaseUrl } from "../utils/utils";

interface ResumeUploadProps {
  onUpload: (file: File) => void;
}

export default function ResumeUpload({ onUpload }: ResumeUploadProps) {
  const [resumeUploadLoader, setResumeUploadLoader] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleResumeUpload = async (file: File) => {
    setResumeUploadLoader(true);
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
        setResumeUploadLoader(false);
        onUpload(file);

        // Once resume is uploaded, start interview
        // await startInterview();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to upload resume. Please try again.");
        return;
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeUploadLoader(true);
      handleResumeUpload(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row justify-center items-start">
      <div className="flex flex-col gap-6">
        {/* About Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Upload Your Resume
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Upload your resume in PDF or DOCX format to receive tailored
            interview questions.
          </p>
          <div
            onClick={handleFileUploadClick}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:bg-gray-50 transition"
          >
            {resumeUploadLoader ? (
              <p className="text-gray-500 text-sm">Analyzing your resume...</p>
            ) : (
              <>
                <span className="text-gray-400 text-3xl">📄</span>
                <p className="text-blue-600 mt-2 text-sm">
                  Drag & drop or <span className="underline">browse</span> to
                  upload
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-gray-700">
          <h3 className="text-lg font-semibold text-blue-700">
            💬 Tips for Resume Interviews
          </h3>
          <ul className="list-disc text-sm pl-5 mt-2 space-y-1">
            <li>Be ready to elaborate on every point in your resume.</li>
            <li>Connect experiences to the job’s requirements.</li>
            <li>Use metrics and numbers wherever possible.</li>
            <li>Apply the STAR method for behavioral questions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
