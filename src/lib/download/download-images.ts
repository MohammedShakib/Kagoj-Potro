import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ConvertedImage } from "@/types/converter";

export async function downloadImages(images: ConvertedImage[], baseName: string) {
  if (images.length === 0) return;

  if (images.length === 1) {
    // Single page download
    const img = images[0];
    saveAs(img.blob, img.fileName);
    return;
  }

  // Multi-page download as ZIP
  const zip = new JSZip();
  const folderName = `${baseName}-jpg`;
  const folder = zip.folder(folderName);

  if (!folder) {
    throw new Error("Failed to create ZIP folder.");
  }

  for (const img of images) {
    folder.file(img.fileName, img.blob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, `${folderName}.zip`);
}
