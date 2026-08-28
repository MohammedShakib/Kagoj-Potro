import { PDFDocument } from "pdf-lib";

export interface SplitPdfOptions {
  mode: "extract" | "split-all";
  ranges?: string; // e.g. "1-3, 5, 8-10"
  onProgress?: (current: number, total: number) => void;
}

export interface SplitPdfResult {
  fileName: string;
  blob: Blob;
}

function parseRanges(ranges: string, maxPage: number): number[] {
  const pages = new Set<number>();
  
  ranges.split(',').forEach(part => {
    part = part.trim();
    if (!part) return;
    
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr);
      const end = parseInt(endStr);
      
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= maxPage) {
            pages.add(i);
          }
        }
      }
    } else {
      const pageNum = parseInt(part);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPage) {
        pages.add(pageNum);
      }
    }
  });

  return Array.from(pages).sort((a, b) => a - b);
}

export async function splitPdf(
  file: File,
  options: SplitPdfOptions
): Promise<SplitPdfResult[]> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  const totalPages = sourcePdf.getPageCount();
  const baseName = file.name.replace(/\.[^/.]+$/, "");

  const results: SplitPdfResult[] = [];

  if (options.mode === "extract") {
    if (!options.ranges) throw new Error("Page ranges required for extract mode");
    
    const pageNumbers = parseRanges(options.ranges, totalPages);
    if (pageNumbers.length === 0) throw new Error("No valid pages selected");

    if (options.onProgress) options.onProgress(1, 1);

    const newPdf = await PDFDocument.create();
    // pdf-lib uses 0-based indexing for copyPages
    const indicesToCopy = pageNumbers.map(p => p - 1);
    
    const copiedPages = await newPdf.copyPages(sourcePdf, indicesToCopy);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = new Uint8Array(await newPdf.save());
    results.push({
      fileName: `${baseName}-extracted.pdf`,
      blob: new Blob([pdfBytes], { type: "application/pdf" }),
    });

  } else {
    // split-all
    for (let i = 0; i < totalPages; i++) {
      if (options.onProgress) options.onProgress(i + 1, totalPages);

      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(sourcePdf, [i]);
      newPdf.addPage(copiedPage);

      const pdfBytes = new Uint8Array(await newPdf.save());
      const paddedPageNum = (i + 1).toString().padStart(totalPages.toString().length, "0");
      
      results.push({
        fileName: `${baseName}-page-${paddedPageNum}.pdf`,
        blob: new Blob([pdfBytes], { type: "application/pdf" }),
      });
    }
  }

  return results;
}
