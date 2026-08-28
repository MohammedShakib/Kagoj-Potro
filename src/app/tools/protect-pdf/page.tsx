"use client";

import { useState } from "react";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ToolUploadZone } from "@/components/tools/tool-upload-zone";
import { protectPdf } from "@/lib/pdf/protect-pdf";
import { sanitizeFileName } from "@/lib/utils/file-name";
import { ResultCard } from "@/components/tools/result-card";
import { RelatedTools } from "@/components/tools/related-tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { TOOLS } from "@/config/tools";

export default function ProtectPdfPage() {
  const tool = TOOLS.find(t => t.id === "protect-pdf")!;
  const [file, setFile] = useState<File | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleProtect = async () => {
    if (!file) return;
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsProcessing(true);
      const pdfBytes = await protectPdf(file, password);
      setResultBlob(new Blob([pdfBytes as any], { type: "application/pdf" }));
      toast.success("PDF protected successfully!");
    } catch (error) {
      console.error("Encryption failed:", error);
      toast.error("Failed to encrypt PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResultBlob(null);
    setPassword("");
    setConfirmPassword("");
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
              <Lock className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Set Password</h3>
            <p className="text-sm text-slate-500 text-center mb-6 text-balance">
              This password will be required to open the PDF. Don't forget it, it cannot be recovered!
            </p>

            <div className="space-y-4">
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              
              <Button 
                onClick={handleProtect} 
                disabled={isProcessing || !password || !confirmPassword} 
                className="w-full"
              >
                {isProcessing ? "Encrypting..." : "Protect PDF"}
              </Button>
            </div>
          </div>
        ) : (
          <ResultCard
            blob={resultBlob}
            filename={`${sanitizeFileName(file.name)}-protected.pdf`}
            onReset={reset}
          />
        )}
      </div>

      <RelatedTools currentToolId="protect-pdf" />
    </div>
  );
}
