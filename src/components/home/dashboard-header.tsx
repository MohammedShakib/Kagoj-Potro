import { PrivateIcon } from "@/components/kagoj-icons";
import { ToolIcon } from "@/components/kagoj-icons/tool-icon";

export function DashboardHeader() {
  return (
    <section className="relative overflow-hidden bg-slate-50 px-4 pb-5 pt-10 text-center md:pb-6 md:pt-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_55%)]" />
      <div className="container mx-auto max-w-[1240px] relative z-10 flex flex-col items-center">
        <span className="mb-4 inline-flex items-center rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-700 shadow-sm">
          Kagoj Potro Tools
        </span>
        <h1 className="mb-3 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl md:text-[3.4rem] md:leading-[1.02]">
          What do you want to do today?
        </h1>
        <p className="mb-5 max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-lg">
          Fast document tools processed directly in your browser.
        </p>
        <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/90 px-3.5 py-2 text-[13px] font-semibold text-emerald-800 shadow-sm">
          <ToolIcon
            icon={PrivateIcon}
            toneClassName="bg-white text-emerald-700 ring-emerald-100"
            size="sm"
            className="h-7 w-7 rounded-full [&_svg]:h-4 [&_svg]:w-4"
          />
          Files stay on your device
        </div>
      </div>
    </section>
  );
}
