import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  pdfTools: [
    { name: "Compress PDF", href: "/tools/compress-pdf" },
    { name: "Merge PDF", href: "/tools/merge-pdf" },
    { name: "Split PDF", href: "/tools/split-pdf" },
  ],
  convertTools: [
    { name: "Word to PDF", href: "/tools/word-to-pdf" },
    { name: "Image to PDF", href: "/tools/image-to-pdf" },
    { name: "Excel to PDF", href: "/tools/excel-to-pdf" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        
        {/* BRAND SECTION */}
        <div className="md:col-span-1 lg:col-span-2">
          <Link href="/" className="inline-block transition-opacity hover:opacity-80">
            <Image
              src="/iconft.png"
              alt="PDFTools Logo"
              width={180}
              height={50}
              priority
              className="brightness-110"
            />
          </Link>
          <p className="mt-6 text-sm leading-relaxed max-w-xs">
            Professional-grade online tools to compress, merge, and split PDFs 
            instantly. Secure, fast, and completely free.
          </p>
        </div>

        {/* PDF TOOLS */}
        <div>
          <h3 className="text-white font-bold uppercase tracking-wider text-xs mb-5">
            PDF Tools
          </h3>
          <ul className="space-y-3 text-sm">
            {footerLinks.pdfTools.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-blue-400 transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONVERT TOOLS */}
        <div>
          <h3 className="text-white font-bold uppercase tracking-wider text-xs mb-5">
            Convert
          </h3>
          <ul className="space-y-3 text-sm">
            {footerLinks.convertTools.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-blue-400 transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="text-white font-bold uppercase tracking-wider text-xs mb-5">
            Company
          </h3>
          <ul className="space-y-3 text-sm">
            {footerLinks.company.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-blue-400 transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} PDF-Tools. Built for speed.</p>
          <div className="flex gap-6">
             <span className="hover:text-white cursor-default transition-colors">English</span>
             <span className="hover:text-white cursor-default transition-colors">Status: Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}