export type ProcessingToolId = "compress_pdf" | "ocr_pdf";

export type ProcessingOcrLanguage = "eng" | "ben" | "eng+ben";

export type ProcessingJobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export interface ProcessingTool {
  id: string;
  enabled: boolean;
  languages: string[] | null;
}

export interface ProcessingToolsResponse {
  tools: ProcessingTool[];
}

export interface ProcessingErrorPayload {
  code?: string | null;
  message?: string | null;
}

export interface ProcessingArtifact {
  object_key?: string;
  filename?: string;
  content_type?: string;
  size?: number;
}

export interface ProcessingJobResult {
  original_size?: number;
  output_size?: number;
  saved_bytes?: number;
  reduction_percent?: number;
  optimized?: boolean;
  artifacts?: Record<string, ProcessingArtifact>;
  primary_artifact?: string;
}

export interface ProcessingJob {
  id: string;
  type: string;
  status: string;
  progress?: number | null;
  stage?: string | null;
  message?: string | null;
  created_at?: string;
  result?: ProcessingJobResult | null;
  error?: ProcessingErrorPayload | null;
}

export interface ProcessingDownloadResponse {
  url: string;
  expires_in?: number;
  filename?: string;
}

export interface ProcessingCancelResponse {
  id: string;
  status: string;
  cancel_requested?: boolean;
  message?: string | null;
}
