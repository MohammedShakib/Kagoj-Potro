import { PDFDocument } from "pdf-lib";

export async function mergePdfs(
  files: File[],
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    
    if (onProgress) {
      onProgress(i + 1, total);
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = new Uint8Array(await mergedPdf.save());
  return new Blob([pdfBytes], { type: "application/pdf" });
}
