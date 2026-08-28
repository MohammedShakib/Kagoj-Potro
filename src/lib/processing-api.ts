import {
  createProcessingApiError,
  getProcessingErrorMessage,
  ProcessingApiError,
} from "@/lib/processing-errors";
import type {
  ProcessingCancelResponse,
  ProcessingDownloadResponse,
  ProcessingJob,
  ProcessingToolId,
  ProcessingToolsResponse,
} from "@/types/processing";

const PROCESSING_API_PREFIX = "/api/v1";

function getProcessingApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_PROCESSING_API_URL?.trim();

  if (!baseUrl) {
    throw new ProcessingApiError({
      code: "PROCESSING_API_NOT_CONFIGURED",
      message: getProcessingErrorMessage("PROCESSING_API_NOT_CONFIGURED"),
    });
  }

  return baseUrl.replace(/\/$/, "");
}

function buildProcessingUrl(path: string, query?: Record<string, string | undefined>) {
  const url = new URL(`${getProcessingApiBaseUrl()}${PROCESSING_API_PREFIX}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
  }

  return url.toString();
}

async function readResponseBody(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}

async function request<T>(path: string, init?: RequestInit, query?: Record<string, string | undefined>) {
  const response = await fetch(buildProcessingUrl(path, query), {
    cache: "no-store",
    ...init,
  });
  const body = await readResponseBody(response);

  if (!response.ok) {
    throw createProcessingApiError(body, response.status);
  }

  return body as T;
}

export function getProcessingTools(signal?: AbortSignal) {
  return request<ProcessingToolsResponse>("/tools", {
    method: "GET",
    signal,
  });
}

export function createUploadJob(
  file: File,
  type: ProcessingToolId,
  options: Record<string, unknown>,
  signal?: AbortSignal,
) {
  const formData = new FormData();
  formData.set("file", file);
  formData.set("type", type);
  formData.set("options", JSON.stringify(options));

  return request<ProcessingJob>("/jobs/upload", {
    method: "POST",
    body: formData,
    signal,
  });
}

export function getProcessingJob(jobId: string, signal?: AbortSignal) {
  return request<ProcessingJob>(`/jobs/${jobId}`, {
    method: "GET",
    signal,
  });
}

export function getProcessingDownload(jobId: string, artifact?: string, signal?: AbortSignal) {
  return request<ProcessingDownloadResponse>(
    `/jobs/${jobId}/download`,
    {
      method: "GET",
      signal,
    },
    { artifact },
  );
}

export function cancelProcessingJob(jobId: string, signal?: AbortSignal) {
  return request<ProcessingCancelResponse | ProcessingJob | null>(`/jobs/${jobId}/cancel`, {
    method: "POST",
    signal,
  });
}
