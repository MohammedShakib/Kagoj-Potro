import { ShieldCheck, FileCheck, HardDrive, UserX } from "lucide-react";

export function PrivacySection() {
  return (
    <section className="px-4 py-16 md:py-32 bg-slate-50/50" id="privacy">
      <div className="container mx-auto max-w-[1200px]">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          <div className="flex flex-col space-y-6 lg:col-span-5 text-center lg:text-left">
            <div className="mx-auto lg:mx-0 flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-100/50 text-blue-600 shadow-sm ring-1 ring-blue-100">
              <ShieldCheck className="h-12 w-12" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Built with privacy<br className="hidden lg:block"/> in mind.
            </h2>
            <p className="text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              For Phase 1 tools, your documents are processed entirely inside your browser. Files are never uploaded to Kagoj Potro for conversion.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary">
                <HardDrive className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">Local browser processing</h3>
                <p className="text-slate-500 leading-relaxed">Computations happen directly on your device. We utilize your CPU to process files lightning fast without server bottlenecks.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary">
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">No document storage</h3>
                <p className="text-slate-500 leading-relaxed">We don&apos;t store or read your files. Because they are never uploaded, they vanish completely when you close the tab.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary">
                <UserX className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">No account required</h3>
                <p className="text-slate-500 leading-relaxed">Start using the tools immediately. No signup walls, no premium gates for Phase 1 tools, and absolutely no emails required.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
