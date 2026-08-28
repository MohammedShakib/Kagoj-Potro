"use client";

import { useState } from "react";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ToolUploadZone } from "@/components/tools/tool-upload-zone";
import { RelatedTools } from "@/components/tools/related-tools";
import { Button } from "@/components/ui/button";
import { compressPdf, CompressionLevel } from "@/lib/compression/compress-pdf";
import { ResultCard } from "@/components/tools/result-card";
import { sanitizeFileName } from "@/lib/utils/file-name";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Loader2 } from "lucide-react";

import { TOOLS } from "@/config/tools";

export default function CompressPdfPage() {
  const tool = TOOLS.find((t) => t.id === "compress-pdf")!;
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>("recommended");
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error" | "noop">("idle");
  const [progress, setProgress] = useState({ phase: "", percent: 0, message: "" });
  const [result, setResult] = useState<{ blob: Blob; filename: string; stats: any } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFiles = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setStatus("idle");
      setResult(null);
      setErrorMsg("");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleCompress = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress({ phase: "Initializing...", percent: 0, message: "" });

    try {
      const res = await compressPdf(file, {
        level,
        onProgress: (phase, percent, message) => {
          setProgress({ phase, percent: Math.round(percent), message: message || "" });
        },
      });

      if (res.stats.compressedSize >= res.stats.originalSize) {
        setStatus("noop");
      } else {
        const blob = new Blob([res.pdf], { type: "application/pdf" });
        const newFilename = sanitizeFileName(file.name) + "-compressed.pdf";
        setResult({ blob, filename: newFilename, stats: res.stats });
        setStatus("success");
      }
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "Failed to compress PDF. The file might be corrupted or protected.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <main className="flex-1 pb-16 pt-8 md:pt-12">
        <div className="container mx-auto max-w-[1000px] px-4">
          <ToolPageHeader tool={tool} />

          <div className="mx-auto max-w-2xl">
            {status === "idle" && !file && (
              <ToolUploadZone
                onFilesSelect={handleFiles}
                accept={{ "application/pdf": [".pdf"] }}
                maxFiles={1}
                title="Upload PDF to compress"
                subtitle="Files are processed locally in your browser"
              />
            )}

            {status === "idle" && file && (
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between rounded-lg bg-slate-50 p-4 border">
                  <div>
                    <h3 className="font-semibold text-slate-800">{file.name}</h3>
                    <p className="text-sm text-slate-500">{formatSize(file.size)}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                    Change File
                  </Button>
                </div>

                <div className="mb-6 space-y-3">
                  <h4 className="font-medium text-slate-700 mb-2">Compression Level</h4>
                  
                  <button
                    onClick={() => setLevel("high-quality")}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      level === "high-quality" ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-slate-800">High Quality</div>
                      <div className="text-sm text-slate-500">Light compression with minimal visual loss</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setLevel("recommended")}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      level === "recommended" ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="text-left flex items-center gap-3">
                      <div>
                        <div className="font-semibold text-slate-800">Recommended</div>
                        <div className="text-sm text-slate-500">Balanced file size and visual quality</div>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none">Default</Badge>
                    </div>
                  </button>

                  <button
                    onClick={() => setLevel("strong")}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      level === "strong" ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-slate-800">Strong Compression</div>
                      <div className="text-sm text-slate-500">Smaller file size with more quality reduction</div>
                    </div>
                  </button>
                </div>

                <Button className="w-full h-12 text-base" size="lg" onClick={handleCompress}>
                  Compress PDF
                </Button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Processed locally in your browser. Your document is not uploaded.</span>
                </div>
              </div>
            )}

            {status === "processing" && (
              <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">{progress.phase}</h3>
                <p className="text-slate-500 mb-6">{progress.message || "Please wait while we compress your document."}</p>
                <div className="w-full max-w-md mx-auto bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-300 ease-out" 
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-blue-600">{progress.percent}%</p>
                
                <p className="mt-8 text-sm text-slate-400">Large PDFs may take several seconds to process.</p>
              </div>
            )}

            {status === "success" && result && (
              <div className="space-y-6">
                <div className="rounded-xl border bg-white p-6 shadow-sm mb-4">
                  <h3 className="text-lg font-bold text-center mb-6 text-slate-800">Compression Summary</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-sm text-slate-500 mb-1">Original Size</div>
                      <div className="text-xl font-semibold text-slate-700">{formatSize(result.stats.originalSize)}</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="text-sm text-blue-600 mb-1">Compressed Size</div>
                      <div className="text-2xl font-bold text-blue-700">{formatSize(result.stats.compressedSize)}</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="text-sm text-green-600 mb-1">Total Savings</div>
                      <div className="text-xl font-bold text-green-700">-{Math.round(result.stats.percentageSaved)}%</div>
                    </div>
                  </div>
                </div>

                <ResultCard
                  title="PDF Compressed Successfully"
                  description={`We saved ${formatSize(result.stats.bytesSaved)} in file size.`}
                  blob={result.blob}
                  filename={result.filename}
                  onReset={() => {
                    setFile(null);
                    setStatus("idle");
                    setResult(null);
                  }}
                  downloadText="Download Compressed PDF"
                />
              </div>
            )}

            {status === "noop" && (
              <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Already Optimized</h3>
                <p className="text-slate-600 mb-6">
                  This PDF is already well optimized. We could not compress it any further without damaging the visual quality.
                </p>
                <Button variant="outline" size="lg" onClick={() => {
                  setFile(null);
                  setStatus("idle");
                }}>
                  Compress Another PDF
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">Compression Failed</h3>
                <p className="mb-6 text-slate-600">{errorMsg}</p>
                <Button onClick={() => setStatus("idle")}>Try Again</Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <RelatedTools currentToolId="compress-pdf" />
    </div>
  );
}
