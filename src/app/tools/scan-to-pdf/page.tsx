"use client";

import { useState, useRef, useEffect } from "react";
import { TOOLS } from "@/config/tools";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { RelatedTools } from "@/components/tools/related-tools";
import { Button } from "@/components/ui/button";
import { Camera, Image as ImageIcon, Plus, Loader2 } from "lucide-react";
import type { ScannerState, ScanPage, Quadrilateral, ScanFilter } from "@/types/scanner";
import { CameraView } from "@/components/tools/scanner/camera-view";
import { CropAdjuster } from "@/components/tools/scanner/crop-adjuster";
import { PageReview } from "@/components/tools/scanner/page-review";
import { ScannerEngine } from "@/lib/cv/scanner-engine";

import { convertImagesToPdf } from "@/lib/pdf/image-to-pdf";
import { ResultCard } from "@/components/tools/result-card";
import { useRouter } from "next/navigation";
import { sanitizeFileName } from "@/lib/utils";

export default function ScanToPdfPage() {
  const tool = TOOLS.find((t) => t.id === "scan-to-pdf")!;
  const [state, setState] = useState<ScannerState | "complete">("idle");
  const [pages, setPages] = useState<ScanPage[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const engineRef = useRef<ScannerEngine | null>(null);
  const router = useRouter();

  useEffect(() => {
    engineRef.current = new ScannerEngine();
    return () => {
      engineRef.current?.destroy();
    };
  }, []);

  const activePage = pages.find(p => p.id === activePageId);

  const handleOpenCamera = () => {
    setState("camera");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processNewCapture(e.target.files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCancelCamera = () => {
    setState(pages.length > 0 ? "review" : "idle");
  };

  const handleCapture = async (blob: Blob) => {
    await processNewCapture(blob);
  };

  const processNewCapture = async (blob: Blob) => {
    setState("processing");
    try {
      const id = crypto.randomUUID();
      const previewUrl = URL.createObjectURL(blob);
      
      const newPage: ScanPage = {
        id,
        originalBlob: blob,
        processedBlob: blob,
        previewUrl,
        rotation: 0,
        filter: "original"
      };

      setPages(prev => [...prev, newPage]);
      setActivePageId(id);

      if (engineRef.current) {
        await engineRef.current.waitUntilReady();
        const detectedCorners = await engineRef.current.detectDocument(blob);
        if (detectedCorners) {
          setPages(prev => prev.map(p => p.id === id ? { ...p, corners: detectedCorners } : p));
        }
      }
      
      setState("adjusting");
    } catch (err) {
      console.error(err);
      setState("adjusting");
    }
  };

  const handleCropDone = async (corners: Quadrilateral) => {
    if (!activePage) return;
    setPages(prev => prev.map(p => p.id === activePage.id ? { ...p, corners } : p));
    await applyTransformation(activePage.id, corners, activePage.filter);
  };

  const applyTransformation = async (pageId: string, corners: Quadrilateral, filter: ScanFilter) => {
    const page = pages.find(p => p.id === pageId);
    if (!page || !engineRef.current) return;

    setState("processing");
    try {
      await engineRef.current.waitUntilReady();
      const processedBlob = await engineRef.current.transformPerspective(page.originalBlob, corners, filter);
      
      URL.revokeObjectURL(page.previewUrl);
      const newPreviewUrl = URL.createObjectURL(processedBlob);
      
      setPages(prev => prev.map(p => p.id === pageId ? { 
        ...p, 
        processedBlob, 
        previewUrl: newPreviewUrl,
        corners,
        filter
      } : p));

      setState("page_review");
    } catch (err) {
      console.error("Transformation failed:", err);
      setState("page_review");
    }
  };

  const handleFilterChange = (filter: ScanFilter) => {
    if (!activePage || !activePage.corners) return;
    applyTransformation(activePage.id, activePage.corners, filter);
  };

  const handleDeletePage = () => {
    if (!activePage) return;
    URL.revokeObjectURL(activePage.previewUrl);
    setPages(prev => prev.filter(p => p.id !== activePage.id));
    setActivePageId(null);
    setState(pages.length > 1 ? "review" : "idle");
  };

  const handleRetakePage = () => {
    handleDeletePage();
    setState("camera");
  };

  const handleRotatePage = () => {
    if (!activePage) return;
    console.log("Rotate clicked (mock)");
  };

  const handleCreatePdf = async () => {
    setState("processing");
    try {
      const filesToConvert = pages.map((p, i) => new File([p.processedBlob], `scan-page-${i + 1}.jpg`, { type: "image/jpeg" }));
      const pdf = await convertImagesToPdf(filesToConvert, {
        onProgress: () => {},
      });
      setPdfBlob(pdf);
      setState("complete");
    } catch (err) {
      console.error("PDF generation failed:", err);
      setState("review");
      alert("Failed to create PDF. Please try again.");
    }
  };

  const handleReset = () => {
    pages.forEach(p => URL.revokeObjectURL(p.previewUrl));
    setPages([]);
    setActivePageId(null);
    setPdfBlob(null);
    setState("idle");
  };

  if (state === "camera") {
    return <CameraView onCapture={handleCapture} onCancel={handleCancelCamera} />;
  }

  if (state === "adjusting" && activePage) {
    return (
      <div className="fixed inset-0 z-50">
        <CropAdjuster 
          previewUrl={URL.createObjectURL(activePage.originalBlob)} 
          initialCorners={activePage.corners}
          onDone={handleCropDone}
          onRetake={handleRetakePage}
        />
      </div>
    );
  }

  if (state === "page_review" && activePage) {
    return (
      <div className="fixed inset-0 z-50">
        <PageReview 
          previewUrl={activePage.previewUrl}
          activeFilter={activePage.filter}
          onFilterChange={handleFilterChange}
          onRotate={handleRotatePage}
          onRetake={handleRetakePage}
          onDelete={handleDeletePage}
          onDone={() => setState("review")}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 relative">
      {state === "processing" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm text-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="font-medium tracking-wide">Processing Document...</p>
          </div>
        </div>
      )}

      <main className="flex-1 pb-16 pt-8 md:pt-12">
        <div className="container mx-auto max-w-[1000px] px-4">
          <ToolPageHeader tool={tool} />

          <div className="mx-auto max-w-2xl">
            {(state === "idle" || pages.length === 0) && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Camera className="h-10 w-10" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900">Scan a document</h3>
                <p className="mb-8 text-slate-600">
                  Use your phone camera for the best experience. Your scanned pages stay on your device unless you choose OCR processing.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button size="lg" onClick={handleOpenCamera} className="h-14 text-lg w-full sm:w-auto px-8 rounded-xl">
                    <Camera className="mr-2 h-5 w-5" />
                    Open Camera
                  </Button>
                  <Button size="lg" variant="outline" onClick={triggerFileInput} className="h-14 text-lg w-full sm:w-auto px-8 rounded-xl">
                    <ImageIcon className="mr-2 h-5 w-5" />
                    Choose Images
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                  />
                </div>
              </div>
            )}

            {state === "review" && pages.length > 0 && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-xl font-bold">Scanned Pages ({pages.length})</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {pages.map((page, idx) => (
                      <div 
                        key={page.id} 
                        className="group relative aspect-[3/4] overflow-hidden rounded-lg border bg-slate-100 cursor-pointer"
                        onClick={() => {
                          setActivePageId(page.id);
                          setState("page_review");
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={page.previewUrl} 
                          alt={`Page ${idx + 1}`}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={handleOpenCamera}
                      className="flex aspect-[3/4] flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <Plus className="mb-2 h-8 w-8" />
                      <span className="text-sm font-medium">Add Page</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4">
                  <Button onClick={handleCreatePdf} size="lg" className="h-14 px-8 text-lg rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
                    Create PDF
                  </Button>
                </div>
              </div>
            )}

            {state === "complete" && pdfBlob && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <ResultCard
                  title="Scan Complete!"
                  description="Your scanned document is ready to download."
                  blob={pdfBlob}
                  filename="Scanned-Document"
                  onReset={handleReset}
                />
                
                <div className="mt-8 border-t pt-8 text-center">
                  <h4 className="mb-2 font-semibold text-slate-900">Make it searchable?</h4>
                  <p className="mb-4 text-sm text-slate-600">
                    Use our OCR engine to extract text from your scan. Note: This requires uploading the document to our secure servers for processing.
                  </p>
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      const file = new File([pdfBlob], "Scanned-Document.pdf", { type: "application/pdf" });
                      // We can push to OCR page with query param or just navigate. For this MVP, we just navigate.
                      // Wait, we can't easily pass File objects via router. We need a global state or let the user re-upload it.
                      // For now, prompt the user to download then OCR.
                      alert("Download the PDF first, then open the OCR tool to process it.");
                      router.push("/tools/ocr-pdf");
                    }}
                  >
                    Go to OCR PDF Tool
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {state !== "adjusting" && state !== "page_review" && (
        <RelatedTools currentToolId="scan-to-pdf" />
      )}
    </div>
  );
}
