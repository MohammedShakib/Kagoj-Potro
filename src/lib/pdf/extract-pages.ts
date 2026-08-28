import { PDFDocument } from "pdf-lib";

export async function extractPages(file: File, pageIndices: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  const newPdf = await PDFDocument.create();
  
  const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
  
  for (const page of copiedPages) {
    newPdf.addPage(page);
  }

  return await newPdf.save();
}
