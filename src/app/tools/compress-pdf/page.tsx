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
import { Loader2, RefreshCcw, ServerCrash, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const COMPRESS_OPTIONS = {
  linearize: true,
  preset: "recommended",
} as const;

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
    return "Waiting for Processing";
  }

  return "Compressing PDF";
}

export default function CompressPdfPage() {
  const tool = TOOLS.find((entry) => entry.id === "compress-pdf")!;
  const [file, setFile] = useState<File | null>(null);
  const {
    tool: processingTool,
    error: toolsError,
    isLoading: isCheckingAvailability,
    isSlow: isCheckingSlow,
    retry,
  } = useProcessingTools("compress_pdf");
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

  const result = job?.result;
  const primaryArtifactKey = result?.primary_artifact ?? "compressed_pdf";
  const primaryArtifact = result?.artifacts?.[primaryArtifactKey];
  const originalSize = result?.original_size;
  const outputSize = result?.output_size ?? primaryArtifact?.size;
  const savedBytes =
    result?.saved_bytes ??
    (typeof originalSize === "number" && typeof outputSize === "number" ? originalSize - outputSize : undefined);
  const reductionPercent =
    result?.reduction_percent ??
    (typeof originalSize === "number" && typeof savedBytes === "number" && originalSize > 0
      ? (savedBytes / originalSize) * 100
      : undefined);

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
      options: COMPRESS_OPTIONS,
      type: "compress_pdf",
    });
  };

  const handleCancel = async () => {
    try {
      const status = await cancelJob();
      toast.info(status === "cancelled" ? "Compression cancelled." : "Cancellation requested.");
    } catch (error) {
      toast.error(normalizeProcessingError(error).message);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadResult(primaryArtifactKey);
      toast.success("Your compressed PDF download has started.");
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
                <h3 className="mb-2 text-xl font-bold text-slate-900">Checking Compress PDF availability</h3>
                <p className="text-slate-500">
                  We&apos;re confirming the processing server is awake and the compression tool is enabled.
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
                <h3 className="mb-2 text-xl font-bold text-slate-900">Compress PDF is not available right now</h3>
                <p className="text-slate-600">
                  The backend reported that compression is currently disabled. Please try again later.
                </p>
              </div>
            ) : (
              <>
                {uiState === "idle" && !file ? (
                  <ToolUploadZone
                    onFilesSelect={handleFiles}
                    accept={{ "application/pdf": [".pdf"] }}
                    maxFiles={1}
                    title="Upload PDF to compress"
                    subtitle="Your PDF will be sent to the Kagoj Processing Engine for cloud compression."
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

                    <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-slate-900">Recommended Optimization</h4>
                          <p className="mt-1 text-sm text-slate-600">
                            The current processing backend is wired to the recommended compression preset with
                            linearized output for faster PDF loading.
                          </p>
                        </div>
                        <Badge variant="secondary" className="border-none bg-blue-100 text-blue-700">
                          Default
                        </Badge>
                      </div>
                    </div>

                    <Button className="w-full" size="lg" onClick={() => void handleStart()} disabled={!file || isBusy}>
                      Compress PDF
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
                    message={job?.message ?? "Please keep this page open while your PDF is being processed."}
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
                          <h3 className="text-lg font-bold text-slate-900">Compression Summary</h3>
                          <p className="text-sm text-slate-500">
                            {job.message || "Your PDF finished processing successfully."}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="border-none bg-slate-100 text-slate-700">
                            Status: {job.status}
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
                          <div className="text-sm text-slate-500">Original Size</div>
                          <div className="mt-1 text-lg font-semibold text-slate-800">{formatBytes(originalSize)}</div>
                        </div>
                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-center">
                          <div className="text-sm text-blue-600">Compressed Size</div>
                          <div className="mt-1 text-lg font-bold text-blue-700">{formatBytes(outputSize)}</div>
                        </div>
                        <div className="rounded-lg border border-green-100 bg-green-50 p-4 text-center">
                          <div className="text-sm text-green-600">Saved</div>
                          <div className="mt-1 text-lg font-bold text-green-700">{formatBytes(savedBytes)}</div>
                        </div>
                        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-center">
                          <div className="text-sm text-emerald-600">Reduction</div>
                          <div className="mt-1 text-lg font-bold text-emerald-700">
                            {typeof reductionPercent === "number" ? `${reductionPercent.toFixed(1)}%` : "Unavailable"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <ResultCard
                      title="Compressed PDF Ready"
                      description={
                        primaryArtifact?.filename
                          ? `${primaryArtifact.filename} is ready to download.`
                          : "Your compressed PDF is ready to download."
                      }
                      onDownload={handleDownload}
                      onReset={resetAll}
                      downloadText={isDownloading ? "Preparing Download..." : "Download Compressed PDF"}
                    />
                  </div>
                ) : null}

                {uiState === "failed" ? (
                  <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <ServerCrash className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-900">Compression Failed</h3>
                    <p className="mb-6 text-slate-600">
                      {error?.message || "The processing service could not compress this PDF."}
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
                    <h3 className="mb-2 text-xl font-bold text-slate-900">Compression Cancelled</h3>
                    <p className="mb-6 text-slate-600">
                      {job?.message || "The job was cancelled before the compressed PDF was created."}
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

      <RelatedTools currentToolId="compress-pdf" />
    </div>
  );
}
