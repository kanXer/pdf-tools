"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Download, ArrowLeft } from "lucide-react";

export default function DownloadPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [file, setFile] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("processedFile");
    if (stored) {
      setFile(JSON.parse(stored));
    }
  }, []);

  // Back button handler to ensure they go to the upload page
  const handleGoBack = () => {
    // Optional: Clear session storage so the old file doesn't reappear
    // sessionStorage.removeItem("processedFile"); 
    router.push(`/tools/${slug}`);
  };

  if (!file) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p>No file found</p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = `processed-${slug}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    return kb < 1024
      ? `${kb.toFixed(1)} KB`
      : `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-center">
      <h1 className="text-3xl font-black mb-6">Your File is Ready</h1>

      <p className="text-gray-500 mb-6">
        Output Size: {formatSize(file.size)}
      </p>

      <div className="flex justify-center gap-4">
        {/* CHANGED: router.back() replaced with handleGoBack */}
        <button
          onClick={handleGoBack}
          className="border px-6 py-3 rounded border-gray-300 hover:bg-gray-50 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={18} /> Upload Another File
        </button>

        <button
          onClick={downloadFile}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded flex items-center gap-2 transition-colors"
        >
          <Download size={18} /> Download
        </button>
      </div>
    </main>
  );
}