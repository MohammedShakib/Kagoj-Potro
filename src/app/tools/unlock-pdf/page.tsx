"use client";

import { useState } from "react";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ToolUploadZone } from "@/components/tools/tool-upload-zone";
import { unlockPdf } from "@/lib/pdf/unlock-pdf";
import { sanitizeFileName } from "@/lib/utils/file-name";
import { ResultCard } from "@/components/tools/result-card";
import { RelatedTools } from "@/components/tools/related-tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Unlock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { TOOLS } from "@/config/tools";

export default function UnlockPdfPage() {
  const tool = TOOLS.find(t => t.id === "unlock-pdf")!;
  const [file, setFile] = useState<File | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleUnlock = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      const pdfBytes = await unlockPdf(file, password);
      setResultBlob(new Blob([pdfBytes as any], { type: "application/pdf" }));
      toast.success("PDF unlocked successfully!");
    } catch (error: any) {
      console.error("Decryption failed:", error);
      toast.error(error.message?.includes("password") || error.message?.includes("encrypted") ? "Incorrect password." : "Failed to unlock PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResultBlob(null);
    setPassword("");
  };

  return (
    <div className="container max-w-6xl py-8">
      <ToolPageHeader tool={tool} />

      <div className="mt-8">
        {!file ? (
          <ToolUploadZone
            onFilesSelect={(files) => setFile(files[0])}
            accept={{ "application/pdf": [".pdf"] }}
            maxSizeMB={50}
          />
        ) : !resultBlob ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl border shadow-sm">
            <div className="flex items-center justify-center mb-6 text-slate-700">
              <Unlock className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Unlock Document</h3>
            <p className="text-sm text-slate-500 text-center mb-6 text-balance">
              Please enter the current password to unlock the document and remove its encryption.
            </p>

            <div className="space-y-4">
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter current password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleUnlock(); }}
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              <Button 
                onClick={handleUnlock} 
                disabled={isProcessing || !password} 
                className="w-full"
              >
                {isProcessing ? "Unlocking..." : "Unlock PDF"}
              </Button>
            </div>
          </div>
        ) : (
          <ResultCard
            blob={resultBlob}
            filename={`${sanitizeFileName(file.name)}-unlocked.pdf`}
            onReset={reset}
          />
        )}
      </div>

      <RelatedTools currentToolId="unlock-pdf" />
    </div>
  );
}
