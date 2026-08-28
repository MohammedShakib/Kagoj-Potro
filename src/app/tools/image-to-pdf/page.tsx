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
import { convertImagesToPdf } from "@/lib/pdf/image-to-pdf";
import { saveAs } from "file-saver";
import { sanitizeFileName } from "@/lib/utils/file-name";
import { Card, CardContent } from "@/components/ui/card";

export default function ImageToPdfPage() {
  const tool = TOOLS.find((t) => t.id === "image-to-pdf")!;

  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "converting" | "complete" | "error">("idle");
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
    if (files.length === 0) return;
    setStatus("converting");
    setProgress(0);

    try {
      const blob = await convertImagesToPdf(files, {
        onProgress: (current, total) => {
          setProgress((current / total) * 100);
        },
      });

      setPdfBlob(blob);
      setStatus("complete");
    } catch (error) {
      console.error(error);
      setStatus("error");
      toast.error("An error occurred during conversion. Please check file formats.");
    }
  };

  const handleDownload = () => {
    if (!pdfBlob || files.length === 0) return;
    
    try {
      const baseName = sanitizeFileName(files[0].name.replace(/\.[^/.]+$/, ""));
      saveAs(pdfBlob, `${baseName}-converted.pdf`);
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
                accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
                maxSizeMB={20}
                title="Select images"
                buttonText="Choose Images"
                helperText="JPG, PNG"
                icon="image"
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
                <div className="flex flex-col gap-3 sm:flex-row">
                  <ToolUploadZone
                    onFilesSelect={handleFilesSelect}
                    accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
                    maxSizeMB={20}
                    title="Add more images"
                    buttonText="Add Images"
                    icon="image"
                  />
                  <Button
                    className="h-12 w-full self-end rounded-xl text-base font-semibold sm:w-1/2"
                    size="lg"
                    onClick={handleConvert}
                  >
                    Convert to PDF
                  </Button>
                </div>
              </div>
            )}

            {status === "converting" && (
              <ProcessingState 
                status={status} 
                title="Creating PDF..."
                progress={progress} 
              />
            )}

            {status === "complete" && (
              <ResultCard
                title="Your PDF is ready"
                description={`Successfully combined ${files.length} image${files.length === 1 ? '' : 's'}.`}
                onDownload={handleDownload}
                onReset={handleReset}
                downloadText="Download PDF"
              />
            )}

            {status === "error" && (
              <div className="flex flex-col items-center space-y-4 py-8">
                <p className="text-destructive">Conversion failed. Please try again.</p>
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
