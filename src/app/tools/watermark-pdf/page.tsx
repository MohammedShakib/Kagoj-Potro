"use client";

import { useState } from "react";
import { TOOLS } from "@/config/tools";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ToolUploadZone } from "@/components/tools/tool-upload-zone";
import { ProcessingState } from "@/components/tools/processing-state";
import { ResultCard } from "@/components/tools/result-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import { sanitizeFileName } from "@/lib/utils/file-name";
import { Card, CardContent } from "@/components/ui/card";
import { PdfWorkspaceProvider, usePdfWorkspace } from "@/components/pdf-workspace/pdf-workspace";
import { PdfPageThumbnail } from "@/components/pdf-workspace/pdf-page-thumbnail";
import { PageRangeInput } from "@/components/pdf-workspace/page-range-input";
import { addWatermark, WatermarkPosition } from "@/lib/pdf/add-watermark";
import { Settings2, ArrowRight, Type, Image as ImageIcon } from "lucide-react";
import { RelatedTools } from "@/components/tools/related-tools";

export default function WatermarkPdfPage() {
  const tool = TOOLS.find((t) => t.id === "watermark-pdf")!;
  const [file, setFile] = useState<File | null>(null);

  const handleFilesSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  return (
    <div className="container mx-auto max-w-[1240px] px-4 py-10 sm:py-14">
      <ToolPageHeader tool={tool} />

      {!file ? (
        <div className="mx-auto w-full max-w-2xl">
          <Card className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
            <CardContent className="p-5 sm:p-7">
              <ToolUploadZone
                onFilesSelect={handleFilesSelect}
                accept={{ "application/pdf": [".pdf"] }}
                maxSizeMB={100}
                maxFiles={1}
                title="Select PDF"
                buttonText="Choose PDF"
                helperText="PDF"
                icon="pdf"
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <PdfWorkspaceProvider initialFile={file}>
          <WatermarkWorkspace onReset={() => setFile(null)} />
        </PdfWorkspaceProvider>
      )}

      <RelatedTools currentToolId={tool.id} />
    </div>
  );
}

