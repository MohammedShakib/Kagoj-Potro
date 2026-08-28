"use client";

import { useState } from "react";
import { TOOLS } from "@/config/tools";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ToolUploadZone } from "@/components/tools/tool-upload-zone";
import { SelectedFilesList } from "@/components/tools/selected-files-list";
import { ProcessingState } from "@/components/tools/processing-state";
import { ResultCard } from "@/components/tools/result-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { splitPdf, SplitPdfResult } from "@/lib/pdf/split-pdf";
import { saveAs } from "file-saver";
import { sanitizeFileName } from "@/lib/utils/file-name";
import { Card, CardContent } from "@/components/ui/card";
import JSZip from "jszip";

export default function SplitPdfPage() {
  const tool = TOOLS.find((t) => t.id === "split-pdf")!;

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "splitting" | "zipping" | "complete" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<"extract" | "split-all">("extract");
  const [ranges, setRanges] = useState("");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [results, setResults] = useState<SplitPdfResult[]>([]);

  const handleFilesSelect = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    
    setFile(selectedFile);
    setStatus("idle");
    setNumPages(null);
    setResults([]);
    
    try {
      const { pdfjs } = await import("@/lib/pdf/pdf-worker");
      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      setNumPages(pdf.numPages);
      await loadingTask.destroy();
    } catch (error) {
      console.error(error);
      toast.error("Unable to read this PDF. It may be corrupted or password protected.");
      setFile(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    
    if (mode === "extract" && !ranges.trim()) {
      toast.error("Please enter pages to extract (e.g. 1-3, 5).");
      return;
    }

    setStatus("splitting");
    setProgress(0);

    try {
      const output = await splitPdf(file, {
        mode,
        ranges,
        onProgress: (current, total) => {
          setProgress((current / total) * 100);
        }
      });

      setResults(output);
      setStatus("complete");
    } catch (error) {
      console.error(error);
      setStatus("error");
      const msg = error instanceof Error ? error.message : "An error occurred during splitting.";
      toast.error(msg);
    }
  };

  const handleDownload = async () => {
    if (results.length === 0 || !file) return;

    try {
      if (results.length === 1) {
        saveAs(results[0].blob, results[0].fileName);
      } else {
        setStatus("zipping");
        const zip = new JSZip();
        results.forEach((res) => {
          zip.file(res.fileName, res.blob);
        });

        const baseName = sanitizeFileName(file.name.replace(/\.pdf$/i, ""));
        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, `${baseName}-split.zip`);
        setStatus("complete");
      }
    } catch (error) {
      console.error(error);
      toast.error("Download failed. Please try again.");
      setStatus("complete");
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setResults([]);
    setRanges("");
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <ToolPageHeader tool={tool} />
      
      <div className="mx-auto w-full max-w-2xl">
        <Card className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
          <CardContent className="p-5 sm:p-7">
            {!file && (
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
            )}

            {file && status === "idle" && (
              <div className="space-y-6">
                <SelectedFilesList
                  files={[file]}
                  onRemove={handleReset}
                />
                
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      variant={mode === "extract" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setMode("extract")}
                    >
                      Extract Pages
                    </Button>
                    <Button 
                      variant={mode === "split-all" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setMode("split-all")}
                    >
                      Split Every Page
                    </Button>
                  </div>

                  {mode === "extract" && (
                    <div className="space-y-2 pt-2">
                      <label className="text-sm font-medium">Pages to extract</label>
                      <Input
                        placeholder={`e.g. 1-3, 5, 8-${numPages || 10}`}
                        value={ranges}
                        onChange={(e) => setRanges(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        {numPages ? `Document has ${numPages} pages.` : ""}
                      </p>
                    </div>
                  )}
                  {mode === "split-all" && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      {numPages ? `Will create ${numPages} separate PDF files.` : "Will create one PDF for every page."}
                    </p>
                  )}
                </div>

                <Button
                  className="h-12 w-full rounded-xl text-base font-semibold"
                  size="lg"
                  onClick={handleConvert}
                  disabled={numPages === null}
                >
                  Split PDF
                </Button>
              </div>
            )}

            {(status === "splitting" || status === "zipping") && (
              <ProcessingState 
                status={status} 
                title={status === "splitting" ? "Splitting PDF..." : "Preparing ZIP..."}
                progress={progress} 
              />
            )}

            {status === "complete" && (
              <ResultCard
                title="Your PDF is ready"
                description={`Successfully processed ${results.length} file${results.length === 1 ? '' : 's'}.`}
                onDownload={handleDownload}
                onReset={handleReset}
                downloadText={results.length > 1 ? "Download ZIP" : "Download PDF"}
              />
            )}

            {status === "error" && (
              <div className="flex flex-col items-center space-y-4 py-8">
                <p className="text-destructive">Splitting failed. Please try again.</p>
                <Button variant="outline" onClick={handleReset}>
                  Start Over
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
