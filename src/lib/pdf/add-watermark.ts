import { PDFDocument, rgb, degrees, StandardFonts, PDFFont, PDFImage } from "pdf-lib";

export type WatermarkPosition =
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface TextWatermarkOptions {
  type: "text";
  text: string;
  fontSize?: number;
  textColorHex?: string;
  opacity?: number; // 0 to 1
  rotation?: number; // degrees
  position?: WatermarkPosition;
  pageIndicesToWatermark?: number[];
}

export interface ImageWatermarkOptions {
  type: "image";
  imageFile: File;
  scale?: number; // scale factor
  opacity?: number; // 0 to 1
  rotation?: number; // degrees
  position?: WatermarkPosition;
  pageIndicesToWatermark?: number[];
}

export type WatermarkOptions = TextWatermarkOptions | ImageWatermarkOptions;

export async function addWatermark(file: File, options: WatermarkOptions): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  const pageIndices = options.pageIndicesToWatermark || Array.from({ length: totalPages }, (_, i) => i);
  const position = options.position || "center";
  const opacity = options.opacity ?? 0.3;
  const rotationAngle = options.rotation ?? 45;

  let embeddedFont: PDFFont | null = null;
  let embeddedImage: PDFImage | null = null;
  let imgDims = { width: 0, height: 0 };

  if (options.type === "text") {
    embeddedFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  } else if (options.type === "image") {
    const imgBuffer = await options.imageFile.arrayBuffer();
    if (options.imageFile.type === "image/png") {
      embeddedImage = await pdfDoc.embedPng(imgBuffer);
    } else if (options.imageFile.type === "image/jpeg" || options.imageFile.type === "image/jpg") {
      embeddedImage = await pdfDoc.embedJpg(imgBuffer);
    } else {
      throw new Error("Unsupported image format for watermark. Use PNG or JPG.");
    }
    const scaleFactor = options.scale ?? 1;
    imgDims = embeddedImage.scale(scaleFactor);
  }

  // Parse color if text
  let color = rgb(0.5, 0.5, 0.5); // Default gray
  if (options.type === "text" && options.textColorHex) {
    const hex = options.textColorHex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    color = rgb(r, g, b);
  }

  const margin = 50;

  for (let i = 0; i < totalPages; i++) {
    if (!pageIndices.includes(i)) continue;

    const page = pages[i];
    const { width, height } = page.getSize();
    
    let contentWidth = 0;
    let contentHeight = 0;

    if (options.type === "text" && embeddedFont) {
      const size = options.fontSize ?? 48;
      contentWidth = embeddedFont.widthOfTextAtSize(options.text, size);
      contentHeight = embeddedFont.heightAtSize(size);
    } else {
      contentWidth = imgDims.width;
      contentHeight = imgDims.height;
    }

    let x = 0;
    let y = 0;

    switch (position) {
      case "center":
        x = width / 2;
        y = height / 2;
        break;
      case "top-left":
        x = margin + contentWidth / 2;
        y = height - margin - contentHeight / 2;
        break;
      case "top-right":
        x = width - margin - contentWidth / 2;
        y = height - margin - contentHeight / 2;
        break;
      case "bottom-left":
        x = margin + contentWidth / 2;
        y = margin + contentHeight / 2;
        break;
      case "bottom-right":
        x = width - margin - contentWidth / 2;
        y = margin + contentHeight / 2;
        break;
    }

    if (options.type === "text" && embeddedFont) {
      page.drawText(options.text, {
        x: x - contentWidth / 2,
        y: y - contentHeight / 2,
        size: options.fontSize ?? 48,
        font: embeddedFont,
        color,
        opacity,
        rotate: degrees(rotationAngle),
      });
    } else if (options.type === "image" && embeddedImage) {
      page.drawImage(embeddedImage, {
        x: x - contentWidth / 2,
        y: y - contentHeight / 2,
        width: imgDims.width,
        height: imgDims.height,
        opacity,
        rotate: degrees(rotationAngle),
      });
    }
  }

  return await pdfDoc.save();
}
