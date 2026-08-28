import { FileArchive, Wand2, Type } from "lucide-react";

export function FutureToolsCTA() {
  return (
    <section className="px-4 py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-6">
          More tools are coming.
        </h2>
        <p className="text-lg text-slate-600 mx-auto max-w-2xl leading-relaxed">
          Kagoj Potro is actively growing into a complete everyday document toolkit. We are building advanced optimization, OCR, and editing tools for future phases.
        </p>
        
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 shadow-sm select-none">
            <FileArchive className="h-5 w-5 text-slate-400" />
            <span className="font-semibold text-slate-700">Compress PDF</span>
            <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-700">Coming Soon</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 shadow-sm select-none">
            <Wand2 className="h-5 w-5 text-slate-400" />
            <span className="font-semibold text-slate-700">Watermark</span>
            <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-700">Coming Soon</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 shadow-sm select-none">
            <Type className="h-5 w-5 text-slate-400" />
            <span className="font-semibold text-slate-700">Page Numbers</span>
            <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-700">Coming Soon</span>
          </div>
        </div>
      </div>
    </section>
  );
}
