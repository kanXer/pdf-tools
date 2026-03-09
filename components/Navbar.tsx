"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { 
  ChevronDown, 
  Menu, 
  X, 
  LayoutGrid, 
  Zap, 
  FileText, 
  Settings, 
  RefreshCw 
} from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        
        {/* LOGO */}
        {/* LOGO */}
        <Link href="/" className="flex items-center h-full group">
          <div className="relative h-30 w-60 flex items-center justify-center"> 
            {/* flex items-center yahan vertical alignment handle karega */}
            <Image 
              src="/icon.png" 
              alt="SwiftPDF Logo"
              width={380}
              height={85}
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority 
            />
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-10">
          
          {/* ALL TOOLS MEGA DROPDOWN */}
          <div className="relative group py-4">
            <button className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-blue-600 transition-colors">
              <LayoutGrid size={18} />
              All PDF Tools
              <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
            </button>

            {/* MEGA DROPDOWN BOX */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[600px] opacity-0 invisible 
              group-hover:visible group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-4">
              
              <div className="bg-white border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.12)] rounded-3xl p-8 grid grid-cols-2 gap-x-12 gap-y-8">
                
                {/* Organize & Optimize */}
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">
                    <Settings size={12} /> Optimize & Organize
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link href="/tools/compress-pdf" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition">Compress PDF</Link>
                    <Link href="/tools/merge-pdf" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition">Merge PDF</Link>
                    <Link href="/tools/split-pdf" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition">Split PDF</Link>
                  </div>
                </div>

                {/* Convert to PDF */}
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">
                    <FileText size={12} /> Convert to PDF
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link href="/tools/word-to-pdf" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition">Word to PDF</Link>
                    <Link href="/tools/image-to-pdf" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition">Image to PDF</Link>
                    <Link href="/tools/excel-to-pdf" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition">Excel to PDF</Link>
                  </div>
                </div>

                {/* Convert from PDF */}
                <div className="col-span-2 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">
                    <RefreshCw size={12} /> Convert from PDF
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/tools/pdf-to-jpg" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition">PDF to JPG</Link>
                    <Link href="/tools/pdf-to-png" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition">PDF to PNG</Link>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <Link href="/about" className="font-bold text-slate-600 hover:text-blue-600 transition-colors">About</Link>
          <Link href="/contact" className="font-bold text-slate-600 hover:text-blue-600 transition-colors">Contact</Link>
        </div>


        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-3 rounded-2xl bg-slate-50 text-slate-600 active:scale-90 transition-all"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-2xl p-6 overflow-y-auto max-h-[85vh] animate-in fade-in slide-in-from-top-4">
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Popular Tools</p>
              <div className="grid grid-cols-2 gap-3">
                <Link onClick={() => setMenuOpen(false)} href="/tools/merge-pdf" className="p-4 rounded-xl bg-slate-50 font-bold text-sm">Merge</Link>
                <Link onClick={() => setMenuOpen(false)} href="/tools/compress-pdf" className="p-4 rounded-xl bg-slate-50 font-bold text-sm">Compress</Link>
                <Link onClick={() => setMenuOpen(false)} href="/tools/word-to-pdf" className="p-4 rounded-xl bg-slate-50 font-bold text-sm">Word to PDF</Link>
                <Link onClick={() => setMenuOpen(false)} href="/tools/image-to-pdf" className="p-4 rounded-xl bg-slate-50 font-bold text-sm">Image to PDF</Link>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 font-bold text-slate-700 border-t pt-6">
              <Link onClick={() => setMenuOpen(false)} href="/tools/pdf-to-jpg">PDF to JPG</Link>
              <Link onClick={() => setMenuOpen(false)} href="/tools/excel-to-pdf">Excel to PDF</Link>
              <Link onClick={() => setMenuOpen(false)} href="/about">About Us</Link>
              <Link onClick={() => setMenuOpen(false)} href="/contact">Contact</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}