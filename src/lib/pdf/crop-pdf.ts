import { PDFDocument } from "pdf-lib";

export interface CropRect {
  x: number; // percentage (0-1)
  y: number; // percentage (0-1)
  width: number; // percentage (0-1)
  height: number; // percentage (0-1)
}

export async function cropPdf(
  file: File,
  cropRect: CropRect,
  pagesToCrop: "current" | "all" = "all",
  currentPageIndex: number = 0
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    if (pagesToCrop === "current" && i !== currentPageIndex) {
      continue;
    }

    const page = pages[i];
    // pdf-lib's getSize() returns the unrotated dimensions
    const { width, height } = page.getSize();
    
    // We apply relative margins to handle differently sized pages
    const leftMargin = cropRect.x * width;
    const bottomMargin = (1 - (cropRect.y + cropRect.height)) * height;
    const cropWidth = cropRect.width * width;
    const cropHeight = cropRect.height * height;

    page.setCropBox(leftMargin, bottomMargin, cropWidth, cropHeight);
  }

  return await pdfDoc.save();
}
