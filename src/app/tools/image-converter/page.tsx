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
import { Card, CardContent } from "@/components/ui/card";
import { convertImages, ImageFormat, ConvertedFile } from "@/lib/images/convert-images";
import { createAndDownloadZip } from "@/lib/download/create-zip";
import { Settings2, ArrowRight } from "lucide-react";
import { RelatedTools } from "@/components/tools/related-tools";

export default function ImageConverterPage() {
  const tool = TOOLS.find((t) => t.id === "image-converter")!;
  
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "complete" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);

  // Settings
  const [targetFormat, setTargetFormat] = useState<ImageFormat>("jpeg");
  const [quality, setQuality] = useState(90);
  const [background, setBackground] = useState("#ffffff");

  const handleFilesSelect = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles].slice(0, 50)); // limit to 50
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setConvertedFiles([]);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);

    try {
      const results = await convertImages(
        files,
        {
          format: targetFormat,
          quality: quality / 100,
          background: background,
        },
        (current, total) => {
          setProgress(Math.round((current / total) * 100));
        }
      );

      setConvertedFiles(results);
      setStatus("complete");
    } catch (error: unknown) {
      console.error(error);
      setStatus("error");
      toast.error((error as Error).message || "An error occurred during conversion.");
    }
  };

  const handleDownload = async () => {
    if (convertedFiles.length === 0) return;

    try {
      if (convertedFiles.length === 1) {
        saveAs(convertedFiles[0].file, convertedFiles[0].file.name);
      } else {
        const zipEntries = convertedFiles.map(cf => ({
          name: cf.file.name,
          data: cf.file
        }));
        await createAndDownloadZip(zipEntries, "converted-images.zip");
      }
    } catch (error) {
      console.error(error);
      toast.error("Download failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <ToolPageHeader tool={tool} />

      <div className="mx-auto w-full">
        <Card className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
          <CardContent className="p-5 sm:p-7">
            {files.length === 0 && (
              <ToolUploadZone
                onFilesSelect={handleFilesSelect}
                accept={{
                  "image/jpeg": [".jpg", ".jpeg"],
                  "image/png": [".png"],
                  "image/webp": [".webp"]
                }}
                maxSizeMB={50}
                maxFiles={50}
                title="Select Images"
                buttonText="Choose Images"
                helperText="JPG, PNG, WebP"
                icon="image"
              />
            )}

            {files.length > 0 && status === "idle" && (
              <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
                {/* File List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-slate-800">{files.length} Image{files.length > 1 ? "s" : ""} selected</h3>
                    <label className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
                      Add more
                      <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            handleFilesSelect(Array.from(e.target.files));
                          }
                          // Reset input
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 bg-white">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-xs font-bold text-blue-700 uppercase">
                              {file.name.split('.').pop()?.substring(0, 3)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-700">{file.name}</p>
                              <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Settings Panel */}
                <div className="space-y-6 rounded-xl border border-slate-200 bg-slate-50 p-5 h-fit">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                    <Settings2 className="h-4 w-4 text-slate-500" />
                    <h3 className="font-medium text-slate-800">Conversion Settings</h3>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Convert to</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: "jpeg", label: "JPG" },
                        { val: "png", label: "PNG" },
                        { val: "webp", label: "WebP" },
                      ].map((fmt) => (
                        <button
                          key={fmt.val}
                          onClick={() => setTargetFormat(fmt.val as ImageFormat)}
                          className={`rounded-md border py-2 text-xs font-medium transition-colors ${
                            targetFormat === fmt.val
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-white text-slate-600 hover:border-blue-200"
                          }`}
                        >
                          {fmt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(targetFormat === "jpeg" || targetFormat === "webp") && (
                    <div>
                      <label className="mb-2 flex justify-between text-sm font-medium text-slate-700">
                        <span>Quality</span>
                        <span className="text-slate-500">{quality}%</span>
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  )}

                  {targetFormat === "jpeg" && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Background (for transparent PNGs)</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setBackground("#ffffff")}
                          className={`h-8 w-8 rounded-full border-2 ${background === "#ffffff" ? "border-blue-500" : "border-slate-200"} bg-white`}
                          title="White"
                        />
                        <button
                          onClick={() => setBackground("#000000")}
                          className={`h-8 w-8 rounded-full border-2 ${background === "#000000" ? "border-blue-500" : "border-slate-200"} bg-black`}
                          title="Black"
                        />
                        <button
                          onClick={() => setBackground("#f8fafc")}
                          className={`h-8 w-8 rounded-full border-2 ${background === "#f8fafc" ? "border-blue-500" : "border-slate-200"} bg-slate-50`}
                          title="Light Gray"
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full h-12 rounded-xl text-base font-semibold mt-4"
                    onClick={handleConvert}
                  >
                    Convert {files.length} Image{files.length > 1 ? "s" : ""}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {status === "processing" && (
              <ProcessingState status={status} title="Converting Images..." progress={progress} />
            )}

            {status === "complete" && (
              <ResultCard
                title="Conversion Complete"
                description={`${convertedFiles.length} image${convertedFiles.length === 1 ? "" : "s"} converted successfully.`}
                onDownload={handleDownload}
                onReset={handleReset}
                downloadText={convertedFiles.length === 1 ? "Download Image" : "Download ZIP"}
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

      <RelatedTools currentToolId={tool.id} />
    </div>
  );
}
