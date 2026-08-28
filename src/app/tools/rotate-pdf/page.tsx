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
import { rotatePdf } from "@/lib/pdf/rotate-pdf";
import { saveAs } from "file-saver";
import { sanitizeFileName } from "@/lib/utils/file-name";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCw, RotateCcw, Rotate3d } from "lucide-react";

export default function RotatePdfPage() {
  const tool = TOOLS.find((t) => t.id === "rotate-pdf")!;

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "rotating" | "complete" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [rotation, setRotation] = useState<90 | -90 | 180>(90);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);

  const handleFilesSelect = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    
    setFile(selectedFile);
    setStatus("idle");
    setPdfBlob(null);
    setNumPages(null);
    
    try {
      const { pdfjs } = await import("@/lib/pdf/pdf-worker");
      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      setNumPages(pdf.numPages);
      await loadingTask.destroy();
    } catch (error) {
      console.error(error);
      toast.error("Unable to read this PDF.");
      setFile(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setStatus("rotating");
    setProgress(0);

    try {
      const blob = await rotatePdf(file, {
        degrees: rotation,
        onProgress: (current, total) => {
          setProgress((current / total) * 100);
        }
      });

      setPdfBlob(blob);
      setStatus("complete");
    } catch (error) {
      console.error(error);
      setStatus("error");
      toast.error("An error occurred during rotation.");
    }
  };

  const handleDownload = () => {
    if (!pdfBlob || !file) return;
    
    try {
      const baseName = sanitizeFileName(file.name.replace(/\.pdf$/i, ""));
      saveAs(pdfBlob, `${baseName}-rotated.pdf`);
    } catch (error) {
      console.error(error);
      toast.error("Download failed. Please try again.");
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setPdfBlob(null);
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
                
                <div className="space-y-4 rounded-xl border p-4 bg-muted/30">
                  <p className="text-sm font-medium text-center mb-2">Select Rotation for All Pages</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      variant={rotation === 90 ? "default" : "outline"}
                      className="flex-1 h-12"
                      onClick={() => setRotation(90)}
                    >
                      <RotateCw className="mr-2 h-4 w-4" /> Right 90°
                    </Button>
                    <Button 
                      variant={rotation === -90 ? "default" : "outline"}
                      className="flex-1 h-12"
                      onClick={() => setRotation(-90)}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" /> Left 90°
                    </Button>
                    <Button 
                      variant={rotation === 180 ? "default" : "outline"}
                      className="flex-1 h-12"
                      onClick={() => setRotation(180)}
                    >
                      <Rotate3d className="mr-2 h-4 w-4" /> 180°
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full h-14 rounded-xl text-lg font-semibold"
                  size="lg"
                  onClick={handleConvert}
                  disabled={numPages === null}
                >
                  Apply Rotation
                </Button>
              </div>
            )}

            {status === "rotating" && (
              <ProcessingState 
                status={status} 
                title="Rotating PDF..."
                progress={progress} 
              />
            )}

            {status === "complete" && (
              <ResultCard
                title="Your PDF is ready"
                description={`Successfully rotated ${numPages} page${numPages === 1 ? '' : 's'}.`}
                onDownload={handleDownload}
                onReset={handleReset}
                downloadText="Download PDF"
              />
            )}

            {status === "error" && (
              <div className="flex flex-col items-center space-y-4 py-8">
                <p className="text-destructive">Rotation failed. Please try again.</p>
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
