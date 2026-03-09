"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FileText, X, ArrowLeft, CheckCircle, Plus, 
  Settings2, Loader2, Sparkles, Download
} from "lucide-react";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getUploadedFiles } from "@/lib/fileStore";

const BASE_URL = "https://pdf-compress-api-nisg.onrender.com";

/* --- SORTABLE FILE COMPONENT --- */
function SortableFile({ file, index, removeFile }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: file.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`${isDragging ? "opacity-30 scale-95" : "opacity-100"} transition-all duration-200`}>
      <div className="group relative bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all">
        <button onClick={() => removeFile(index)} className="absolute -top-2 -right-2 bg-white text-red-500 border border-red-100 rounded-full p-1.5 shadow-md hover:bg-red-50 z-20">
          <X size={14} strokeWidth={3} />
        </button>
        <div {...attributes} {...listeners} className="flex flex-col items-center gap-3 cursor-grab pt-2">
          <div className="w-16 h-16 bg-blue-50 flex items-center justify-center rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <FileText size={32} />
          </div>
          <div className="w-full text-center">
            <p className="text-sm font-bold text-slate-700 truncate">{file.name}</p>
            <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- MAIN PAGE --- */
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

    // 1. Upload Progress Tracking
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        // 90% tak upload dikhao, baaki 10% server processing ke liye hold rakho
        setProgress(Math.min(percent, 90));
      }
    });

    // 2. Response Handling
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

    xhr.onerror = () => {
      alert("Network Error!");
      setIsProcessing(false);
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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <main className="bg-[#f8fafc] min-h-screen pb-40">
      {/* PROGRESS OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-[999] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl text-center border border-slate-100">
            <div className="mb-6 relative inline-flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-[6px] border-slate-100 border-t-blue-600 animate-spin"></div>
              <Sparkles className="absolute text-blue-600 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">{progress < 90 ? "Uploading..." : "Processing PDF..."}</h2>
            <p className="text-slate-400 text-sm font-medium mb-8">Please wait, do not refresh the page.</p>
            
            <div className="relative pt-1">
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-slate-100">
                <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500 ease-out"></div>
              </div>
              <span className="text-blue-600 font-black text-xl">{progress}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-12">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Upload
        </button>

        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 capitalize leading-tight">
            {slug.split("-").join(" ")} <span className="text-blue-600">Preview</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2">Finalize your document before generation</p>
        </div>

        {/* SETTINGS (COMPRESS ONLY) */}
        {slug === "compress-pdf" && (
          <div className="bg-white border-2 border-blue-50 rounded-[28px] p-6 mb-10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Settings2 size={24}/></div>
              <div>
                <h3 className="font-bold text-slate-800">Target File Size</h3>
                <p className="text-xs text-slate-400 font-medium">Desired size in Kilobytes (KB)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <input 
                type="number" 
                value={targetSize} 
                min={1}
                onChange={(e) => setTargetSize(Math.max(1, Number(e.target.value)))}
                className="w-28 bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-black text-blue-600 focus:ring-2 ring-blue-100 outline-none transition-all"
              />
              <span className="font-bold text-slate-400 pr-3 uppercase text-xs tracking-widest">KB</span>
            </div>
          </div>
        )}

        {/* FILE GRID */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={files.map(f => f.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {files.map((file, i) => (
                <SortableFile key={file.id} file={file} index={i} removeFile={removeFile} />
              ))}
              
              {/* Add PDF: Only if not split-pdf */}
              {slug !== "split-pdf" && (
                <button onClick={() => fileInputRef.current?.click()} className="bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 min-h-[180px] hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
                  <input type="file" ref={fileInputRef} className="hidden" />
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all mb-3">
                    <Plus size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-blue-600 tracking-widest text-center leading-tight">Add More<br/>Files</span>
                </button>
              )}
            </div>
          </SortableContext>
        </DndContext>

        {/* FLOATING ACTION BAR */}
        <div className="fixed bottom-10 left-0 right-0 px-6 flex justify-center z-50">
          <button 
            onClick={handleGenerate} 
            disabled={isProcessing}
            className="w-full max-w-lg bg-slate-900 text-white py-5 rounded-[24px] font-black text-lg shadow-2xl hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:bg-slate-300"
          >
            {isProcessing ? <Loader2 className="animate-spin" size={24}/> : <CheckCircle size={24} className="text-blue-400" />}
            {isProcessing ? "Processing..." : "Generate Final Output"}
          </button>
        </div>
      </div>
    </main>
  );
                  }
