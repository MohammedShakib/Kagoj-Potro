import * as pdfjs from "pdfjs-dist";

// Initialize the worker using the local copy in the public folder.
// This is robust for Next.js App Router and prevents Webpack issues.
if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

export { pdfjs };
