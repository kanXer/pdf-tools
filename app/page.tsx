"use client";

import Link from "next/link";
import {
  FileText,
  FileImage,
  FileSpreadsheet,
  Scissors,
  Combine,
  Archive,
  ArrowRight,
} from "lucide-react";

type Tool = {
  name: string;
  description: string;
  link: string;
  color: string;
  icon: React.ElementType;
};

export default function Home() {
  const tools: Tool[] = [
    {
      name: "Compress PDF",
      description: "Reduce file size without losing quality.",
      link: "/tools/compress-pdf",
      color: "from-red-400 to-pink-600",
      icon: Archive,
    },
    {
      name: "Merge PDF",
      description: "Combine multiple PDFs into one document.",
      link: "/tools/merge-pdf",
      color: "from-orange-400 to-red-500",
      icon: Combine,
    },
    {
      name: "Split PDF",
      description: "Separate one page or a whole set.",
      link: "/tools/split-pdf",
      color: "from-yellow-400 to-orange-500",
      icon: Scissors,
    },
    {
      name: "Word to PDF",
      description: "Make DOC and DOCX files easy to read.",
      link: "/tools/word-to-pdf",
      color: "from-blue-400 to-blue-700",
      icon: FileText,
    },
    {
      name: "Image to PDF",
      description: "Convert JPG, PNG, and BMP to PDF.",
      link: "/tools/image-to-pdf",
      color: "from-indigo-400 to-purple-600",
      icon: FileImage,
    },
    {
      name: "Excel to PDF",
      description: "Convert Excel spreadsheets to PDF.",
      link: "/tools/excel-to-pdf",
      color: "from-green-500 to-emerald-700",
      icon: FileSpreadsheet,
    },
    {
      name: "PDF to JPG",
      description: "Extract images or save pages as JPG.",
      link: "/tools/pdf-to-jpg",
      color: "from-emerald-400 to-teal-600",
      icon: FileImage,
    },
    {
      name: "PDF to PNG",
      description: "High quality page to PNG conversion.",
      link: "/tools/pdf-to-png",
      color: "from-teal-400 to-cyan-600",
      icon: FileImage,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50 to-transparent -z-10" />

      {/* HERO SECTION */}
      <section className="relative text-center py-24 px-6">
        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-blue-600 uppercase bg-blue-100 rounded-full">
          100% Free & Secure
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Every tool you need <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            to work with PDFs
          </span>
        </h1>

        <p className="mt-8 text-slate-600 max-w-2xl mx-auto text-xl leading-relaxed">
          Merge, split, compress and convert PDFs easily. Fast, secure and
          completely free online tools.
        </p>

        {/* Scroll Button */}
        <div className="mt-10">
          <Link 
            href="#tools" 
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg active:scale-95 inline-block"
          >
            Explore Tools
          </Link>
        </div>
      </section>

      {/* TOOLS GRID - Fixed offset with scroll-mt-24 */}
      <section id="tools" className="max-w-7xl mx-auto px-6 pb-32 scroll-mt-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool, index) => {
            const Icon = tool.icon;

            return (
              <Link key={index} href={tool.link} className="group">
                <div className="h-full bg-white border border-slate-200 rounded-[2rem] p-8 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 flex flex-col items-start relative overflow-hidden">
                  
                  {/* Subtle Background Glow on Hover */}
                  <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-full blur-2xl`} />

                  <div
                    className={`bg-gradient-to-br ${tool.color} w-14 h-14 flex items-center justify-center rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={28} className="text-white" />
                  </div>

                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {tool.name}
                  </h2>

                  <p className="mt-3 text-slate-500 leading-relaxed text-sm">
                    {tool.description}
                  </p>

                  <div className="mt-auto pt-6 flex items-center text-blue-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
                    Get Started <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-slate-900 py-20 rounded-t-[3rem]">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to optimize your documents?
          </h2>
          <p className="text-slate-400 mt-4 text-lg">
            No registration required. Just upload and convert.
          </p>
          <button className="mt-10 bg-white text-slate-900 px-10 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-xl">
            <Link 
            href="#tools">View All PDF Tools</Link>
          </button>
        </div>
      </section>
    </main>
  );
}