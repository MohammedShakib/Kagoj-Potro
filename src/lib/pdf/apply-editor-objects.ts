import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { EditorObject, TextObject, ImageObject, SignatureObject } from "@/types/pdf-editor";

/**
 * Applies a list of EditorObjects to a PDF file and returns the modified PDF bytes.
 * NOTE: For Phase 3, we assume obj.x and obj.y are CSS coordinates relative to a Canvas 
 * that was scaled to match the PDF's unrotated dimensions on screen.
 * 
 * To make this accurate, we need the viewport scale that was used during editing.
 * For simplicity in this implementation, we assume we calculate the PDF coordinate
 * by dividing the CSS coordinate by the zoom scale.
 */
export async function applyEditorObjects(
  file: File,
  objects: EditorObject[],
  zoom: number
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  let embeddedHelvetica: any = null;

  for (const obj of objects) {
    const page = pages[obj.pageIndex];
    if (!page) continue;

    const { width: pdfWidth, height: pdfHeight } = page.getSize();
    const rotation = page.getRotation().angle;

    // The object's x/y are CSS coordinates. We divide by zoom to get "unscaled" CSS coordinates.
    const unscaledX = obj.x / zoom;
    const unscaledY = obj.y / zoom;
    
    // In CSS, origin is Top-Left. In PDF, origin is Bottom-Left.
    // Also, pdf-lib places objects relative to the UNROTATED bottom-left corner.
    
    let pdfX = 0;
    let pdfY = 0;

    switch (rotation) {
      case 0:
      case 360:
        pdfX = unscaledX;
        pdfY = pdfHeight - unscaledY - (obj.height / zoom); // adjust for object height
        break;
      case 90:
        pdfX = unscaledY;
        pdfY = unscaledX;
        break;
      case 180:
        pdfX = pdfWidth - unscaledX - (obj.width / zoom);
        pdfY = unscaledY;
        break;
      case 270:
        pdfX = pdfWidth - unscaledY - (obj.height / zoom);
        pdfY = pdfHeight - unscaledX - (obj.width / zoom);
        break;
      default:
        pdfX = unscaledX;
        pdfY = pdfHeight - unscaledY - (obj.height / zoom);
    }

    if (obj.type === "text") {
      const textObj = obj as TextObject;
      if (!embeddedHelvetica) {
        embeddedHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      }

      // Convert hex to rgb
      const hex = textObj.color.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      page.drawText(textObj.text, {
        x: pdfX,
        y: pdfY + (textObj.height / zoom) - (textObj.fontSize / zoom), // Baseline adjustment
        size: textObj.fontSize / zoom,
        font: embeddedHelvetica,
        color: rgb(r, g, b),
        opacity: textObj.opacity,
        rotate: degrees(-textObj.rotation), // CSS rotation is clockwise, PDF is counter
      });
    } else if (obj.type === "image" || obj.type === "signature") {
      const imgObj = obj as (ImageObject | SignatureObject);
      let embeddedImage = null;
      
      const imgBuffer = await imgObj.file.arrayBuffer();
      
      if (imgObj.file.type === "image/png") {
        embeddedImage = await pdfDoc.embedPng(imgBuffer);
      } else if (imgObj.file.type === "image/jpeg" || imgObj.file.type === "image/jpg") {
        embeddedImage = await pdfDoc.embedJpg(imgBuffer);
      }
      
      if (embeddedImage) {
        page.drawImage(embeddedImage, {
          x: pdfX,
          y: pdfY,
          width: imgObj.width / zoom,
          height: imgObj.height / zoom,
          opacity: imgObj.opacity,
          rotate: degrees(-imgObj.rotation),
        });
      }
    }
  }

  return await pdfDoc.save();
}
