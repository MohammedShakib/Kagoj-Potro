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
import { convertPdfToImages } from "@/lib/pdf/pdf-to-image";
import { downloadImages } from "@/lib/download/download-images";
import { sanitizeFileName } from "@/lib/utils/file-name";
import { ConvertedImage } from "@/types/converter";
import { Card, CardContent } from "@/components/ui/card";

export default function PdfToPngPage() {
  const tool = TOOLS.find((t) => t.id === "pdf-to-png")!;

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "converting" | "zipping" | "complete" | "error">("idle");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);

  const handleFilesSelect = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    
    setFile(selectedFile);
    setStatus("idle");
    setNumPages(null);
    setCurrentPage(0);
    setConvertedImages([]);
    
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
    setStatus("converting");
    setCurrentPage(0);

    try {
      const images = await convertPdfToImages(file, {
        format: "png",
        onProgress: (current, total) => {
          setCurrentPage(current);
          setNumPages(total);
        },
      });

      setConvertedImages(images);
      setStatus("complete");
    } catch (error) {
      console.error(error);
      setStatus("error");
      toast.error("An error occurred during conversion.");
    }
  };

  const handleDownload = async () => {
    if (convertedImages.length === 0 || !file) return;

    if (convertedImages.length > 1) {
      setStatus("zipping");
    }
    
    try {
      const baseName = sanitizeFileName(file.name.replace(/\.pdf$/i, ""));
      await downloadImages(convertedImages, baseName);
      setStatus("complete");
    } catch (error) {
      console.error(error);
      toast.error("Download failed. Please try again.");
      setStatus("complete");
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setNumPages(null);
    setCurrentPage(0);
    setConvertedImages([]);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <ToolPageHeader tool={tool} />
      
      <div className="mx-auto w-full max-w-3xl">
        <Card className="overflow-hidden border-0 shadow-2xl shadow-primary/5 ring-1 ring-border">
          <CardContent className="p-6 sm:p-10">
            {!file && (
              <ToolUploadZone
                onFilesSelect={handleFilesSelect}
                accept={{ "application/pdf": [".pdf"] }}
                maxSizeMB={100}
                maxFiles={1}
                title="Drop your PDF here"
                buttonText="Choose PDF"
                helperText="PDF only"
                icon="pdf"
              />
            )}

            {file && status === "idle" && (
              <div className="space-y-6">
                <SelectedFilesList
                  files={[file]}
                  onRemove={handleReset}
                />
                <Button
                  className="w-full h-14 rounded-xl text-lg font-semibold"
                  size="lg"
                  onClick={handleConvert}
                  disabled={numPages === null}
                >
                  Convert to PNG
                </Button>
              </div>
            )}

            {(status === "converting" || status === "zipping") && (
              <div className="space-y-6">
                <SelectedFilesList
                  files={[file!]}
                  onRemove={handleReset}
                  disabled={true}
                />
                <ProcessingState 
                  status={status} 
                  title={status === "converting" ? "Converting PDF..." : "Preparing ZIP..."}
                  progress={numPages ? (currentPage / numPages) * 100 : undefined} 
                />
              </div>
            )}

            {status === "complete" && (
              <ResultCard
                title="Your PNG files are ready"
                description={`${convertedImages.length} page${convertedImages.length === 1 ? '' : 's'} converted successfully.`}
                onDownload={handleDownload}
                onReset={handleReset}
                downloadText={convertedImages.length > 1 ? "Download ZIP" : "Download PNG"}
              />
            )}

            {status === "error" && (
              <div className="flex flex-col items-center space-y-4 py-8">
                <p className="text-destructive">Conversion failed. Please try again.</p>
                <Button variant="outline" onClick={handleReset}>
                  Try another file
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
