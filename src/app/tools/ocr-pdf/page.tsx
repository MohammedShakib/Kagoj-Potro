"use client";

import { useState } from "react";
import { RelatedTools } from "@/components/tools/related-tools";
import { RemoteProcessingState } from "@/components/tools/remote-processing-state";
import { ResultCard } from "@/components/tools/result-card";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ToolUploadZone } from "@/components/tools/tool-upload-zone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProcessingJob } from "@/hooks/use-processing-job";
import { useProcessingTools } from "@/hooks/use-processing-tools";
import { normalizeProcessingError } from "@/lib/processing-errors";
import { TOOLS } from "@/config/tools";
import type { ProcessingOcrLanguage } from "@/types/processing";
import { Loader2, RefreshCcw, ServerCrash, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const OCR_LANGUAGE_OPTIONS: Array<{ label: string; value: ProcessingOcrLanguage }> = [
  { label: "English", value: "eng" },
  { label: "Bangla / Bengali", value: "ben" },
  { label: "English + Bangla", value: "eng+ben" },
];

function formatBytes(bytes?: number) {
  if (bytes === undefined || Number.isNaN(bytes)) {
    return "Unavailable";
  }

  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;

  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function getProcessingTitle(uiState: string) {
  if (uiState === "validating") {
    return "Validating PDF";
  }

  if (uiState === "uploading") {
    return "Uploading PDF";
  }

  if (uiState === "queued") {
    return "Waiting for OCR";
  }

  return "Running OCR";
}

export default function OcrPdfPage() {
  const tool = TOOLS.find((entry) => entry.id === "ocr-pdf")!;
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<ProcessingOcrLanguage>("eng");
  const {
    tool: processingTool,
    error: toolsError,
    isLoading: isCheckingAvailability,
    isSlow: isCheckingSlow,
    retry,
  } = useProcessingTools("ocr_pdf");
  const {
    cancelJob,
    downloadResult,
    error,
    isBusy,
    isCancelling,
    isDownloading,
    job,
    reset,
    slowMessage,
    startJob,
    uiState,
  } = useProcessingJob();

  const availableLanguages = (processingTool?.languages ?? ["eng"]).filter(
    (candidate): candidate is ProcessingOcrLanguage =>
      OCR_LANGUAGE_OPTIONS.some((option) => option.value === candidate),
  );
  const effectiveLanguage =
    availableLanguages.includes(language)
      ? language
      : availableLanguages.includes("eng")
        ? "eng"
        : availableLanguages[0] ?? "eng";
  const selectedLanguageLabel =
    OCR_LANGUAGE_OPTIONS.find((option) => option.value === effectiveLanguage)?.label ?? "Selected language";
  const result = job?.result;
  const primaryArtifactKey = result?.primary_artifact ?? "searchable_pdf";
  const primaryArtifact = result?.artifacts?.[primaryArtifactKey];
  const outputSize = result?.output_size ?? primaryArtifact?.size;

  const handleFiles = (files: File[]) => {
    if (!files[0]) {
      return;
    }

    reset();
    setFile(files[0]);
  };

  const handleStart = async () => {
    if (!file || isBusy) {
      return;
    }

    await startJob({
      file,
      options: {
        clean: false,
        deskew: true,
        language: effectiveLanguage,
        output_type: "searchable_pdf",
      },
      type: "ocr_pdf",
    });
  };

  const handleCancel = async () => {
    try {
      const status = await cancelJob();
      toast.info(status === "cancelled" ? "OCR cancelled." : "OCR cancellation requested.");
    } catch (error) {
      toast.error(normalizeProcessingError(error).message);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadResult(primaryArtifactKey);
      toast.success("Your searchable PDF download has started.");
    } catch (error) {
      toast.error(normalizeProcessingError(error).message);
    }
  };

  const resetToSetup = () => {
    reset();
  };

  const resetAll = () => {
    reset();
    setFile(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <main className="flex-1 pb-16 pt-8 md:pt-12">
        <div className="container mx-auto max-w-[1000px] px-4">
          <ToolPageHeader tool={tool} />

          <div className="mx-auto max-w-2xl">
            {isCheckingAvailability ? (
              <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                <Loader2 className="mx-auto mb-6 h-12 w-12 animate-spin text-blue-600" />
                <h3 className="mb-2 text-xl font-bold text-slate-900">Checking OCR availability</h3>
                <p className="text-slate-500">
                  We&apos;re confirming the processing server is awake and OCR support is enabled.
                </p>
                {isCheckingSlow ? (
                  <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    The processing server may be starting. This can take a moment on the first request.
                  </p>
                ) : null}
              </div>
            ) : toolsError ? (
              <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <ServerCrash className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">Processing server unavailable</h3>
                <p className="mb-6 text-slate-600">{toolsError.message}</p>
                <Button onClick={retry}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </div>
            ) : !processingTool?.enabled ? (
              <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                <h3 className="mb-2 text-xl font-bold text-slate-900">OCR PDF is not available right now</h3>
                <p className="text-slate-600">
                  The backend reported that OCR is currently disabled. Please try again later.
                </p>
              </div>
            ) : (
              <>
                {uiState === "idle" && !file ? (
                  <ToolUploadZone
                    onFilesSelect={handleFiles}
                    accept={{ "application/pdf": [".pdf"] }}
                    maxFiles={1}
                    title="Upload scanned PDF"
                    subtitle="Your PDF will be sent to the Kagoj Processing Engine to create a searchable PDF."
                    icon="pdf"
                  />
                ) : null}

                {uiState === "idle" && file ? (
                  <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between rounded-lg border bg-slate-50 p-4">
                      <div>
                        <h3 className="font-semibold text-slate-800">{file.name}</h3>
                        <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={resetAll}>
                        Change File
                      </Button>
                    </div>

                    <div className="mb-6 space-y-6">
                      <div>
                        <h4 className="mb-3 font-medium text-slate-700">Output Type</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-lg border-2 border-blue-600 bg-blue-50 p-4 text-left">
                            <div className="flex items-center justify-between gap-2">
                              <div className="font-semibold text-slate-800">Searchable PDF</div>
                              <Badge variant="secondary" className="border-none bg-blue-100 text-blue-700">
                                Active
                              </Badge>
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              Keeps the original layout and adds a searchable text layer.
                            </div>
                          </div>
                          <div className="rounded-lg border-2 border-slate-200 bg-slate-50 p-4 text-left opacity-70">
                            <div className="flex items-center justify-between gap-2">
                              <div className="font-semibold text-slate-700">Extract Text</div>
                              <Badge variant="secondary" className="border-none bg-slate-200 text-slate-600">
                                Not wired
                              </Badge>
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              The current backend integration only supports searchable PDF output.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h4 className="font-medium text-slate-700">Document Language</h4>
                          <Badge variant="secondary" className="border-none bg-slate-100 text-slate-700">
                            {availableLanguages.length} available
                          </Badge>
                        </div>
                        <select
                          value={effectiveLanguage}
                          onChange={(event) => setLanguage(event.target.value as ProcessingOcrLanguage)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          {OCR_LANGUAGE_OPTIONS.filter((option) => availableLanguages.includes(option.value)).map(
                            (option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ),
                          )}
                        </select>
                        <p className="mt-2 text-xs text-slate-500">
                          Choose the language that best matches the scanned document for better OCR accuracy.
                        </p>
                      </div>
                    </div>

                    <Button className="w-full" size="lg" onClick={() => void handleStart()} disabled={!file || isBusy}>
                      Create Searchable PDF
                    </Button>

                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      <span>Files are processed by the deployed Kagoj Processing Engine.</span>
                    </div>
                  </div>
                ) : null}

                {(uiState === "validating" ||
                  uiState === "uploading" ||
                  uiState === "queued" ||
                  uiState === "processing") && (
                  <RemoteProcessingState
                    title={getProcessingTitle(uiState)}
                    status={job?.status ?? uiState}
                    progress={
                      job?.progress ??
                      (uiState === "validating" ? 5 : uiState === "uploading" ? 15 : uiState === "queued" ? 20 : 0)
                    }
                    stage={job?.stage ?? uiState}
                    message={
                      job?.message ??
                      `Please keep this page open while OCR runs for the ${selectedLanguageLabel.toLowerCase()} model.`
                    }
                    slowMessage={slowMessage}
                    onCancel={uiState === "queued" || uiState === "processing" ? handleCancel : undefined}
                    cancelDisabled={isCancelling}
                  />
                )}

                {uiState === "completed" && job ? (
                  <div className="space-y-6">
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">OCR Summary</h3>
                          <p className="text-sm text-slate-500">
                            {job.message || `${selectedLanguageLabel} OCR completed successfully.`}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="border-none bg-slate-100 text-slate-700">
                            Status: {job.status}
                          </Badge>
                          <Badge variant="secondary" className="border-none bg-blue-100 text-blue-700">
                            Language: {selectedLanguageLabel}
                          </Badge>
                          {job.stage ? (
                            <Badge variant="secondary" className="border-none bg-amber-100 text-amber-700">
                              Stage: {job.stage}
                            </Badge>
                          ) : null}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-center">
                          <div className="text-sm text-slate-500">Input Size</div>
                          <div className="mt-1 text-lg font-semibold text-slate-800">{formatBytes(file?.size)}</div>
                        </div>
                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-center">
                          <div className="text-sm text-blue-600">Output Size</div>
                          <div className="mt-1 text-lg font-bold text-blue-700">{formatBytes(outputSize)}</div>
                        </div>
                        <div className="rounded-lg border border-green-100 bg-green-50 p-4 text-center">
                          <div className="text-sm text-green-600">Artifact</div>
                          <div className="mt-1 text-sm font-bold text-green-700">
                            {primaryArtifact?.filename || "searchable PDF"}
                          </div>
                        </div>
                        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-center">
                          <div className="text-sm text-emerald-600">Progress</div>
                          <div className="mt-1 text-lg font-bold text-emerald-700">
                            {typeof job.progress === "number" ? `${Math.round(job.progress)}%` : "100%"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <ResultCard
                      title="Searchable PDF Ready"
                      description={
                        primaryArtifact?.filename
                          ? `${primaryArtifact.filename} is ready to download.`
                          : "Your searchable PDF is ready to download."
                      }
                      onDownload={handleDownload}
                      onReset={resetAll}
                      downloadText={isDownloading ? "Preparing Download..." : "Download Searchable PDF"}
                    />
                  </div>
                ) : null}

                {uiState === "failed" ? (
                  <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <ServerCrash className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-900">OCR Failed</h3>
                    <p className="mb-6 text-slate-600">
                      {error?.message || "The processing service could not complete OCR for this PDF."}
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <Button onClick={resetToSetup}>Try Again</Button>
                      <Button variant="outline" onClick={resetAll}>
                        Choose Another File
                      </Button>
                    </div>
                  </div>
                ) : null}

                {uiState === "cancelled" ? (
                  <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                    <h3 className="mb-2 text-xl font-bold text-slate-900">OCR Cancelled</h3>
                    <p className="mb-6 text-slate-600">
                      {job?.message || "The OCR job was cancelled before the searchable PDF was created."}
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <Button onClick={resetToSetup}>Back to Setup</Button>
                      <Button variant="outline" onClick={resetAll}>
                        Choose Another File
                      </Button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </main>

      <RelatedTools currentToolId="ocr-pdf" />
    </div>
  );
}
