import { createWorker, Worker } from 'tesseract.js';

let activeWorker: Worker | null = null;
let currentLanguage: string | null = null;

export type OcrProgressCallback = (status: string, progress: number) => void;

/**
 * Initializes a Tesseract worker for the given language.
 * Reuses the existing worker if the language hasn't changed.
 */
export async function getOcrWorker(language: string, onProgress?: OcrProgressCallback): Promise<Worker> {
  if (activeWorker && currentLanguage === language) {
    return activeWorker;
  }

  // Terminate old worker if language changed
  if (activeWorker) {
    await activeWorker.terminate();
    activeWorker = null;
  }

  const worker = await createWorker(language, 1, {
    logger: m => {
      if (onProgress) {
        onProgress(m.status, m.progress * 100);
      }
    }
  });

  activeWorker = worker;
  currentLanguage = language;
  return worker;
}

export async function terminateOcrWorker() {
  if (activeWorker) {
    await activeWorker.terminate();
    activeWorker = null;
    currentLanguage = null;
  }
}

/**
 * Runs OCR on a given image source (e.g. data URL, HTMLImageElement, canvas)
 */
export async function runOcr(worker: Worker, imageSource: any) {
  const result = await worker.recognize(imageSource);
  return result.data;
}
