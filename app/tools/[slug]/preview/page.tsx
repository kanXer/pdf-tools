"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  X,
  ArrowLeft,
  CheckCircle,
  Plus,
  Settings2,
  Loader2,
  FileCode2
} from "lucide-react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { getUploadedFiles } from "@/lib/fileStore";

const BASE_URL = "https://pdf-compress-api-nisg.onrender.com";

const apiMap: Record<string, string> = {
  "compress-pdf": "compress-pdf",
  "split-pdf": "split-pdf",
  "merge-pdf": "merge-pdf"
};

const rules: any = {
  "compress-pdf": { multiple: false, min: 1, max: 1, accept: ["application/pdf"] },
  "split-pdf": { multiple: false, min: 1, max: 1, accept: ["application/pdf"] },
  "merge-pdf": { multiple: true, min: 2, max: 20, accept: ["application/pdf"] },
  "image-to-pdf": { multiple: true, min: 1, max: 20, accept: ["image/png", "image/jpeg", "image/jpg"] }
};

/* --- CLEAN SORTABLE COMPONENT --- */
function SortableFile({ file, index, removeFile, getIcon, formatSize }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`${isDragging ? "opacity-30 scale-95" : "opacity-100"} transition-all duration-200`}>
      <div className="group relative bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all">
        
        <button
          onClick={() => removeFile(index)}
          className="absolute -top-2 -right-2 bg-white text-red-500 border border-red-100 rounded-full p-1.5 shadow-md hover:bg-red-50 transition-all z-20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <X size={14} strokeWidth={3} />
        </button>

        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-slate-100 text-slate-500 text-[10px] font-bold h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center rounded-md border border-slate-200">
          {index + 1}
        </div>

        <div {...attributes} {...listeners} className="flex flex-col items-center gap-2 sm:gap-3 cursor-grab active:cursor-grabbing pt-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 flex items-center justify-center rounded-xl sm:rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            {getIcon(file.name)}
          </div>

          <div className="w-full text-center">
            <p className="text-xs sm:text-sm font-bold text-slate-700 truncate px-1">
              {file.name}
            </p>
            <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              {formatSize(file.size)}
            </p>
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

  const endpoint = apiMap[slug];
  const rule = rules[slug] || { multiple: true, min: 1, max: 10, accept: ["*"] };

  const [files, setFiles] = useState<any[]>([]);
  const [targetSize, setTargetSize] = useState(50); 
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), // Improved for touch
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const uploaded = getUploadedFiles();
    if (!uploaded || uploaded.length === 0) {
      router.push(`/tools/${slug}`);
      return;
    }
    const parsed = uploaded.map((f: any, i: number) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      file: f,
      id: `file-${Date.now()}-${i}`
    }));
    setFiles(parsed);
  }, [slug, router]);

  const handleAddMore = (e: any) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const valid = selected.filter((file: any) => rule.accept.includes(file.type));
    
    if (valid.length !== selected.length) {
      alert("Invalid file type selected");
      return;
    }

    let newFiles = valid.map((file: any, i: number) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      id: `file-${Date.now()}-${i}`,
      file
    }));

    if (!rule.multiple) newFiles = [newFiles[0]];
    if (rule.max && (files.length + newFiles.length > rule.max)) {
      alert(`Maximum ${rule.max} files allowed`);
      return;
    }

    setFiles(prev => rule.multiple ? [...prev, ...newFiles] : [newFiles[0]]);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    if (updated.length === 0) router.push(`/tools/${slug}`);
    setFiles(updated);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFiles(items => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleGeneratePDF = async () => {
    if (!endpoint) return;
    if (files.length < rule.min) {
      alert(`Min. ${rule.min} file required`);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0].file);
      if (slug === "compress-pdf") formData.append("target", targetSize.toString());
      
      const res = await fetch(`${BASE_URL}/${endpoint}`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Server Error");
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      sessionStorage.setItem("processedFile", JSON.stringify({
        url, size: blob.size, name: `processed_${files[0].name}`
      }));
      router.push(`/download/${slug}`);
    } catch (err: any) {
      alert("Fail: " + err.message);
      setLoading(false);
    }
  };

  const getIcon = (name?: string) => {
    const ext = name?.split(".").pop()?.toLowerCase();
    if (["pdf"].includes(ext || "")) return <FileText className="w-8 h-8 sm:w-10 sm:h-10" />;
    if (["doc", "docx"].includes(ext || "")) return <FileCode2 className="w-8 h-8 sm:w-10 sm:h-10" />;
    if (["xls", "xlsx"].includes(ext || "")) return <FileSpreadsheet className="w-8 h-8 sm:w-10 sm:h-10" />;
    if (["png", "jpg", "jpeg"].includes(ext || "")) return <FileImage className="w-8 h-8 sm:w-10 sm:h-10" />;
    return <FileText className="w-8 h-8 sm:w-10 sm:h-10" />;
  };

  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <main className="bg-[#f8fafc] min-h-screen pb-32"> {/* Added pb-32 for mobile button safety */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* LOADER OVERLAY */}
        {loading && (
          <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col items-center mx-4">
              <div className="relative mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">Processing...</h2>
            </div>
          </div>
        )}

        {/* TOP NAV */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-10 gap-4">
          <button onClick={() => router.back()} className="self-start sm:self-auto group flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-all">
            <div className="p-2 rounded-xl group-hover:bg-blue-50"><ArrowLeft size={18} /></div>
            Back
          </button>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight capitalize leading-tight">
              {slug.split("-").join(" ")} <span className="text-blue-600">Preview</span>
            </h1>
            <p className="text-slate-400 font-medium text-xs sm:text-sm mt-1">Review or rearrange your files</p>
          </div>
          <div className="hidden sm:block w-24" />
        </div>

        {/* SETTINGS: MOBILE OPTIMIZED */}
        {slug === "compress-pdf" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 mb-8 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl"><Settings2 size={20}/></div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">Target Size</h3>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Desired file size in KB</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6">
              <input 
                type="range" 
                min="50" 
                max="5000" 
                step="50" 
                value={targetSize} 
                onChange={(e) => setTargetSize(Number(e.target.value))} 
                className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
              />
              <div className="relative min-w-[90px] sm:min-w-[110px]">
                <input
                  type="number"
                  value={targetSize}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0) setTargetSize(val);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 pr-8 rounded-xl font-black text-blue-600 text-sm text-center focus:border-blue-500 outline-none appearance-none"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400 uppercase">
                  KB
                </span>
              </div>
            </div>
          </div>
        )}

        {/* FILE GRID */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={files.map(f => f.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {files.map((file, i) => (
                <SortableFile key={file.id} file={file} index={i} removeFile={removeFile} getIcon={getIcon} formatSize={formatSize} />
              ))}

              {(rule.multiple || files.length === 0) && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4 min-h-[140px] sm:min-h-[180px] hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
                >
                  <input type="file" multiple={rule.multiple} accept={rule.accept.join(",")} className="hidden" ref={fileInputRef} onChange={handleAddMore} />
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all mb-2 shadow-inner">
                    <Plus size={20} />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 group-hover:text-blue-600 tracking-widest">Add More</span>
                </button>
              )}
            </div>
          </SortableContext>
        </DndContext>

        {/* FLOATING ACTION BAR: MOBILE SAFE */}
        <div className="fixed bottom-6 sm:bottom-10 left-0 right-0 px-4 sm:px-6 z-[100] flex justify-center">
          <button
            onClick={handleGeneratePDF}
            disabled={loading}
            className="w-full max-w-md bg-slate-900 text-white flex items-center justify-center gap-3 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-2xl hover:bg-blue-600 active:scale-95 transition-all disabled:bg-slate-300"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : <CheckCircle size={20} className="text-blue-400"/>}
            {loading ? "Processing..." : "Generate Final PDF"}
          </button>
        </div>

      </div>
    </main>
  );
}