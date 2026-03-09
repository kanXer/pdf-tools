"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FileText, X, ArrowLeft, CheckCircle, Plus, 
  Settings2, Loader2, HardDrive
} from "lucide-react";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getUploadedFiles } from "@/lib/fileStore";

const BASE_URL = "https://pdf-compress-api-nisg.onrender.com";

/* --- FIXED FILE CARD --- */
function SortableFile({ file, index, removeFile }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: file.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 1 };

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div ref={setNodeRef} style={style} className={`${isDragging ? "opacity-40 scale-95" : "opacity-100"} transition-all duration-300 w-full max-w-[240px]`}>
      <div className="group relative bg-white border-2 border-slate-100 rounded-[32px] p-6 shadow-sm hover:shadow-2xl hover:border-blue-500 transition-all flex flex-col items-center">
        <button onClick={() => removeFile(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:rotate-90 transition-all z-20">
          <X size={14} strokeWidth={4} />
        </button>

        <div {...attributes} {...listeners} className="flex flex-col items-center gap-4 cursor-grab w-full">
          <div className="w-20 h-20 bg-blue-50 flex items-center justify-center rounded-[24px] text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
            <FileText size={40} />
          </div>
          <div className="w-full text-center">
            <h4 className="text-sm font-black text-slate-800 line-clamp-1 px-1">{file.name || "File"}</h4>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
              <HardDrive size={10} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase">{formatSize(file.size)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [files, setFiles] = useState<any[]>([]);
  const [targetSize, setTargetSize] = useState<number>(150);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSingleFileMode = slug === "compress-pdf" || slug === "split-pdf";

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    const uploaded = getUploadedFiles();
    if (!uploaded || uploaded.length === 0) {
      router.push(`/tools/${slug}`);
      return;
    }
    setFiles(uploaded.map((f: any, i: number) => ({
      ...f, id: `file-${Date.now()}-${i}`, name: f.name, size: f.size, file: f 
    })));
  }, [slug]);

  const handleGenerate = () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", files[0].file);
    if (slug === "compress-pdf") formData.append("target", targetSize.toString());

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) setProgress(Math.min(Math.round((e.loaded / e.total) * 90), 90));
    });

    xhr.onload = function () {
      if (xhr.status === 200) {
        setProgress(100);
        const blob = new Blob([xhr.response], { type: xhr.getResponseHeader("Content-Type") || "application/pdf" });
        const url = URL.createObjectURL(blob);
        sessionStorage.setItem("processedFile", JSON.stringify({
          url, size: blob.size, name: slug === "split-pdf" ? `${files[0].name}_split.zip` : `final_${files[0].name}`,
          type: slug === "split-pdf" ? "application/zip" : "application/pdf"
        }));
        setTimeout(() => router.push(`/download/${slug}`), 800);
      } else {
        alert("Server Error!");
        setIsProcessing(false);
      }
    };

    xhr.open("POST", `${BASE_URL}/${slug}`);
    xhr.responseType = "blob";
    xhr.send(formData);
  };

  return (
    <main className="bg-[#f8fafc] min-h-screen pb-40">
      {/* LOADER OVERLAY WITH icon.png */}
      {isProcessing && (
        <div className="fixed inset-0 z-[999] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-6 text-center">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl">
            <div className="mb-8 relative flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-[6px] border-slate-100 border-t-blue-600 animate-spin absolute"></div>
              <img src="/icon.png" alt="icon" className="w-18 h-16 relative z-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">{progress < 90 ? "Uploading" : "Processing"}</h2>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden my-6 shadow-inner">
              <div style={{ width: `${progress}%` }} className="h-full bg-blue-600 transition-all duration-500"></div>
            </div>
            <span className="text-blue-600 font-black text-2xl">{progress}%</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-black mb-10 transition-all">
          <ArrowLeft size={18} strokeWidth={3}/> Back
        </button>

        <header className="mb-14 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 capitalize tracking-tight">
            {slug.split("-").join(" ")} <span className="text-blue-600">Review</span>
          </h1>
          <p className="text-slate-400 font-bold mt-3">Finalize your single-page document</p>
        </header>

        {/* SETTINGS (ONLY COMPRESS) */}
        {slug === "compress-pdf" && (
          <div className="bg-white border-2 border-slate-100 rounded-[32px] p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Settings2 size={24}/></div>
              <span className="font-black text-slate-700">Target Size (KB):</span>
            </div>
            <input 
              type="number" 
              value={targetSize} 
              onChange={(e) => setTargetSize(Math.max(1, Number(e.target.value)))}
              className="w-32 bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-3 font-black text-blue-600 text-xl outline-none focus:border-blue-600 transition-all"
            />
          </div>
        )}

        {/* CENTERED FILE GRID */}
        <div className={`flex flex-wrap ${isSingleFileMode ? "justify-center" : "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5"} gap-8`}>
          <DndContext collisionDetection={closestCenter} onDragEnd={() => {}}>
            <SortableContext items={files.map(f => f.id)} strategy={rectSortingStrategy}>
              {files.map((file, i) => (
                <SortableFile key={file.id} file={file} index={i} removeFile={() => router.push(`/tools/${slug}`)} />
              ))}
            </SortableContext>
          </DndContext>

          {/* Add Option Hide logic */}
          {!isSingleFileMode && (
            <button onClick={() => fileInputRef.current?.click()} className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center p-8 min-h-[200px] hover:border-blue-600 transition-all group">
              <input type="file" ref={fileInputRef} className="hidden" />
              <Plus size={32} className="text-slate-300 group-hover:text-blue-600" />
            </button>
          )}
        </div>

        {/* GENERATE BUTTON */}
        <div className="fixed bottom-10 left-0 right-0 px-8 flex justify-center z-50">
          <button onClick={handleGenerate} className="w-full max-w-xl bg-slate-900 text-white py-6 rounded-[30px] font-black text-xl shadow-2xl hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-4">
            <CheckCircle size={24} className="text-blue-400" /> GENERATE FINAL PDF
          </button>
        </div>
      </div>
    </main>
  );
}

