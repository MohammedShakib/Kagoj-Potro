import { PDFDocument, rgb } from 'pdf-lib';
import type { Page } from 'tesseract.js';

export interface OcrPageResult {
  pageIndex: number;
  ocrData: any;
  canvasWidth: number;
  canvasHeight: number;
}

export async function generateSearchablePdf(
  originalPdfBytes: ArrayBuffer,
  ocrResults: OcrPageResult[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  const pages = pdfDoc.getPages();

  // Load a standard font for the invisible text.
  const font = await pdfDoc.embedFont('Helvetica');

  for (const result of ocrResults) {
    const page = pages[result.pageIndex];
    if (!page) continue;

    const { width: pdfWidth, height: pdfHeight } = page.getSize();
    const { canvasWidth, canvasHeight } = result;

    // Calculate scale factors from canvas pixels to PDF points
    const scaleX = pdfWidth / canvasWidth;
    const scaleY = pdfHeight / canvasHeight;

    const words = result.ocrData.words || [];

    for (const word of words) {
      if (!word.text || word.text.trim() === '') continue;

      const bbox = word.bbox;
      // bbox is { x0, y0, x1, y1 } in canvas pixels
      // In pdf-lib, (0,0) is bottom-left. Canvas (0,0) is top-left.
      
      const wordWidthPixels = bbox.x1 - bbox.x0;
      const wordHeightPixels = bbox.y1 - bbox.y0;

      const pdfX = bbox.x0 * scaleX;
      // Convert top-left Y to bottom-left Y
      const pdfY = pdfHeight - (bbox.y1 * scaleY);
      
      const pdfWordWidth = wordWidthPixels * scaleX;
      const pdfWordHeight = wordHeightPixels * scaleY;

      // Calculate an approximate font size to match the box height
      // Typically, font size matches the height of the bounding box
      const fontSize = pdfWordHeight;

      // We want to squeeze or stretch the text to fit the exact width.
      // pdf-lib's drawText doesn't auto-squeeze, but we can set the invisible color.
      // We just draw it at the calculated font size. 
      // To make it truly invisible: opacity = 0
      
      page.drawText(word.text, {
        x: pdfX,
        y: pdfY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
        opacity: 0, // invisible
      });
    }
  }

  return await pdfDoc.save();
}
