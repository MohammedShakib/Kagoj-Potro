import { ShieldCheck } from "lucide-react";

export function PrivacyStrip() {
  return (
    <section className="bg-primary/5 py-4 border-y">
      <div className="container mx-auto max-w-6xl px-4 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <ShieldCheck className="h-5 w-5" />
            <span>Files stay on your device</span>
          </div>
          <span className="hidden sm:inline text-muted-foreground">•</span>
          <p className="text-sm text-muted-foreground font-medium">
            Phase 1 tools process documents locally in your browser.
          </p>
        </div>
      </div>
    </section>
  );
}
