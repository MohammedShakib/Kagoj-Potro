import { PDFPage } from "pdf-lib";

export interface ViewportInfo {
  scale: number;
  rotation: number;
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * Converts a screen coordinate (relative to the top-left of the PDF canvas)
 * into a PDF document coordinate (relative to the bottom-left of the unrotated page).
 */
export function screenToPdfCoordinates(
  screenX: number,
  screenY: number,
  page: PDFPage,
  viewport: ViewportInfo
): { x: number; y: number } {
  // pdf-lib getSize() returns the unrotated size of the page's MediaBox/CropBox
  const { width: pdfWidth, height: pdfHeight } = page.getSize();
  const rotation = page.getRotation().angle;

  // First, normalize the screen coordinates to a 0-1 scale relative to the rendered canvas
  const normalizedX = screenX / viewport.canvasWidth;
  const normalizedY = screenY / viewport.canvasHeight;

  // Rendered canvas might have width and height swapped compared to the unrotated PDF page
  // due to the viewport rotation.
  // PDF rotation means the page is rotated clockwise.
  
  let pdfX = 0;
  let pdfY = 0;

  // We need to map the normalized top-left origin (screen) to the bottom-left origin (PDF)
  // taking into account the page's rotation.
  switch (rotation) {
    case 0:
    case 360:
      pdfX = normalizedX * pdfWidth;
      pdfY = (1 - normalizedY) * pdfHeight;
      break;
    case 90:
      // Canvas is rotated 90 deg clockwise.
      // Top-left of canvas is bottom-left of unrotated PDF.
      pdfX = normalizedY * pdfWidth;
      pdfY = normalizedX * pdfHeight;
      break;
    case 180:
      // Canvas is rotated 180 deg.
      // Top-left of canvas is bottom-right of unrotated PDF.
      pdfX = (1 - normalizedX) * pdfWidth;
      pdfY = normalizedY * pdfHeight;
      break;
    case 270:
      // Canvas is rotated 270 deg clockwise (90 deg counter-clockwise).
      // Top-left of canvas is top-right of unrotated PDF.
      pdfX = (1 - normalizedY) * pdfWidth;
      pdfY = (1 - normalizedX) * pdfHeight;
      break;
    default:
      // Fallback to 0 if irregular rotation
      pdfX = normalizedX * pdfWidth;
      pdfY = (1 - normalizedY) * pdfHeight;
  }

  return { x: pdfX, y: pdfY };
}

/**
 * Converts screen dimensions (width, height) to PDF dimensions.
 * Useful for images or signatures dragged onto the canvas.
 */
export function screenToPdfDimensions(
  screenWidth: number,
  screenHeight: number,
  page: PDFPage,
  viewport: ViewportInfo
): { width: number; height: number } {
  // Dimension conversion is purely scale-based.
  // We use the canvas width and the rotated page width.
  const rotation = page.getRotation().angle;
  const { width: pdfWidth, height: pdfHeight } = page.getSize();
  
  // The actual width of the PDF as rendered on screen
  const renderedPdfWidth = (rotation === 90 || rotation === 270) ? pdfHeight : pdfWidth;
  
  const scale = renderedPdfWidth / viewport.canvasWidth;

  return {
    width: screenWidth * scale,
    height: screenHeight * scale,
  };
}
