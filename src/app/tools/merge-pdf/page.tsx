"use client";

import { useState } from "react";
import { TOOLS } from "@/config/tools";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ToolUploadZone } from "@/components/tools/tool-upload-zone";
import { SelectedFilesList } from "@/components/tools/selected-files-list";
import { ProcessingState } from "@/components/tools/processing-state";
import { ResultCard } from "@/components/tools/result-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mergePdfs } from "@/lib/pdf/merge-pdf";
import { saveAs } from "file-saver";
import { sanitizeFileName } from "@/lib/utils/file-name";
import { Card, CardContent } from "@/components/ui/card";

export default function MergePdfPage() {
  const tool = TOOLS.find((t) => t.id === "merge-pdf")!;

  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "merging" | "complete" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const handleFilesSelect = (selectedFiles: File[]) => {
    setFiles((prev) => [...prev, ...selectedFiles]);
    setStatus("idle");
    setPdfBlob(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleConvert = async () => {
    if (files.length < 2) {
      toast.error("Please add at least 2 PDF files to merge.");
      return;
    }
    setStatus("merging");
    setProgress(0);

    try {
      const blob = await mergePdfs(files, (current, total) => {
        setProgress((current / total) * 100);
      });

      setPdfBlob(blob);
      setStatus("complete");
    } catch (error) {
      console.error(error);
      setStatus("error");
      toast.error("An error occurred during merge. Please check your files.");
    }
  };

  const handleDownload = () => {
    if (!pdfBlob || files.length === 0) return;
    
    try {
      const baseName = sanitizeFileName(files[0].name.replace(/\.pdf$/i, ""));
      saveAs(pdfBlob, `${baseName}-merged.pdf`);
    } catch (error) {
      console.error(error);
      toast.error("Download failed. Please try again.");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setPdfBlob(null);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <ToolPageHeader tool={tool} />
      
      <div className="mx-auto w-full max-w-2xl">
        <Card className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
          <CardContent className="p-5 sm:p-7">
            {files.length === 0 && (
              <ToolUploadZone
                onFilesSelect={handleFilesSelect}
                accept={{ "application/pdf": [".pdf"] }}
                title="Select PDFs"
                buttonText="Choose PDFs"
                helperText="PDF"
                icon="pdf"
              />
            )}

            {files.length > 0 && status === "idle" && (
              <div className="space-y-6">
                <SelectedFilesList
                  files={files}
                  onRemove={handleRemoveFile}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                />
                
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <ToolUploadZone
                      onFilesSelect={handleFilesSelect}
                      accept={{ "application/pdf": [".pdf"] }}
                      title="Add more"
                      buttonText="Add PDFs"
                      icon="pdf"
                    />
                  </div>
                  <Button
                    className="h-full min-h-12 w-full rounded-xl text-base font-semibold sm:w-1/2"
                    size="lg"
                    onClick={handleConvert}
                    disabled={files.length < 2}
                  >
                    Merge {files.length} PDFs
                  </Button>
                </div>
              </div>
            )}

            {status === "merging" && (
              <ProcessingState 
                status={status} 
                title="Merging PDFs..."
                progress={progress} 
              />
            )}

            {status === "complete" && (
              <ResultCard
                title="Your PDF is ready"
                description={`Successfully merged ${files.length} files.`}
                onDownload={handleDownload}
                onReset={handleReset}
                downloadText="Download Merged PDF"
              />
            )}

            {status === "error" && (
              <div className="flex flex-col items-center space-y-4 py-8">
                <p className="text-destructive">Merge failed. Please try again.</p>
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