function WatermarkWorkspace({ onReset }: { onReset: () => void }) {
  const {
    file,
    pdfDocument,
    status: workspaceStatus,
    pages,
    setPages,
  } = usePdfWorkspace();

  const [status, setStatus] = useState<"idle" | "processing" | "complete" | "error">("idle");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  // Settings state
  const [mode, setMode] = useState<"text" | "image">("text");
  
  const [text, setText] = useState("CONFIDENTIAL");
  const [position, setPosition] = useState<WatermarkPosition>("center");
  const [opacity, setOpacity] = useState(30);
  const [rotation, setRotation] = useState(45);
  
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [pageSelection, setPageSelection] = useState<"all" | "custom">("all");

  const handleProcess = async () => {
    if (!file) return;
    
    if (mode === "image" && !imageFile) {
      toast.error("Please upload an image for the watermark.");
      return;
    }

    setStatus("processing");

    try {
      const selectedIndices = pageSelection === "all" 
        ? pages.map(p => p.originalPageIndex)
        : pages.filter(p => p.selected).map(p => p.originalPageIndex);

      let resultBytes;

      if (mode === "text") {
        resultBytes = await addWatermark(file, {
          type: "text",
          text,
          position,
          opacity: opacity / 100,
          rotation,
          pageIndicesToWatermark: selectedIndices,
        });
      } else {
        resultBytes = await addWatermark(file, {
          type: "image",
          imageFile: imageFile!,
          position,
          opacity: opacity / 100,
          rotation,
          pageIndicesToWatermark: selectedIndices,
        });
      }

      setPdfBlob(new Blob([resultBytes as unknown as BlobPart], { type: "application/pdf" }));
      setStatus("complete");
    } catch (error: unknown) {
      console.error(error);
      setStatus("error");
      toast.error((error as Error).message || "An error occurred while applying the watermark.");
    }
  };

  const handleDownload = () => {
    if (!pdfBlob || !file) return;
    try {
      const baseName = sanitizeFileName(file.name.replace(/\.pdf$/i, ""));
      saveAs(pdfBlob, `${baseName}-watermarked.pdf`);
    } catch (error) {
      console.error(error);
      toast.error("Download failed. Please try again.");
    }
  };

  const handleRangeChange = (selectedPageNumbers: number[]) => {
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        selected: selectedPageNumbers.includes(p.pageNumber),
      }))
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === "image/png" || file.type === "image/jpeg") {
        setImageFile(file);
      } else {
        toast.error("Only PNG and JPG images are supported.");
      }
    }
  };

  if (workspaceStatus === "loading") {
    return <ProcessingState status="processing" title="Loading PDF pages..." progress={0} />;
  }
  
  if (workspaceStatus === "error") {
    return (
      <div className="mx-auto w-full max-w-2xl text-center py-12">
        <p className="text-destructive">Failed to read the PDF document.</p>
        <Button variant="outline" className="mt-4" onClick={onReset}>Start Over</Button>
      </div>
    );
  }

  if (status === "processing") {
    return <ProcessingState status="processing" title="Applying Watermark..." progress={0} />;
  }

  if (status === "complete") {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <ResultCard
          title="Watermark Applied"
          description="Your document is ready."
          onDownload={handleDownload}
          onReset={onReset}
          downloadText="Download PDF"
        />
      </div>
    );
  }

  const selectedPageNumbers = pages.filter((p) => p.selected).map((p) => p.pageNumber);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[60%_1fr] xl:grid-cols-[65%_1fr]">
      {/* Left: Preview */}
      <div className="flex min-h-[500px] flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Preview (Page 1)</h3>
          <span className="text-xs font-medium text-slate-500">Approximation</span>
        </div>
        
        <div className="relative mx-auto flex w-full max-w-md flex-1 items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md">
            <PdfPageThumbnail
              pdfDocument={pdfDocument}
              pageNumber={1}
              scale={0.8}
            />
            
            {/* Visual Indicator of Watermark Position */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none p-8`}>
              <div 
                className={
                  position === "center" ? "self-center justify-self-center" :
                  position === "top-left" ? "self-start justify-self-start mr-auto mb-auto" :
                  position === "top-right" ? "self-start justify-self-end ml-auto mb-auto" :
                  position === "bottom-left" ? "self-end justify-self-start mr-auto mt-auto" :
                  "self-end justify-self-end ml-auto mt-auto"
                }
                style={{ 
                  transform: `rotate(${rotation}deg)`, 
                  opacity: opacity / 100,
                  transformOrigin: "center"
                }}
              >
                {mode === "text" ? (
                  <span className="text-4xl font-bold text-slate-500 whitespace-nowrap">{text || "TEXT"}</span>
                ) : (
                  <span className="text-4xl font-bold text-slate-500 whitespace-nowrap bg-slate-200 px-4 py-2 rounded">IMAGE</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Settings */}
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
          <Settings2 className="h-5 w-5 text-slate-500" />
          <h2 className="text-lg font-semibold text-slate-800">Watermark Settings</h2>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setMode("text")}
            className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
              mode === "text" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Type className="w-4 h-4" /> Text
          </button>
          <button
            onClick={() => setMode("image")}
            className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
              mode === "image" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Image
          </button>
        </div>

        <div className="space-y-6 flex-1">
          {mode === "text" ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. CONFIDENTIAL"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Upload Image (PNG/JPG)</label>
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={handleImageUpload}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imageFile && <p className="mt-2 text-xs text-green-600">Selected: {imageFile.name}</p>}
            </div>
          )}

          {/* Position */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Position</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: "top-left", label: "Top L" },
                { val: "center", label: "Center" },
                { val: "top-right", label: "Top R" },
                { val: "bottom-left", label: "Bot L" },
                { val: "bottom-right", label: "Bot R" },
              ].map((pos) => (
                <button
                  key={pos.val}
                  onClick={() => setPosition(pos.val as WatermarkPosition)}
                  className={`rounded-md border p-2 text-xs font-medium transition-colors ${
                    position === pos.val
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50"
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Opacity */}
            <div>
              <label className="mb-2 flex justify-between text-sm font-medium text-slate-700">
                <span>Opacity</span>
                <span className="text-slate-500">{opacity}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
            
            {/* Rotation */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Rotation</label>
              <select
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="0">0°</option>
                <option value="45">45°</option>
                <option value="-45">-45°</option>
                <option value="90">90°</option>
              </select>
            </div>
          </div>

          {/* Page Range */}
          <div className="pt-2 border-t border-slate-100">
            <label className="mb-3 block text-sm font-medium text-slate-700">Pages to Watermark</label>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="page-selection"
                  checked={pageSelection === "all"}
                  onChange={() => setPageSelection("all")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                All Pages
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="page-selection"
                  checked={pageSelection === "custom"}
                  onChange={() => setPageSelection("custom")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                Custom Range
              </label>
            </div>
            
            {pageSelection === "custom" && (
              <PageRangeInput
                totalPages={pages.length}
                selectedPages={selectedPageNumbers}
                onChange={handleRangeChange}
              />
            )}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100">
          <Button
            size="lg"
            className="w-full h-12 rounded-xl text-base font-semibold"
            onClick={handleProcess}
          >
            Apply Watermark
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
