import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export type PageNumberPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type PageNumberFormat = "1" | "Page 1" | "1 / 10" | "Page 1 of 10";

export interface PageNumberOptions {
  position: PageNumberPosition;
  format: PageNumberFormat;
  startNumber: number;
  pageIndicesToNumber?: number[]; // Array of 0-indexed pages to number
  fontSize?: number;
  textColorHex?: string;
}

export async function addPageNumbers(file: File, options: PageNumberOptions): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;
  
  const {
    position = "bottom-center",
    format = "1",
    startNumber = 1,
    pageIndicesToNumber = Array.from({ length: totalPages }, (_, i) => i),
    fontSize = 12,
    textColorHex = "#000000",
  } = options;

  // Convert hex to rgb
  const hex = textColorHex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const color = rgb(r, g, b);

  const margin = 30; // safe margin

  let currentNumber = startNumber;

  // If using a "of Y" format, we usually mean total pages being numbered
  const formatTotalPages = pageIndicesToNumber.length;

  for (let i = 0; i < totalPages; i++) {
    if (!pageIndicesToNumber.includes(i)) {
      continue;
    }

    const page = pages[i];
    const { width, height } = page.getSize();
    
    let text = "";
    switch (format) {
      case "1":
        text = `${currentNumber}`;
        break;
      case "Page 1":
        text = `Page ${currentNumber}`;
        break;
      case "1 / 10":
        text = `${currentNumber} / ${formatTotalPages}`;
        break;
      case "Page 1 of 10":
        text = `Page ${currentNumber} of ${formatTotalPages}`;
        break;
    }

    const textWidth = font.widthOfTextAtSize(text, fontSize);
    
    let x = 0;
    let y = 0;

    switch (position) {
      case "top-left":
        x = margin;
        y = height - margin - fontSize;
        break;
      case "top-center":
        x = width / 2 - textWidth / 2;
        y = height - margin - fontSize;
        break;
      case "top-right":
        x = width - margin - textWidth;
        y = height - margin - fontSize;
        break;
      case "bottom-left":
        x = margin;
        y = margin;
        break;
      case "bottom-center":
        x = width / 2 - textWidth / 2;
        y = margin;
        break;
      case "bottom-right":
        x = width - margin - textWidth;
        y = margin;
        break;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color,
    });

    currentNumber++;
  }

  return await pdfDoc.save();
}
