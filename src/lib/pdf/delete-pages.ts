import { PDFDocument } from "pdf-lib";

export async function deletePages(file: File, pageIndicesToRemove: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  const totalPages = pdfDoc.getPageCount();
  const indicesToKeep = [];

  for (let i = 0; i < totalPages; i++) {
    if (!pageIndicesToRemove.includes(i)) {
      indicesToKeep.push(i);
    }
  }

  if (indicesToKeep.length === 0) {
    throw new Error("Cannot delete all pages from a PDF.");
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdfDoc, indicesToKeep);
  
  for (const page of copiedPages) {
    newPdf.addPage(page);
  }

  return await newPdf.save();
}
