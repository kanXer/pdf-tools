"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  FileText, X, ArrowLeft, Plus, Settings2, HardDrive, 
  FileSpreadsheet, File penLine, File
} from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getUploadedFiles } from "@/lib/fileStore";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/* ---------- SORTABLE FILE CARD ---------- */
function SortableFile({ file, removeFile }: { file: any; removeFile: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  // Function to get Icon and Color based on file extension
  const getFileInfo = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['xls', 'xlsx', 'csv'].includes(ext!)) return { icon: <FileSpreadsheet className="md:w-10 md:h-10" />, color: "text-emerald-600", bg: "bg-emerald-50" };
    if (['doc', 'docx'].includes(ext!)) return { icon: <FileText className="md:w-10 md:h-10" />, color: "text-blue-600", bg: "bg-blue-50" };
    if (ext === 'pdf') return { icon: <File className="md:w-10 md:h-10" />, color: "text-red-600", bg: "bg-red-50" };
    return { icon: <FileText className="md:w-10 md:h-10" />, color: "text-slate-600", bg: "bg-slate-50" };
  };

  const info = getFileInfo(file.name);

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div ref={setNodeRef} style={style} className={`${isDragging ? "opacity-40 scale-95" : ""} transition-all w-full flex justify-center`}>
      <div className="relative bg-white border-2 border-slate-100 rounded-[24px] md:rounded-[32px] p-4 md:p-6 shadow-sm hover:shadow-xl flex flex-col items-center w-full max-w-[240px] md:max-w-[280px] min-h-[180px] md:min-h-[220px]">
        <button
          onClick={() => removeFile(file.id)}
          className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 z-10 shadow-lg"
        >
          <X size={12} strokeWidth={4} className="md:w-3.5 md:h-3.5" />
        </button>

        <div {...attributes} {...listeners} className="flex flex-col items-center gap-3 md:gap-4 cursor-grab w-full h-full">
          <div className={`w-14 h-14 md:w-20 md:h-20 ${info.bg} ${info.color} flex items-center justify-center rounded-[18px] md:rounded-[24px] shrink-0`}>
            {info.icon}
          </div>
          
          <div className="text-center w-full flex flex-col items-center flex-grow justify-between">
            <h4 className="text-[11px] md:text-sm font-black text-slate-800 break-all w-full px-1 leading-tight mb-2">
              {file.name}
            </h4>
            
            <div className="mt-auto inline-flex items-center gap-1 bg-slate-100 px-2 md:px-3 py-1 rounded-full shrink-0">
              <HardDrive size={10} className="text-slate-400" />
              <span className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                {formatSize(file.size)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- MAIN COMPONENT ---------- */
export default function PreviewPage() {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string) || "";

  const [files, setFiles] = useState<any[]>([]);
  const [targetSize, setTargetSize] = useState(150);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // Logic to determine allowed modes
  const isMergeMode = slug === "merge-pdf";
  const isImageMode = slug === "image-to-pdf";
  const isWordMode = slug === "word-to-pdf";
  const isExcelMode = slug === "excel-to-pdf";
  
  // Decide if multiple files are allowed (Merge/Images usually support multiple)
  const allowMultiple = isMergeMode || isImageMode;

  useEffect(() => {
    const uploaded = getUploadedFiles();
    if (!uploaded || uploaded.length === 0) {
      setShouldRedirect(true);
      return;
    }
    const mapped = uploaded.map((f: any, i: number) => ({
      id: `file-${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      file: f,
    }));
    setFiles(mapped);
  }, []);

  useEffect(() => {
    if (shouldRedirect) router.push(`/tools/${slug}`);
  }, [shouldRedirect, router, slug]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const filtered = prev.filter((f) => f.id !== id);
      if (filtered.length === 0) setShouldRedirect(true);
      return filtered;
    });
  };

  const addMoreFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newlyAdded = Array.from(e.target.files || []).map((f, i) => ({
      id: `file-${Date.now()}-${i}-${Math.random()}`,
      name: f.name,
      size: f.size,
      file: f,
    }));
    setFiles((prev) => allowMultiple ? [...prev, ...newlyAdded] : newlyAdded);
  };

  const handleGenerate = () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(0);

    const formData = new FormData();
    if (allowMultiple) {
      files.forEach((f) => formData.append("files", f.file));
    } else {
      formData.append("file", files[0].file);
    }

    if (slug === "compress-pdf") formData.append("target", targetSize.toString());

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 90));
    });

    xhr.onload = function () {
      if (xhr.status === 200) {
        setProgress(100);
        const blob = new Blob([xhr.response], { type: xhr.getResponseHeader("Content-Type") || "application/pdf" });
        const url = URL.createObjectURL(blob);
        let downloadName = slug.includes("split") ? "split_files.zip" : "processed_document.pdf";
        
        sessionStorage.setItem("processedFile", JSON.stringify({ 
          url, 
          size: blob.size, 
          name: downloadName, 
          type: slug === "split-pdf" ? "application/zip" : "application/pdf" 
        }));
        
        setTimeout(() => router.push(`/download/${slug}`), 800);
      } else {
        alert("Server Error. Please try again.");
        setIsProcessing(false);
      }
    };

    xhr.open("POST", `${BASE_URL}/${slug}`);
    xhr.responseType = "blob";
    xhr.send(formData);
  };

  // Dynamic Accept Logic
  const getAcceptString = () => {
    if (isImageMode) return "image/*";
    if (isWordMode) return ".doc,.docx";
    if (isExcelMode) return ".xls,.xlsx";
    return ".pdf";
  };

  return (
    <main className="bg-[#f8fafc] min-h-screen pb-44">
      {/* PROCESSING LOADER */}
      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/95 flex items-center justify-center z-[100] backdrop-blur-md p-6">
          <div className="bg-white rounded-[32px] md:rounded-[40px] p-8 md:p-12 w-full max-w-sm text-center shadow-2xl">
            <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 md:mb-8">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
              <div className="relative flex items-center justify-center w-full h-full bg-slate-50 rounded-full border-4 border-blue-50">
                <img src="/icon.png" alt="Processing" className="w-12 h-12 md:w-16 md:h-16 object-contain animate-pulse" />
              </div>
            </div>
            <h2 className="font-black text-xl md:text-2xl mb-2 text-slate-800">
              {progress < 90 ? "Uploading..." : "Finalizing..."}
            </h2>
            <div className="w-full bg-slate-100 h-3 md:h-4 rounded-full overflow-hidden mb-3 p-1 border border-slate-200">
              <div 
                style={{ width: `${progress}%` }} 
                className="bg-blue-600 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
              />
            </div>
            <span className="text-blue-600 font-black text-xl md:text-2xl">{progress}%</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col items-center">
        <div className="w-full max-w-6xl flex items-center mb-6 md:mb-10">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors text-sm md:text-base">
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        <header className="mb-10 md:mb-14 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 capitalize tracking-tight px-2">
            {slug.split("-").join(" ")} <span className="text-blue-600">Review</span>
          </h1>
          <p className="mt-3 text-slate-500 font-medium text-sm md:text-base px-4">
            {allowMultiple ? "Reorder your files by dragging or add more." : "Review your file before processing."}
          </p>
        </header>

        {slug === "compress-pdf" && (
          <div className="bg-white border-2 border-blue-100 rounded-[24px] md:rounded-[32px] p-6 md:p-8 mb-10 w-full max-w-md flex items-center justify-between shadow-sm mx-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Settings2 className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />
              <span className="font-black text-slate-700 text-sm md:text-base tracking-tight">Target (KB)</span>
            </div>
            <input
              type="number"
              value={targetSize}
              onChange={(e) => setTargetSize(Number(e.target.value))}
              className="border-2 border-slate-100 rounded-xl px-3 py-2 w-20 md:w-28 focus:border-blue-500 outline-none font-bold text-center text-sm md:text-base"
            />
          </div>
        )}

        <div className="w-full flex justify-center px-2">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={files.map((f) => f.id)} strategy={rectSortingStrategy}>
              <div className={`grid gap-4 md:gap-8 justify-center items-center w-full
                ${files.length === 1 && !allowMultiple 
                  ? "grid-cols-1" 
                  : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                }`}
              >
                {files.map((file) => (
                  <SortableFile key={file.id} file={file} removeFile={removeFile} />
                ))}

                {allowMultiple && (
                  <div className="flex justify-center w-full">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full max-w-[240px] md:max-w-[280px] h-[180px] md:h-[220px] border-3 md:border-4 border-dashed border-slate-200 rounded-[24px] md:rounded-[32px] flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:bg-blue-50/50 transition-all group shadow-sm bg-white/50 p-4"
                    >
                      <Plus size={32} className="group-hover:scale-110 transition-transform md:w-10 md:h-10" />
                      <span className="font-black text-[10px] md:text-xs mt-2 uppercase tracking-widest text-center">Add More</span>
                    </button>
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        multiple={allowMultiple}
        accept={getAcceptString()}
        className="hidden"
        onChange={addMoreFiles}
      />

      <div className="fixed bottom-6 md:bottom-10 left-0 right-0 flex justify-center px-4 md:px-6 z-40">
        <button
          onClick={handleGenerate}
          disabled={isProcessing}
          className="w-full md:w-auto bg-slate-900 hover:bg-blue-600 text-white px-8 md:px-16 py-4 md:py-6 rounded-full font-black text-lg md:text-xl shadow-2xl hover:shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-tight disabled:bg-slate-400"
        >
          {isProcessing ? "Processing..." : "Generate Final Document"}
        </button>
      </div>
    </main>
  );
}
