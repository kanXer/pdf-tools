"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FileText, X, ArrowLeft, CheckCircle, Plus, 
  Settings2, Loader2, Sparkles, HardDrive
} from "lucide-react";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getUploadedFiles } from "@/lib/fileStore";

const BASE_URL = "https://pdf-compress-api-nisg.onrender.com";

/* --- ALIGNED FILE CARD --- */
function SortableFile({ file, index, removeFile }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: file.id });
  
  const style = { 
    transform: CSS.Transform.toString(transform), 
    transition, 
    zIndex: isDragging ? 50 : 1 
  };

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 KB";
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div ref={setNodeRef} style={style} className={`${isDragging ? "opacity-40 scale-95" : "opacity-100"} transition-all duration-300 h-full`}>
      <div className="group relative bg-white border-2 border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all flex flex-col items-center h-full min-h-[200px] justify-between">
        
        <button onClick={() => removeFile(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:rotate-90 transition-all z-20">
          <X size={14} strokeWidth={4} />
        </button>

        <div className="absolute top-3 left-3 bg-slate-50 text-slate-400 text-[10px] font-black h-6 w-6 flex items-center justify-center rounded-lg border border-slate-100">
          {index + 1}
        </div>

        <div {...attributes} {...listeners} className="flex flex-col items-center gap-4 cursor-grab w-full flex-grow justify-center">
            <div className="w-16 h-16 bg-blue-50 flex items-center justify-center rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <FileText size={32} />
            </div>
          
          <div className="w-full text-center">
            {/* FILE NAME - Properly visible */}
            <h4 className="text-sm font-black text-slate-800 line-clamp-2 px-1 break-words leading-tight min-h-[2.5rem]">
              {file.name || "Unnamed File"}
            </h4>
            
            {/* SIZE BADGE */}
            <div className="mt-3 inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
              <HardDrive size={10} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                {formatSize(file.size)}
              </span>
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

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    const uploaded = getUploadedFiles();
    if (!uploaded || uploaded.length === 0) {
      router.push(`/tools/${slug}`);
      return;
    }
    // Logic Fix: Map files to ensure name and size are explicitly present
    const mappedFiles = uploaded.map((f: any, i: number) => ({
      id: `file-${Date.now()}-${i}`,
      name: f.name || "document.pdf",
      size: f.size || 0,
      file: f // Original file object for API
    }));
    setFiles(mappedFiles);
  }, [slug, router]);

  const handleGenerate = () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", files[0].file);
    if (slug === "compress-pdf") formData.append("target", targetSize.toString());

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        setProgress(Math.min(Math.round((e.loaded / e.total) * 90), 90));
      }
    });

    xhr.onload = function () {
      if (xhr.status === 200) {
        setProgress(100);
        const blob = new Blob([xhr.response], { type: xhr.getResponseHeader("Content-Type") || "application/pdf" });
        const url = URL.createObjectURL(blob);
        const isZip = slug === "split-pdf";

        sessionStorage.setItem("processedFile", JSON.stringify({
          url, size: blob.size,
          name: isZip ? `${files[0].name}_split.zip` : `compressed_${files[0].name}`,
          type: isZip ? "application/zip" : "application/pdf"
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
      {/* LOADER OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-[999] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl text-center">
            <div className="mb-6 relative inline-flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-[6px] border-slate-100 border-t-blue-600 animate-spin"></div>
              <Sparkles className="absolute text-blue-600 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-6">{progress < 90 ? "Uploading" : "Processing"}...</h2>
            <div className="bg-slate-100 h-4 rounded-full overflow-hidden mb-4">
              <div style={{ width: `${progress}%` }} className="h-full bg-blue-600 transition-all duration-500"></div>
            </div>
            <span className="text-blue-600 font-black text-xl">{progress}%</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-10 transition-all">
          <ArrowLeft size={18} /> Back
        </button>

        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 capitalize leading-tight">
            {slug.split("-").join(" ")} <span className="text-blue-600">Preview</span>
          </h1>
        </header>

        {/* COMPRESSION INPUT (Zero fix) */}
        {slug === "compress-pdf" && (
          <div className="bg-white border-2 border-slate-100 rounded-[32px] p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Settings2 size={24}/></div>
              <span className="font-black text-slate-700">Enter Target Size (KB):</span>
            </div>
            <input 
              type="number" 
              value={targetSize} 
              onChange={(e) => setTargetSize(Math.max(1, Number(e.target.value)))}
              className="w-40 bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 font-black text-blue-600 text-xl focus:border-blue-500 outline-none transition-all"
            />
          </div>
        )}

        {/* FILE GRID (Fixed Alignment) */}
        <DndContext collisionDetection={closestCenter} onDragEnd={() => {}}>
          <SortableContext items={files.map(f => f.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 items-stretch">
              {files.map((file, i) => (
                <SortableFile key={file.id} file={file} index={i} removeFile={() => {}} />
              ))}
              
              {slug !== "split-pdf" && (
                <button onClick={() => fileInputRef.current?.click()} className="bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-6 min-h-[200px] hover:border-blue-400 hover:bg-blue-50 transition-all group">
                  <input type="file" ref={fileInputRef} className="hidden" />
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all mb-3">
                    <Plus size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-blue-600 tracking-widest text-center">Add More</span>
                </button>
              )}
            </div>
          </SortableContext>
        </DndContext>

        <div className="fixed bottom-10 left-0 right-0 px-6 flex justify-center z-[100]">
          <button onClick={handleGenerate} disabled={isProcessing} className="w-full max-w-xl bg-slate-900 text-white py-6 rounded-[28px] font-black text-xl shadow-2xl hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-4">
            {isProcessing ? <Loader2 className="animate-spin" size={24}/> : <CheckCircle size={24} className="text-blue-400" />}
            GENERATE FINAL OUTPUT
          </button>
        </div>
      </div>
    </main>
  );
}
