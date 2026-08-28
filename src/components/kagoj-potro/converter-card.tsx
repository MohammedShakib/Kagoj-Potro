"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PdfDropzone } from "./pdf-dropzone";
import { SelectedFileCard } from "./selected-file-card";
import { ConversionProgress } from "./conversion-progress";
import { ConversionResult } from "./conversion-result";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ConversionStatus, ConvertedImage } from "@/types/converter";
import { convertPdfToJpg } from "@/lib/pdf/convert-pdf-to-jpg";
import { downloadImages } from "@/lib/download/download-images";
import { sanitizeFileName } from "@/lib/utils/file-name";
import { ShieldCheck } from "lucide-react";

export function ConverterCard() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ConversionStatus>("idle");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("idle");
    setNumPages(null);
    setCurrentPage(0);
    setConvertedImages([]);
    
    // Quick load to get page count
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
      handleReset();
    }
  };

  const handleRemoveFile = () => {
    handleReset();
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setNumPages(null);
    setCurrentPage(0);
    setConvertedImages([]);
  };

  const handleConvert = async () => {
    if (!file) return;
    setStatus("converting");
    setCurrentPage(0);

    try {
      const images = await convertPdfToJpg(file, {
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
      const baseName = sanitizeFileName(file.name);
      await downloadImages(convertedImages, baseName);
      if (convertedImages.length > 1) {
        setStatus("complete");
      }
    } catch (error) {
      console.error(error);
      toast.error("Download failed. Please try again.");
      if (convertedImages.length > 1) {
        setStatus("complete");
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Card className="overflow-hidden border-0 shadow-2xl shadow-primary/5 ring-1 ring-border">
        <CardContent className="p-6 sm:p-10">
          {!file && (
            <PdfDropzone onFileSelect={handleFileSelect} />
          )}

          {file && status === "idle" && (
            <div className="space-y-6">
              <SelectedFileCard
                file={file}
                numPages={numPages}
                onRemove={handleRemoveFile}
              />
              <Button
                className="w-full text-lg font-semibold h-14 rounded-xl"
                size="lg"
                onClick={handleConvert}
                disabled={numPages === null}
              >
                Convert to JPG
              </Button>
            </div>
          )}

          {(status === "converting" || status === "zipping") && (
            <div className="space-y-6">
              <SelectedFileCard
                file={file!}
                numPages={numPages}
                onRemove={handleRemoveFile}
                disabled={true}
              />
              <ConversionProgress
                status={status}
                currentPage={currentPage}
                totalPages={numPages || 1}
              />
            </div>
          )}

          {status === "complete" && (
            <ConversionResult
              numPages={numPages || 1}
              onDownload={handleDownload}
              onReset={handleReset}
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
        <div className="flex items-center justify-center gap-2 border-t bg-muted/30 px-6 py-4 text-sm font-medium text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <span>Files stay on your device — nothing is uploaded.</span>
        </div>
      </Card>
    </div>
  );
}
