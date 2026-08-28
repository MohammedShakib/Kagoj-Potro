"use client";

import { useEffect, useRef, useState } from "react";
import {
  cancelProcessingJob,
  createUploadJob,
  getProcessingDownload,
  getProcessingJob,
} from "@/lib/processing-api";
import {
  normalizeProcessingError,
  ProcessingApiError,
} from "@/lib/processing-errors";
import type { ProcessingJob, ProcessingToolId } from "@/types/processing";

const POLL_INTERVAL_MS = 2000;
const SLOW_REQUEST_DELAY_MS = 4000;
const SLOW_REQUEST_MESSAGE =
  "The processing server may be starting. This can take a moment on the first request.";

export type ProcessingUiState =
  | "idle"
  | "validating"
  | "uploading"
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

interface StartProcessingJobInput {
  file: File;
  options: Record<string, unknown>;
  type: ProcessingToolId;
}

function isTerminalStatus(status?: string | null) {
  return status === "completed" || status === "failed" || status === "cancelled";
}

function mapJobStatusToUiState(status?: string | null): ProcessingUiState {
  if (status === "queued") {
    return "queued";
  }

  if (status === "processing") {
    return "processing";
  }

  if (status === "completed") {
    return "completed";
  }

  if (status === "failed") {
    return "failed";
  }

  if (status === "cancelled") {
    return "cancelled";
  }

  return "uploading";
}

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function triggerBrowserDownload(url: string, filename?: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.rel = "noopener";

  if (filename) {
    anchor.download = filename;
  }

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

export function useProcessingJob() {
  const [error, setError] = useState<ProcessingApiError | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [job, setJob] = useState<ProcessingJob | null>(null);
  const [slowMessage, setSlowMessage] = useState<string | null>(null);
  const [uiState, setUiState] = useState<ProcessingUiState>("idle");

  const requestAbortRef = useRef<AbortController | null>(null);
  const pollTimerRef = useRef<number | null>(null);
  const slowTimerRef = useRef<number | null>(null);

  const clearSlowTimer = (resetMessage: boolean) => {
    if (slowTimerRef.current !== null) {
      window.clearTimeout(slowTimerRef.current);
      slowTimerRef.current = null;
    }

    if (resetMessage) {
      setSlowMessage(null);
    }
  };

  const clearPolling = () => {
    if (pollTimerRef.current !== null) {
      window.clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  const clearPendingRequest = () => {
    requestAbortRef.current?.abort();
    requestAbortRef.current = null;
  };

  const clearAsyncState = (resetMessage = true) => {
    clearPolling();
    clearPendingRequest();
    clearSlowTimer(resetMessage);
  };

  const pollJob = async (jobId: string) => {
    clearPendingRequest();

    const controller = new AbortController();
    requestAbortRef.current = controller;

    try {
      const nextJob = await getProcessingJob(jobId, controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      setJob(nextJob);
      setError(null);
      setUiState(mapJobStatusToUiState(nextJob.status));

      if (!isTerminalStatus(nextJob.status)) {
        clearPolling();
        pollTimerRef.current = window.setTimeout(() => {
          void pollJob(jobId);
        }, POLL_INTERVAL_MS);
      }
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      setError(normalizeProcessingError(error));
      setUiState("failed");
    } finally {
      if (requestAbortRef.current === controller) {
        requestAbortRef.current = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      if (pollTimerRef.current !== null) {
        window.clearTimeout(pollTimerRef.current);
      }

      requestAbortRef.current?.abort();

      if (slowTimerRef.current !== null) {
        window.clearTimeout(slowTimerRef.current);
      }
    };
  }, []);

  const reset = () => {
    clearAsyncState();
    setError(null);
    setIsCancelling(false);
    setIsDownloading(false);
    setJob(null);
    setUiState("idle");
  };

  const startJob = async ({ file, options, type }: StartProcessingJobInput) => {
    clearAsyncState();
    setError(null);
    setIsCancelling(false);
    setIsDownloading(false);
    setJob(null);
    setUiState("validating");

    if (!isPdfFile(file)) {
      const invalidPdfError = new ProcessingApiError({
        code: "INVALID_PDF",
        message: "Please select a valid PDF document.",
      });
      setError(invalidPdfError);
      setUiState("failed");
      return;
    }

    slowTimerRef.current = window.setTimeout(() => {
      setSlowMessage(SLOW_REQUEST_MESSAGE);
    }, SLOW_REQUEST_DELAY_MS);

    setUiState("uploading");
    const controller = new AbortController();
    requestAbortRef.current = controller;

    try {
      const createdJob = await createUploadJob(file, type, options, controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      clearSlowTimer(true);
      setJob(createdJob);
      setUiState(mapJobStatusToUiState(createdJob.status));

      if (!isTerminalStatus(createdJob.status)) {
        clearPolling();
        pollTimerRef.current = window.setTimeout(() => {
          void pollJob(createdJob.id);
        }, POLL_INTERVAL_MS);
      }
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      clearSlowTimer(true);
      setError(normalizeProcessingError(error));
      setUiState("failed");
    } finally {
      if (requestAbortRef.current === controller) {
        requestAbortRef.current = null;
      }
    }
  };

  const cancelJob = async () => {
    if (!job) {
      return null;
    }

    clearPolling();
    setIsCancelling(true);

    const controller = new AbortController();
    requestAbortRef.current = controller;

    try {
      const cancelledJob = await cancelProcessingJob(job.id, controller.signal);

      if (controller.signal.aborted) {
        return null;
      }

      clearSlowTimer(true);

      if (!cancelledJob || isTerminalStatus(cancelledJob.status)) {
        setJob(
          cancelledJob ?? {
            ...job,
            message: "The processing job was cancelled.",
            status: "cancelled",
          },
        );
        setUiState(cancelledJob ? mapJobStatusToUiState(cancelledJob.status) : "cancelled");
        setError(null);
        return cancelledJob?.status ?? "cancelled";
      }

      const cancellationRequestedJob = {
        ...job,
        ...cancelledJob,
        message: cancelledJob.message ?? "Cancellation requested. Waiting for the job to stop.",
      };

      setJob(cancellationRequestedJob);
      setUiState(mapJobStatusToUiState(cancelledJob.status));
      setError(null);
      pollTimerRef.current = window.setTimeout(() => {
        void pollJob(job.id);
      }, POLL_INTERVAL_MS);
      return cancelledJob.status;
    } catch (error) {
      if (controller.signal.aborted) {
        return null;
      }

      setError(normalizeProcessingError(error));
      setUiState("failed");
      throw error;
    } finally {
      if (requestAbortRef.current === controller) {
        requestAbortRef.current = null;
      }

      setIsCancelling(false);
    }
  };

  const downloadResult = async (artifact?: string) => {
    if (!job) {
      return;
    }

    setIsDownloading(true);

    const controller = new AbortController();
    requestAbortRef.current = controller;

    try {
      const download = await getProcessingDownload(job.id, artifact, controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      triggerBrowserDownload(download.url, download.filename);
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      const normalizedError = normalizeProcessingError(error);
      setError(normalizedError);
      throw normalizedError;
    } finally {
      if (requestAbortRef.current === controller) {
        requestAbortRef.current = null;
      }

      setIsDownloading(false);
    }
  };

  return {
    cancelJob,
    downloadResult,
    error,
    isBusy: uiState !== "idle" && uiState !== "completed" && uiState !== "failed" && uiState !== "cancelled",
    isCancelling,
    isDownloading,
    job,
    reset,
    slowMessage,
    startJob,
    uiState,
  };
}
