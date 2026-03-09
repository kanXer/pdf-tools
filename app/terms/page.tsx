"use client";

import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Scale, 
  AlertTriangle, 
  FileCheck, 
  Ban, 
  Clock, 
  CheckCircle2 
} from "lucide-react";

export default function TermsPage() {
  const router = useRouter();

  const termsList = [
    {
      icon: <CheckCircle2 className="text-blue-500" size={24} />,
      title: "Acceptance of Terms",
      desc: "Is website ko use karke aap hamari terms aur conditions se agree karte hain. Agar aap agree nahi hain, toh please is service ka use na karein."
    },
    {
      icon: <Ban className="text-red-500" size={24} />,
      title: "Prohibited Content",
      desc: "Aap koi bhi illegal, virus-infected, ya copyright-infringed content upload nahi kar sakte. Hum kisi bhi illegal activity ke liye zimmedar nahi honge."
    },
    {
      icon: <Clock className="text-amber-500" size={24} />,
      title: "Service Availability",
      desc: "Hum koshish karte hain ki service 24/7 up rahe, lekin maintenance ya server issues ki wajah se downtime ho sakta hai."
    }
  ];

  return (
    <main className="bg-[#f8fafc] min-h-screen pb-20">
        <br />
      <div className="max-w-4xl mx-auto px-6 pt-12">
        

        {/* Title Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                <Scale size={28} />
             </div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tight">
               Terms of <span className="text-blue-600">Service</span>
             </h1>
          </div>
          <p className="text-slate-500 text-lg leading-relaxed border-l-4 border-slate-200 pl-6">
            Hamare PDF tools use karne ke niyam aur shartein. Please ise dhyaan se padhein.
          </p>
        </div>

        {/* Highlighted Terms Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {termsList.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
              <div className="mb-4">{item.icon}</div>
              <h3 className="font-bold text-slate-800 mb-2 leading-tight">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Detailed Sections */}
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-slate-200 shadow-sm space-y-10">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
               <FileCheck className="text-blue-600" size={22} /> 
               Usage License
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Hum aapko hamari website use karne ka temporary permission dete hain personal aur non-commercial use ke liye. Aap hamari service ko reverse-engineer karne ya content ko copy karne ki koshish nahi kar sakte.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
               <AlertTriangle className="text-amber-500" size={22} /> 
               Disclaimer (Zimmedari)
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Hamari service "as is" provide ki jati hai. Hum is baat ki guarantee nahi dete ki output hamesha perfect hoga ya aapki requirements meet karega.
            </p>
            <ul className="space-y-3">
               <li className="flex items-start gap-3 text-sm text-slate-500">
                  <div className="mt-1.5 w-1.5 h-1.5 bg-slate-400 rounded-full shrink-0" />
                  Files ke kisi bhi loss ya data corruption ke liye hum zimmedar nahi hain.
               </li>
               <li className="flex items-start gap-3 text-sm text-slate-500">
                  <div className="mt-1.5 w-1.5 h-1.5 bg-slate-400 rounded-full shrink-0" />
                  Server downtime ya processing delay hamare control se bahar ho sakta hai.
               </li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Modifications</h2>
            <p className="text-slate-600 leading-relaxed">
              Hum bina kisi notice ke in Terms of Service ko kabhi bhi badal sakte hain. Update hone ke baad service use karne ka matlab hai ki aap naye rules se agree karte hain.
            </p>
          </section>

        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-slate-400 text-sm">
           Agar aapke paas koi sawal hai toh please humse contact karein.<br />
           <b>Email:</b> user.kanxer@gmail.com
        </div>

      </div>
    </main>
  );
}