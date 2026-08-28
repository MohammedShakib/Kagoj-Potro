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
import { addPageNumbers, PageNumberPosition, PageNumberFormat } from "@/lib/pdf/add-page-numbers";
import { Settings2, ArrowRight } from "lucide-react";
import { RelatedTools } from "@/components/tools/related-tools";

export default function PageNumbersPage() {
  const tool = TOOLS.find((t) => t.id === "page-numbers")!;
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
          <PageNumbersWorkspace onReset={() => setFile(null)} />
        </PdfWorkspaceProvider>
      )}

      <RelatedTools currentToolId={tool.id} />
    </div>
  );
}

function PageNumbersWorkspace({ onReset }: { onReset: () => void }) {
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
  const [position, setPosition] = useState<PageNumberPosition>("bottom-center");
  const [format, setFormat] = useState<PageNumberFormat>("1");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  const [pageSelection, setPageSelection] = useState<"all" | "custom">("all");

  const handleProcess = async () => {
    if (!file) return;
    setStatus("processing");

    try {
      const selectedIndices = pageSelection === "all" 
        ? pages.map(p => p.originalPageIndex)
        : pages.filter(p => p.selected).map(p => p.originalPageIndex);

      const resultBytes = await addPageNumbers(file, {
        position,
        format,
        startNumber,
        fontSize,
        pageIndicesToNumber: selectedIndices,
      });

      setPdfBlob(new Blob([resultBytes as unknown as BlobPart], { type: "application/pdf" }));
      setStatus("complete");
    } catch (error: unknown) {
      console.error(error);
      setStatus("error");
      toast.error((error as Error).message || "An error occurred while adding page numbers.");
    }
  };

  const handleDownload = () => {
    if (!pdfBlob || !file) return;
    try {
      const baseName = sanitizeFileName(file.name.replace(/\.pdf$/i, ""));
      saveAs(pdfBlob, `${baseName}-numbered.pdf`);
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
    return <ProcessingState status="processing" title="Adding Page Numbers..." progress={0} />;
  }

  if (status === "complete") {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <ResultCard
          title="Page Numbers Added"
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
            
            {/* Visual Indicator of Page Number Position */}
            <div className={`absolute inset-0 m-4 flex flex-col p-4`}>
              <div className="flex flex-1 justify-between">
                <span className={`text-blue-600 bg-white/80 px-2 rounded font-bold ${position === "top-left" ? "opacity-100" : "opacity-0"}`}>{format}</span>
                <span className={`text-blue-600 bg-white/80 px-2 rounded font-bold ${position === "top-center" ? "opacity-100" : "opacity-0"}`}>{format}</span>
                <span className={`text-blue-600 bg-white/80 px-2 rounded font-bold ${position === "top-right" ? "opacity-100" : "opacity-0"}`}>{format}</span>
              </div>
              <div className="flex justify-between mt-auto">
                <span className={`text-blue-600 bg-white/80 px-2 rounded font-bold ${position === "bottom-left" ? "opacity-100" : "opacity-0"}`}>{format}</span>
                <span className={`text-blue-600 bg-white/80 px-2 rounded font-bold ${position === "bottom-center" ? "opacity-100" : "opacity-0"}`}>{format}</span>
                <span className={`text-blue-600 bg-white/80 px-2 rounded font-bold ${position === "bottom-right" ? "opacity-100" : "opacity-0"}`}>{format}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Settings */}
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
          <Settings2 className="h-5 w-5 text-slate-500" />
          <h2 className="text-lg font-semibold text-slate-800">Page Number Settings</h2>
        </div>

        <div className="space-y-6 flex-1">
          {/* Position */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Position</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: "top-left", label: "Top L" },
                { val: "top-center", label: "Top C" },
                { val: "top-right", label: "Top R" },
                { val: "bottom-left", label: "Bot L" },
                { val: "bottom-center", label: "Bot C" },
                { val: "bottom-right", label: "Bot R" },
              ].map((pos) => (
                <button
                  key={pos.val}
                  onClick={() => setPosition(pos.val as PageNumberPosition)}
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

          {/* Format */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as PageNumberFormat)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="1">1, 2, 3</option>
              <option value="Page 1">Page 1, Page 2</option>
              <option value="1 / 10">1 / 10, 2 / 10</option>
              <option value="Page 1 of 10">Page 1 of 10, Page 2 of 10</option>
            </select>
          </div>

          {/* Start Number & Font Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Start Number</label>
              <input
                type="number"
                min="1"
                value={startNumber}
                onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Font Size</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="10">Small (10)</option>
                <option value="12">Medium (12)</option>
                <option value="14">Large (14)</option>
                <option value="18">X-Large (18)</option>
              </select>
            </div>
          </div>

          {/* Page Range */}
          <div className="pt-2 border-t border-slate-100">
            <label className="mb-3 block text-sm font-medium text-slate-700">Pages to Number</label>
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
            Add Page Numbers
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
