import { ShieldCheck, HardDrive, UserX } from "lucide-react";

export function TrustSection() {
  return (
    <section className="px-4 py-16 bg-white border-t border-slate-100">
      <div className="container mx-auto max-w-[1240px] text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-4">
          Document tools built around privacy.
        </h2>
        <p className="text-base text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Kagoj Potro gives you simple PDF and image utilities while keeping supported Phase 1 processing inside your browser.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-sm font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-primary">
              <HardDrive className="h-5 w-5" />
            </div>
            <span>Browser Processing</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span>No Document Storage</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-primary">
              <UserX className="h-5 w-5" />
            </div>
            <span>No Signup Required</span>
          </div>
        </div>
      </div>
    </section>
  );
}
