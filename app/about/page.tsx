"use client";

import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Zap, 
  ShieldCheck, 
  Smile, 
  Globe, 
  Cpu, 
  Lock 
} from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Zap className="text-amber-500" size={24} />,
      title: "Lightning Fast",
      desc: "Our high-speed servers process your PDFs in seconds, not minutes."
    },
    {
      icon: <ShieldCheck className="text-green-500" size={24} />,
      title: "100% Secure",
      desc: "Files are encrypted and automatically deleted after processing."
    },
    {
      icon: <Smile className="text-blue-500" size={24} />,
      title: "Free Forever",
      desc: "No hidden costs, no subscriptions, just pure utility."
    }
  ];

  return (
    <main className="bg-[#f8fafc] min-h-screen pb-20">
        <br /><br />
      {/* Header & Back Button */}
      <div className="max-w-4xl mx-auto px-6 pt-12">

        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            About <span className="text-blue-600">PDF Tools</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            We build simple, powerful, and privacy-focused PDF tools to help you 
            get your work done without the headache of complex software.
          </p>
        </div>

        {/* Core Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative aspect-square bg-white-900 rounded-[2rem] overflow-hidden rotate-3 shadow-2xl hidden md:block">
             {/* Replace with your actual app icon or a nice illustration */}
             <div className="absolute inset-0 flex items-center justify-center -rotate-3">
                <Image src="/icon.png" alt="Logo" width={600} height={180} className="drop-shadow-2xl" />
             </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Why we built this?</h2>
            <p className="text-slate-600 leading-relaxed">
              Managing PDFs shouldn't be expensive or complicated. Most online tools 
              bombard you with ads or limit your file size. We decided to create a 
              <b> "No-Nonsense" </b> platform that just works.
            </p>
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" /> No Watermarks
               </div>
               <div className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" /> No Account Required
               </div>
               <div className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" /> High Quality Compression
               </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-20">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">{f.icon}</div>
              <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Tech & Privacy Section */}
        <div className="bg-slate-900 rounded-[3rem] p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 grid md:grid-cols-2 gap-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-blue-500/30">
                <Cpu size={14} /> Technology
              </div>
              <h2 className="text-3xl font-bold mb-4">Privacy by Design</h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Our processing engine runs on isolated cloud instances. Your data is 
                never stored permanently. We use SSL encryption for every file transfer.
              </p>
              <div className="flex items-center gap-3 text-sm font-semibold text-blue-400">
                <Lock size={16} /> 256-bit Encryption Active
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                  <Globe className="text-blue-500 mb-2" />
                  <span className="text-xs font-bold uppercase">Edge Servers</span>
               </div>
               <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                  <Cpu className="text-purple-500 mb-2" />
                  <span className="text-xs font-bold uppercase">AI Engines</span>
               </div>
            </div>
          </div>
          
          {/* Decorative background circle */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />
        </div>

        {/* Footer Text */}
        <div className="mt-20 text-center">
           <p className="text-slate-400 text-sm">
             © {new Date().getFullYear()} PDF Tools. Built with ❤️ for the Web.
           </p>
        </div>
      </div>
    </main>
  );
}