import { PDFDocument } from "pdf-lib";

export interface ImageToPdfOptions {
  fitToPage?: boolean;
  onProgress?: (current: number, total: number) => void;
}

export async function convertImagesToPdf(
  files: File[],
  options?: ImageToPdfOptions
): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const total = files.length;
  const fitToPage = options?.fitToPage ?? true;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    
    if (options?.onProgress) {
      options.onProgress(i + 1, total);
    }

    const arrayBuffer = await file.arrayBuffer();
    
    let image;
    if (file.type === "image/png") {
      image = await pdfDoc.embedPng(arrayBuffer);
    } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
      image = await pdfDoc.embedJpg(arrayBuffer);
    } else {
      throw new Error(`Unsupported image type: ${file.type}`);
    }

    const pageDims = { width: image.width, height: image.height };
    
    if (!fitToPage) {
      // A4 default dimensions in points: 595.28 x 841.89
      pageDims.width = 595.28;
      pageDims.height = 841.89;
    }

    const page = pdfDoc.addPage([pageDims.width, pageDims.height]);

    const drawDims = { width: image.width, height: image.height };
    
    if (!fitToPage) {
      // Scale to fit within A4
      const scale = Math.min(
        pageDims.width / image.width,
        pageDims.height / image.height
      );
      drawDims.width = image.width * scale;
      drawDims.height = image.height * scale;
    }

    const x = pageDims.width / 2 - drawDims.width / 2;
    const y = pageDims.height / 2 - drawDims.height / 2;

    page.drawImage(image, {
      x,
      y,
      width: drawDims.width,
      height: drawDims.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as any], { type: "application/pdf" });
}
