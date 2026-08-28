import { ShieldCheck, FileCheck, HardDrive, UserX } from "lucide-react";

export function PrivacySection() {
  return (
    <section className="px-4 py-16 bg-white" id="privacy">
      <div className="container mx-auto max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          
          <div className="flex flex-col items-center justify-center space-y-6 lg:items-start lg:text-left">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-green-50 text-green-600 shadow-sm ring-1 ring-green-100">
              <ShieldCheck className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl text-center lg:text-left">
                Built with privacy in mind.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground text-center lg:text-left">
                For Phase 1 tools, your documents are processed inside your browser. Files are not uploaded to Kagoj Potro for conversion.
              </p>
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border bg-card p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HardDrive className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Local browser processing</h3>
                <p className="text-sm text-muted-foreground mt-1">Computations happen directly on your device CPU.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">No document storage</h3>
                <p className="text-sm text-muted-foreground mt-1">We don&apos;t store or read your files. They vanish when you close the tab.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserX className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">No account required</h3>
                <p className="text-sm text-muted-foreground mt-1">Start using the tools immediately. No signup walls.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
