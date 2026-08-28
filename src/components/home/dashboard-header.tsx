import { ShieldCheck } from "lucide-react";

export function DashboardHeader() {
  return (
    <section className="bg-slate-50 pt-10 pb-6 md:pt-14 md:pb-8 text-center px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-slate-50 pointer-events-none" />
      <div className="container mx-auto max-w-[1240px] relative z-10 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3 leading-tight">
          What do you want to do today?
        </h1>
        <p className="text-base sm:text-lg text-slate-600 mb-6">
          Fast document tools processed directly in your browser.
        </p>
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
          <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
          Files stay on your device
        </div>
      </div>
    </section>
  );
}
