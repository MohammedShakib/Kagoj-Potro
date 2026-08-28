import { ShieldCheck } from "lucide-react";

export function PrivacyNote() {
  return (
    <div className="mx-auto flex max-w-sm items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
      <ShieldCheck className="h-5 w-5 shrink-0" />
      <span>Your files never leave your device.</span>
    </div>
  );
}
