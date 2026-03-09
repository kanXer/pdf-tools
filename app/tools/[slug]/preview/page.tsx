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

/* --- IMPROVED FILE CARD --- */
function SortableFile({ file, index, removeFile }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: file.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 1 };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div ref={setNodeRef} style={style} className={`${isDragging ? "opacity-40 scale-95" : "opacity-100"} transition-all duration-300`}>
      <div className="group relative bg-white border-2 border-slate-100 rounded-[24px] p-5 shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col items-center">
        
        {/* Remove Button */}
        <button onClick={() => removeFile(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-all z-20">
          <X size={14} strokeWidth={4} />
        </button>

        {/* File Index Badge */}
        <div className="absolute top-3 left-3 bg-slate-100 text-slate-500 text-[10px] font-black h-6 w-6 flex items-center justify-center rounded-lg border border-slate-200">
          {index + 1}
        </div>

        <div {...attributes} {...listeners} className="flex flex-col items-center gap-4 cursor-grab active:cursor-grabbing w-full">
          <div className="relative">
            <div className="w-20 h-20 bg-blue-50 flex items-center justify-center rounded-[20px] text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
              <FileText size={40} />
            </div>
          </div>
          
          <div className="w-full text-center">
            <h4 className="text-sm font-black text-slate-800 truncate w-full px-2" title={file.name}>
              {file.name}
            </h4>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              <HardDrive size={10} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                {formatSize(file.size)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- MAIN PREVIEW PAGE --- */
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
    setFiles(uploaded.map((f: any, i: number) => ({ ...f, id: `file-${Date.now()}-${i}`, file: f })));
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
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setProgress(Math.min(percent, 90));
      }
    });

    xhr.onload = function () {
      if (xhr.status === 200) {
        setProgress(100);
        const blob = new Blob([xhr.response], { type: xhr.getResponseHeader("Content-Type") || "application/pdf" });
        const url = URL.createObjectURL(blob);
        const isZip = slug === "split-pdf";

        sessionStorage.setItem("processedFile", JSON.stringify({
          url,
          size: blob.size,
          name: isZip ? `${files[0].name}_split.zip` : `compressed_${files[0].name}`,
          type: isZip ? "application/zip" : "application/pdf"
        }));

        setTimeout(() => router.push(`/download/${slug}`), 800);
      } else {
        alert("Server Error! Check logs.");
        setIsProcessing(false);
      }
    };

    xhr.open("POST", `${BASE_URL}/${slug}`);
    xhr.responseType = "blob";
    xhr.send(formData);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    if (updated.length === 0) router.push(`/tools/${slug}`);
    setFiles(updated);
  };

  return (
    <main className="bg-[#fcfdfe] min-h-screen pb-40">
      {/* PROGRESS OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-[999] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl text-center border border-white/20">
            <div className="mb-8 relative inline-flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border-[8px] border-slate-50 border-t-blue-600 animate-spin"></div>
              <Sparkles className="absolute text-blue-600 w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">{progress < 90 ? "Uploading" : "Processing"}</h2>
            <p className="text-slate-400 font-bold text-sm mb-10 italic">Sit tight, magic is happening...</p>
            
            <div className="bg-slate-100 h-5 rounded-full overflow-hidden p-1 shadow-inner">
              <div style={{ width: `${progress}%` }} className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500 shadow-lg"></div>
            </div>
            <span className="block mt-4 text-blue-600 font-black text-2xl tracking-tighter">{progress}%</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-blue-600 font-black text-sm shadow-sm hover:shadow-md transition-all mb-12">
          <ArrowLeft size={16} strokeWidth={3} /> Back
        </button>

        <header className="mb-14">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight capitalize">
            {slug.split("-").join(" ")} <span className="text-blue-600">Review</span>
          </h1>
          <p className="text-slate-400 font-bold text-lg mt-3">Ready to transform your files?</p>
        </header>

        {/* SETTINGS (COMPRESS ONLY) */}
        {slug === "compress-pdf" && (
          <div className="bg-white border-2 border-blue-600/5 rounded-[32px] p-8 mb-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-blue-200 shadow-lg"><Settings2 size={28}/></div>
              <div>
                <h3 className="font-black text-slate-900 text-xl tracking-tight">Target Quality</h3>
                <p className="text-sm text-slate-400 font-bold mt-1">Maximum allowed size in KB</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-3xl border-2 border-slate-100">
              <input 
                type="number" 
                value={targetSize} 
                onChange={(e) => setTargetSize(Math.max(1, Number(e.target.value)))}
                className="w-36 bg-white border-2 border-slate-200 rounded-[20px] px-5 py-3 font-black text-blue-600 text-xl focus:border-blue-500 outline-none transition-all shadow-inner"
              />
              <span className="font-black text-slate-400 pr-5 uppercase text-xs tracking-[0.2em]">KB</span>
            </div>
          </div>
        )}

        {/* FILE GRID */}
        <DndContext collisionDetection={closestCenter} onDragEnd={() => {}}>
          <SortableContext items={files.map(f => f.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {files.map((file, i) => (
                <SortableFile key={file.id} file={file} index={i} removeFile={removeFile} />
              ))}
              
              {slug !== "split-pdf" && (
                <button onClick={() => fileInputRef.current?.click()} className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center p-8 min-h-[220px] hover:border-blue-400 hover:bg-white transition-all group">
                  <input type="file" ref={fileInputRef} className="hidden" />
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all mb-4">
                    <Plus size={32} strokeWidth={3} />
                  </div>
                  <span className="text-xs font-black uppercase text-slate-400 group-hover:text-blue-600 tracking-widest text-center">Add More</span>
                </button>
              )}
            </div>
          </SortableContext>
        </DndContext>

        {/* FLOATING ACTION BAR */}
        <div className="fixed bottom-10 left-0 right-0 px-8 flex justify-center z-[100]">
          <button 
            onClick={handleGenerate} 
            disabled={isProcessing}
            className="w-full max-w-xl bg-slate-900 text-white py-6 rounded-[30px] font-black text-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-blue-600 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:bg-slate-200"
          >
            {isProcessing ? <Loader2 className="animate-spin" size={28}/> : <CheckCircle size={28} className="text-blue-400" />}
            {isProcessing ? "TRANSFORMING..." : "GENERATE FINAL PDF"}
          </button>
        </div>
      </div>
    </main>
  );
        }
          
