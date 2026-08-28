import { HardDrive, UserX, FileLock2 } from "lucide-react";

export function PrivacySection() {
  return (
    <section className="px-4 py-16 md:py-24 bg-white" id="privacy">
      <div className="container mx-auto max-w-[1240px]">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4">
            Your documents stay on your device.
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Kagoj Potro processes Phase 1 files directly inside your browser.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center space-y-4 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
              <HardDrive className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg uppercase tracking-wide">Local Processing</h3>
            <p className="text-slate-500 leading-relaxed">
              Calculations happen directly on your device.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-4 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
              <FileLock2 className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg uppercase tracking-wide">No Document Storage</h3>
            <p className="text-slate-500 leading-relaxed">
              Your uploaded documents are not stored by Kagoj Potro.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
              <UserX className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg uppercase tracking-wide">No Account Required</h3>
            <p className="text-slate-500 leading-relaxed">
              Use the tools immediately without signup.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
