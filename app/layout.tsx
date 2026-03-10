import type { Metadata, Viewport } from "next";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Inter, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
// Fonts setup
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: 'swap',
});

// Full Metadata
export const metadata: Metadata = {
  title: "PDF Tools - Compress, Merge & Convert PDFs Online",
  description:
    "Free online PDF tools to compress, merge, split and convert files instantly. Fast, secure and easy to use.",
  keywords: ["PDF tools", "merge pdf", "compress pdf", "word to pdf", "pdf converter"],
  authors: [{ name: "FastPDFTool" }],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "PDF Tools - Fast & Secure",
    description: "The best way to manage your PDF documents online.",
    type: "website",
  },
};

// Viewport settings for mobile responsiveness
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body 
        className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-[#f8fafc] text-slate-900`}
        suppressHydrationWarning
      >
        {/* Loader ko fast kiya gaya hai (Speed 1000 se 300) taaki lag na ho */}
        <NextTopLoader
          color="#2563eb"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease-in-out"
          speed={300} 
          shadow="0 0 10px #2563eb,0 0 5px #2563eb"
        />

        {/* Flex Wrapper: Ye ensure karta hai ki Footer hamesha niche rahe aur page jump na kare */}
        <div className="flex flex-col min-h-screen relative overflow-x-hidden">
          <Navbar />
          
          {/* Main Content Area */}
          <main className="flex-grow flex flex-col relative">
            {children}
          </main>

          <Footer />
          <Analytics/>
        </div>
      </body>
    </html>
  );
}