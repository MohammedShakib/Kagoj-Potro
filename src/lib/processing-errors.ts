const PROCESSING_ERROR_MESSAGES: Record<string, string> = {
  INVALID_PDF: "The uploaded file is not a valid PDF.",
  PDF_TOO_LARGE: "This PDF is too large for the current processing service.",
  PDF_TOO_MANY_PAGES: "This PDF has too many pages for the current processing service.",
  PDF_ENCRYPTED: "This PDF is password protected. Unlock it first, then try again.",
  OCR_LANGUAGE_UNSUPPORTED: "The selected OCR language is not supported by the processing service.",
  JOB_FAILED: "The processing job failed before a result could be generated.",
  JOB_NOT_READY: "The file is not ready for download yet. Please wait a moment and try again.",
  INTERNAL_ERROR: "The processing service hit an internal error. Please try again.",
  PROCESSING_API_NOT_CONFIGURED: "The processing service URL is missing from the frontend environment.",
  PROCESSING_UNREACHABLE:
    "The processing service could not be reached. If the server was sleeping, wait a moment and try again.",
};

interface ProcessingApiErrorOptions {
  code?: string;
  message?: string;
  status?: number;
}

export class ProcessingApiError extends Error {
  code: string;
  status?: number;

  constructor({
    code = "INTERNAL_ERROR",
    message = PROCESSING_ERROR_MESSAGES.INTERNAL_ERROR,
    status,
  }: ProcessingApiErrorOptions = {}) {
    super(message);
    this.name = "ProcessingApiError";
    this.code = code;
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getProcessingErrorMessage(code?: string | null, fallback?: string | null) {
  if (code && PROCESSING_ERROR_MESSAGES[code]) {
    return PROCESSING_ERROR_MESSAGES[code];
  }

  if (fallback && fallback.trim()) {
    return fallback;
  }

  return PROCESSING_ERROR_MESSAGES.INTERNAL_ERROR;
}

export function parseProcessingErrorPayload(payload: unknown) {
  if (!isRecord(payload)) {
    return null;
  }

  const error = isRecord(payload.error) ? payload.error : payload;
  const code = typeof error.code === "string" ? error.code : undefined;
  const message = typeof error.message === "string" ? error.message : undefined;

  if (!code && !message) {
    return null;
  }

  return {
    code: code ?? "INTERNAL_ERROR",
    message: getProcessingErrorMessage(code, message),
  };
}

export function createProcessingApiError(payload: unknown, status?: number) {
  const parsed = parseProcessingErrorPayload(payload);

  if (parsed) {
    return new ProcessingApiError({
      code: parsed.code,
      message: parsed.message,
      status,
    });
  }

  return new ProcessingApiError({
    code: "INTERNAL_ERROR",
    message: getProcessingErrorMessage(undefined, typeof payload === "string" ? payload : undefined),
    status,
  });
}

export function normalizeProcessingError(error: unknown) {
  if (error instanceof ProcessingApiError) {
    return error;
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return new ProcessingApiError({
      code: "REQUEST_ABORTED",
      message: "The request was cancelled before it finished.",
    });
  }

  if (error instanceof TypeError) {
    return new ProcessingApiError({
      code: "PROCESSING_UNREACHABLE",
      message: getProcessingErrorMessage("PROCESSING_UNREACHABLE"),
    });
  }

  if (error instanceof Error) {
    return new ProcessingApiError({
      code: "INTERNAL_ERROR",
      message: getProcessingErrorMessage(undefined, error.message),
    });
  }

  return new ProcessingApiError();
}
