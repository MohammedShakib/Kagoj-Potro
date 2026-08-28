import { ShieldCheck, HardDrive, UploadCloud, Database } from "lucide-react";

export function PrivacyStrip() {
  return (
    <section className="bg-blue-50/50 border-y border-blue-100 py-6">
      <div className="container mx-auto max-w-[1200px] px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-blue-700">
            <ShieldCheck className="h-6 w-6" />
            <div>
              <p className="font-bold text-base leading-tight">Files stay on your device</p>
              <p className="text-sm font-medium text-blue-600/80">Phase 1 tools process documents locally in your browser.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-blue-800">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 opacity-70" />
              <span>Local Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <UploadCloud className="h-4 w-4 opacity-70" />
              <span>No Uploads</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 opacity-70" />
              <span>No Storage</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
