import { PDFDocument, degrees } from "pdf-lib";

export interface RotatePdfOptions {
  degrees: 90 | -90 | 180;
  pages?: number[]; // 1-based page numbers. If empty/undefined, rotate all.
  onProgress?: (current: number, total: number) => void;
}

export async function rotatePdf(
  file: File,
  options: RotatePdfOptions
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  const totalPages = pdfDoc.getPageCount();
  
  const targetPages = options.pages || [];
  if (targetPages.length === 0) {
    for (let i = 1; i <= totalPages; i++) {
      targetPages.push(i);
    }
  }

  for (let i = 0; i < totalPages; i++) {
    if (options.onProgress) {
      options.onProgress(i + 1, totalPages);
    }
    
    // Check if 1-based page number is in targetPages
    if (targetPages.includes(i + 1)) {
      const page = pdfDoc.getPage(i);
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + options.degrees));
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as any], { type: "application/pdf" });
}
