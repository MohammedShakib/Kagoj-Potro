import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF to JPG Converter | Kagoj Potro",
  description: "Convert PDF pages to high-quality JPG images directly in your browser with Kagoj Potro. Fast, private and no upload required.",
};

import { Navbar } from "@/components/kagoj-potro/navbar";
import { Footer } from "@/components/kagoj-potro/footer";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col font-sans">
          <Navbar />
          <main className="flex-1 bg-white">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-center" />
        </div>
      </body>
    </html>
  );
}
