import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConditionalFooter } from "@/components/kagoj-potro/conditional-footer";
import { Navbar } from "@/components/kagoj-potro/navbar";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Kagoj Potro",
    default: "Kagoj Potro",
  },
  description:
    "Convert, merge, split, and organize documents directly in your browser with Kagoj Potro. Fast, private, and built for everyday document work.",
};

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
          <main className="flex-1 bg-white">{children}</main>
          <ConditionalFooter />
          <Toaster position="bottom-center" />
        </div>
      </body>
    </html>
  );
}
