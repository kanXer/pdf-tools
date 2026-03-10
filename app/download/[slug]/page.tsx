"use client";



import { useEffect, useState } from "react";

import { useRouter, useParams } from "next/navigation";

import { 

  Download, ArrowLeft, CheckCircle2, FileText, 

  Archive, Eye, RefreshCcw 

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

    router.push(`/#tools`);

  };



  const downloadFile = () => {

    if (!file) return;

    const link = document.createElement("a");

    link.href = file.url;

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

    // Mobile: py-6 (kam padding), Desktop: py-12

    <main className="min-h-screen bg-[#f8fafc] py-6 sm:py-12 px-4 sm:px-6">

      <div className="max-w-3xl mx-auto">

        

        {/* BACK BUTTON - Text thoda chota mobile par */}

        <button 

          onClick={handleGoBack}

          className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-all mb-6 sm:mb-12 text-sm sm:text-base"

        >

          <div className="p-2 rounded-xl group-hover:bg-blue-50 transition-colors">

            <ArrowLeft size={18} />

          </div>

          Convert Another

        </button>



        {/* SUCCESS CARD - Rounded corners aur padding adjust ki gayi hai */}

        <div className="bg-white border-2 border-slate-100 rounded-[30px] sm:rounded-[40px] p-6 sm:p-12 shadow-2xl shadow-blue-900/5 text-center relative overflow-hidden">

          

          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-500"></div>

          

          {/* Success Icon - Mobile par thoda chota */}

          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-50 text-green-500 rounded-full mb-6 sm:mb-8 animate-bounce-slow">

            <CheckCircle2 size={36} className="sm:w-[48px]" strokeWidth={2.5} />

          </div>



          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight">

            Your file is <span className="text-blue-600">ready!</span>

          </h1>

          <p className="text-slate-400 font-medium text-base sm:text-lg mb-8 sm:mb-10">

            Successfully processed.

          </p>



          {/* FILE INFO BOX - Mobile par layout stack hoga */}

          <div className="bg-slate-50 border-2 border-slate-100 rounded-3xl p-4 sm:p-6 mb-8 sm:mb-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-left">

            <div className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-md ${isZip ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'}`}>

              {isZip ? <Archive size={32} /> : <FileText size={32} />}

            </div>

            

            <div className="flex-1 min-w-0 w-full text-center sm:text-left">

              <h3 className="font-bold text-slate-800 text-lg sm:text-xl truncate mb-1 px-1" title={file.name}>

                {file.name}

              </h3>

              <div className="flex items-center justify-center sm:justify-start gap-3">

                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">

                  {isZip ? 'Archive' : 'Document'}

                </span>

                <span className="text-slate-400 font-bold text-xs sm:text-sm">

                  {formatSize(file.size)}

                </span>

              </div>

            </div>

          </div>



          {/* ACTIONS - Mobile par primary button bada aur accessible */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

            <button

              onClick={downloadFile}

              className="group bg-blue-600 hover:bg-blue-700 text-white py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95"

            >

              <Download size={22} className="group-hover:animate-bounce" />

              DOWNLOAD NOW

            </button>



            {!isZip ? (

              <button

                onClick={openPreview}

                className="bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl transition-all flex items-center justify-center gap-3 active:bg-slate-50"

              >

                <Eye size={22} />

                PREVIEW

              </button>

            ) : (

              <div className="flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl px-4 py-4 border-2 border-blue-100 font-bold text-xs sm:text-sm">

                ZIP files cannot be previewed.

              </div>

            )}

          </div>



          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center">

            <button 

                onClick={handleGoBack}

                className="text-blue-600 hover:underline font-black flex items-center gap-2 text-sm sm:text-base p-2"

            >

                <RefreshCcw size={16} /> Start New Task

            </button>

          </div>

        </div>

      </div>

    </main>

  );

}