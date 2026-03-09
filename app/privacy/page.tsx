"use client";

import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ShieldCheck, 
  EyeOff, 
  Trash2, 
  Lock, 
  UserCheck,
  FileWarning
} from "lucide-react";

export default function PrivacyPage() {
  const router = useRouter();

  const privacyPoints = [
    {
      icon: <EyeOff className="text-blue-500" size={28} />,
      title: "No File Monitoring",
      desc: "Hum aapki files ko kabhi open ya read nahi karte. Processing puri tarah automated engine se hoti hai."
    },
    {
      icon: <Trash2 className="text-red-500" size={28} />,
      title: "Auto-Deletion",
      desc: "Processing ke 1 ghante baad aapki files hamare server se permanent delete ho jati hain."
    },
    {
      icon: <Lock className="text-green-500" size={28} />,
      title: "End-to-End Encryption",
      desc: "Aapka data upload se download tak SSL (Secure Socket Layer) se encrypted rehta hai."
    }
  ];

  return (
    <main className="bg-[#f8fafc] min-h-screen pb-20">
        <br /><br />
      <div className="max-w-4xl mx-auto px-6 pt-12">
        
        {/* Navigation */}

        {/* Hero Section */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 sm:p-12 shadow-sm mb-12 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-green-100">
              <ShieldCheck size={16} /> Privacy First Platform
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4">Your Privacy is <br /><span className="text-blue-600">Our Priority</span></h1>
            <p className="text-slate-500 leading-relaxed max-w-xl">
              Hum jaante hain ki aapke documents sensitive ho sakte hain. Isliye hamne apne system ko aise design kiya hai ki aapka data hamesha safe aur private rahe.
            </p>
          </div>
          <ShieldCheck size={200} className="absolute -right-10 -bottom-10 text-slate-50 opacity-[0.03] rotate-12" />
        </div>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {privacyPoints.map((point, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                {point.icon}
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{point.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{point.desc}</p>
            </div>
          ))}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              <h2 className="text-2xl font-bold text-slate-800">Data Collection</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Hum koi bhi personal information (jaise naam, email ya phone number) collect nahi karte jab tak aap khud humse contact na karein. Hum cookies ka use sirf basic analytics aur user experience behtar banane ke liye karte hain.
            </p>
          </section>

          <section className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100/50">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-800">User Rights</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Aapke paas pura haq hai ki aap apni files ko processing ke baad turant hamare system se hata sakein. Halanki hamara system auto-delete karta hai, lekin "Delete Now" ka option bhi jald hi update kiya jayega.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
              <h2 className="text-2xl font-bold text-slate-800">Third-Party Disclosure</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Hum aapka data kisi bhi third party ko sell ya share nahi karte. Processing ke liye use hone wale servers (Render/AWS) world-class security standards follow karte hain.
            </p>
          </section>
        </div>

        {/* Contact Footer */}
        <div className="mt-20 p-8 border-t border-slate-200 text-center">
          <p className="text-slate-500 text-sm mb-4 italic">
            "We treat your documents like they are our own."
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
            <FileWarning size={14} /> Last Updated: March 2026
          </div>
        </div>

      </div>
    </main>
  );
}