"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Download, ArrowLeft, CheckCircle2, FileText, 
  Archive, Eye, Share2, RefreshCcw 
} from "lucide-react";

export default function DownloadPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [file, setFile] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("processedFile");
    if (stored) {
      setFile(JSON.parse(stored));
    } else {
        router.push(`/tools/${slug}`);
    }
  }, [slug, router]);

  const handleGoBack = () => {
    router.push(`/tools/${slug}`);
  };

  const downloadFile = () => {
    if (!file) return;
    const link = document.createElement("a");
    link.href = file.url;
    // Naming logic: Use stored name or fallback
    link.download = file.name || `processed-${slug}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const openPreview = () => {
    if (file?.url) window.open(file.url, "_blank");
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  };

  if (!file) return null;

  const isZip = file.type === "application/zip" || file.name.endsWith(".zip");

  return (
    <main className="min-h-screen bg-[#f8fafc] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* BACK BUTTON */}
        <button 
          onClick={handleGoBack}
          className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-all mb-12"
        >
          <div className="p-2 rounded-xl group-hover:bg-blue-50 transition-colors">
            <ArrowLeft size={20} />
          </div>
          Convert Another File
        </button>

        {/* SUCCESS CARD */}
        <div className="bg-white border-2 border-slate-100 rounded-[40px] p-8 sm:p-12 shadow-2xl shadow-blue-900/5 text-center relative overflow-hidden">
          
          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-500"></div>
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-500 rounded-full mb-8 animate-bounce-slow">
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </div>

          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Your file is <span className="text-blue-600">ready!</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg mb-10">
            We've successfully processed your document.
          </p>

          {/* FILE INFO BOX */}
          <div className="bg-slate-50 border-2 border-slate-100 rounded-[32px] p-6 mb-12 flex flex-col sm:flex-row items-center gap-6 text-left">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg ${isZip ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'}`}>
              {isZip ? <Archive size={40} /> : <FileText size={40} />}
            </div>
            
            <div className="flex-1 overflow-hidden text-center sm:text-left">
              <h3 className="font-black text-slate-800 text-xl truncate mb-1 px-2" title={file.name}>
                {file.name}
              </h3>
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {isZip ? 'Archive' : 'Document'}
                </span>
                <span className="text-slate-400 font-bold text-sm">
                  {formatSize(file.size)}
                </span>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={downloadFile}
              className="group bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Download size={24} className="group-hover:animate-bounce" />
              DOWNLOAD NOW
            </button>

            {!isZip && (
              <button
                onClick={openPreview}
                className="bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600 py-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3"
              >
                <Eye size={24} />
                PREVIEW
              </button>
            )}

            {isZip && (
              <div className="flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl px-6 py-5 border-2 border-blue-100 font-bold text-sm">
                ZIP files cannot be previewed.
              </div>
            )}
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <button className="text-slate-400 hover:text-slate-600 font-bold flex items-center gap-2 text-sm transition-all">
               <Share2 size={16} /> Share Link
            </button>
            <button 
                onClick={handleGoBack}
                className="text-blue-600 hover:underline font-black flex items-center gap-2 text-sm"
            >
               <RefreshCcw size={16} /> Start New Task
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
