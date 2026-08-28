import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative px-4 pb-16 pt-16 sm:pt-24 lg:pt-32 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white pointer-events-none" />
      
      <div className="container mx-auto max-w-[1200px] text-center relative z-10">
        <div className="mx-auto flex max-w-fit items-center justify-center space-x-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 shadow-sm backdrop-blur-sm mb-8 transition-colors hover:bg-blue-50">
          <p className="text-[11px] font-bold text-blue-700 tracking-[0.2em] uppercase">
            FAST • PRIVATE • BROWSER-BASED
          </p>
        </div>

        <h1 className="mx-auto max-w-[700px] text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
          Everyday document tools,
          <br className="hidden sm:inline" /> right in your browser.
        </h1>
        
        <p className="mx-auto max-w-[600px] text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed">
          Convert, merge, split and organize your documents without sending your files to a server.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/tools" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto font-bold text-lg h-14 px-8 rounded-xl">
              Choose a Tool
            </Button>
          </Link>
          <Link href="/tools/pdf-to-jpg" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold text-lg h-14 px-8 rounded-xl border-slate-300">
              PDF to JPG
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm font-semibold text-slate-600">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>No uploads</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <Check className="w-4 h-4 text-green-500" />
            <span>No signup</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <Zap className="w-4 h-4 text-green-500" />
            <span>Browser based</span>
          </div>
        </div>
      </div>
    </section>
  );
}
