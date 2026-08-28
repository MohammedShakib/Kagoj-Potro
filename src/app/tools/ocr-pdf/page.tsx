"use client";

import { useState, useRef, useEffect } from "react";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ToolUploadZone } from "@/components/tools/tool-upload-zone";
import { RelatedTools } from "@/components/tools/related-tools";
import { Button } from "@/components/ui/button";
import { ResultCard } from "@/components/tools/result-card";
import { sanitizeFileName } from "@/lib/utils/file-name";
import { ShieldCheck, Loader2, Copy, Download as DownloadIcon } from "lucide-react";
import { toast } from "sonner";
import { TOOLS } from "@/config/tools";

type OcrMode = "searchable" | "text";
type Language = "eng" | "ben";


export default function OcrPdfPage() {
  const tool = TOOLS.find((t) => t.id === "ocr-pdf")!;
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<OcrMode>("searchable");
  const [language, setLanguage] = useState<Language>("eng");
  
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [progressMsg, setProgressMsg] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  
  const [resultBlob, setResultBlob] = useState<{ blob: Blob; filename: string } | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Clean up workers on unmount
  useEffect(() => {
    return () => {
      import("@/lib/ocr/ocr-engine").then(({ terminateOcrWorker }) => {
        terminateOcrWorker();
      });
    };
  }, []);

  const handleFiles = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setStatus("idle");
      setResultBlob(null);
      setExtractedText("");
      setErrorMsg("");
    }
  };

  const handleCancel = async () => {
    const { terminateOcrWorker } = await import("@/lib/ocr/ocr-engine");
    await terminateOcrWorker();
    setStatus("idle");
    toast.info("OCR cancelled.");
  };

  const startOcr = async () => {
    if (!file) return;
    setStatus("processing");
    setProgressMsg("Loading PDF...");
    setProgressPercent(0);

    try {
      const { pdfjs } = await import("@/lib/pdf/pdf-worker");
      const { getOcrWorker, runOcr } = await import("@/lib/ocr/ocr-engine");
      const { generateSearchablePdf } = await import("@/lib/ocr/searchable-pdf");
      // Add type here locally
      type OcrPageResultLocal = any;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;

      setProgressMsg("Initializing OCR Engine...");
      const worker = await getOcrWorker(language, (statusText, percent) => {
        // Tesseract internal loading progress
        setProgressMsg(statusText);
      });

      const ocrResults: OcrPageResultLocal[] = [];
      let fullText = "";

      for (let i = 1; i <= totalPages; i++) {
        setProgressMsg(`Processing page ${i} of ${totalPages}...`);
        setProgressPercent(Math.round(((i - 1) / totalPages) * 100));

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // 2.0 for higher OCR fidelity
        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not create canvas context.");
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({ canvasContext: ctx, viewport } as any).promise;

        const ocrData = await runOcr(worker, canvas);

        if (mode === "searchable") {
          ocrResults.push({
            pageIndex: i - 1,
            ocrData: ocrData,
            canvasWidth: canvas.width,
            canvasHeight: canvas.height
          });
        } else {
          fullText += `--- Page ${i} ---\n\n${ocrData.text}\n\n`;
        }
      }

      setProgressPercent(100);
      setProgressMsg("Finalizing...");

      if (mode === "searchable") {
        const newPdfBytes = await generateSearchablePdf(arrayBuffer, ocrResults);
        const blob = new Blob([newPdfBytes as any], { type: "application/pdf" });
        const newFilename = sanitizeFileName(file.name) + "-searchable.pdf";
        setResultBlob({ blob, filename: newFilename });
      } else {
        setExtractedText(fullText);
      }
      
      setStatus("success");
      
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "An error occurred during OCR processing.");
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(extractedText);
    toast.success("Text copied to clipboard!");
  };

  const downloadText = () => {
    if (!file) return;
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = sanitizeFileName(file.name) + "-extracted-text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                title="Upload scanned PDF"
                subtitle="Files are processed locally in your browser"
              />
            )}

            {status === "idle" && file && (
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between rounded-lg bg-slate-50 p-4 border">
                  <div>
                    <h3 className="font-semibold text-slate-800">{file.name}</h3>
                    <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                    Change File
                  </Button>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="font-medium text-slate-700 mb-3">Output Type</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setMode("searchable")}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          mode === "searchable" ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="font-semibold text-slate-800">Searchable PDF</div>
                        <div className="text-xs text-slate-500 mt-1">Keeps original look, adds invisible text layer.</div>
                      </button>
                      <button
                        onClick={() => setMode("text")}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          mode === "text" ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="font-semibold text-slate-800">Extract Text</div>
                        <div className="text-xs text-slate-500 mt-1">Get plain text to copy or download.</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-700 mb-3">Document Language</h4>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as Language)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="eng">English</option>
                      <option value="ben">Bangla / Bengali</option>
                    </select>
                    <p className="mt-2 text-xs text-slate-500">Choosing the correct language improves recognition accuracy.</p>
                  </div>
                </div>

                <Button className="w-full h-12 text-base" size="lg" onClick={startOcr}>
                  Run OCR
                </Button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Processed locally in your browser.</span>
                </div>
              </div>
            )}

            {status === "processing" && (
              <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Running OCR...</h3>
                <p className="text-slate-500 mb-6">{progressMsg}</p>
                <div className="w-full max-w-md mx-auto bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-300 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-blue-600">{progressPercent}%</p>
                
                <p className="mt-8 text-sm text-slate-400">Large or high-resolution PDFs can take several minutes to process.</p>
                
                <Button variant="outline" className="mt-6" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-6">
                {mode === "searchable" && resultBlob && (
                  <ResultCard
                    title="OCR Complete"
                    description="Your searchable PDF is ready."
                    blob={resultBlob.blob}
                    filename={resultBlob.filename}
                    onReset={() => {
                      setFile(null);
                      setStatus("idle");
                      setResultBlob(null);
                    }}
                    downloadText="Download Searchable PDF"
                  />
                )}

                {mode === "text" && (
                  <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-800">Extracted Text</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={copyText}>
                          <Copy className="w-4 h-4 mr-2" /> Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadText}>
                          <DownloadIcon className="w-4 h-4 mr-2" /> Download TXT
                        </Button>
                      </div>
                    </div>
                    <div className="bg-slate-50 border rounded-lg p-4 max-h-96 overflow-y-auto whitespace-pre-wrap font-mono text-sm text-slate-700">
                      {extractedText}
                    </div>
                    <div className="mt-6">
                      <Button variant="outline" className="w-full" onClick={() => {
                        setFile(null);
                        setStatus("idle");
                        setExtractedText("");
                      }}>
                        Start Over
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {status === "error" && (
              <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">OCR Failed</h3>
                <p className="mb-6 text-slate-600">{errorMsg}</p>
                <Button onClick={() => setStatus("idle")}>Try Again</Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <RelatedTools currentToolId="ocr-pdf" />
    </div>
  );
}
