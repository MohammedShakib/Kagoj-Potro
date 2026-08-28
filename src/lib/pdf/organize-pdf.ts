import { PDFDocument, degrees } from "pdf-lib";
import { WorkspacePage } from "@/types/pdf-workspace";

export async function organizePdf(file: File, pages: WorkspacePage[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  const newPdf = await PDFDocument.create();
  
  // Create an array of indices to copy (0-indexed)
  const indicesToCopy = pages.map((p) => p.originalPageIndex);
  
  // Copy all needed pages from the original document
  // Note: pdf-lib copyPages creates exact copies. If we have duplicates, we can copy the same index multiple times
  const copiedPages = await newPdf.copyPages(pdfDoc, indicesToCopy);

  // Add copied pages to the new document and apply rotation
  pages.forEach((workspacePage, index) => {
    const page = copiedPages[index];
    
    if (workspacePage.rotation !== 0) {
      // Get current rotation and add the new rotation
      const currentRotation = page.getRotation().angle;
      const newRotation = (currentRotation + workspacePage.rotation) % 360;
      // pdf-lib requires positive rotation 0, 90, 180, 270
      const normalizedRotation = newRotation < 0 ? 360 + newRotation : newRotation;
      
      page.setRotation(degrees(normalizedRotation));
    }
    
    newPdf.addPage(page);
  });

  return await newPdf.save();
}
