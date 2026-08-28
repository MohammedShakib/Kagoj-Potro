import { Zap, ShieldCheck, Minimize2 } from "lucide-react";

export function WorkYourWay() {
  return (
    <section className="px-4 py-16 md:py-24 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto max-w-[1240px]">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4">Work your way</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Kagoj Potro is built to respect your time and your data.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Zap className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">Fast</h3>
            <p className="text-slate-500 leading-relaxed">
              Quick document tasks without waiting for server uploads. Processing happens instantly on your device.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">Private</h3>
            <p className="text-slate-500 leading-relaxed">
              Files stay inside your browser for all supported local tools. We never see or store your documents.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Minimize2 className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">Simple</h3>
            <p className="text-slate-500 leading-relaxed">
              No account, no unnecessary workflow, no complicated settings. Just select a tool and get the job done.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
