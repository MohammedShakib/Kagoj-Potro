import JSZip from "jszip";
import { saveAs } from "file-saver";

export interface ZipFileEntry {
  name: string;
  data: Blob | File | Uint8Array | ArrayBuffer | string;
}

export async function createAndDownloadZip(
  files: ZipFileEntry[],
  zipName: string
): Promise<void> {
  const zip = new JSZip();

  // Track filenames to avoid duplicates
  const nameCounts: Record<string, number> = {};

  for (const file of files) {
    let finalName = file.name;
    
    if (nameCounts[file.name]) {
      const extIndex = file.name.lastIndexOf(".");
      const base = extIndex !== -1 ? file.name.substring(0, extIndex) : file.name;
      const ext = extIndex !== -1 ? file.name.substring(extIndex) : "";
      finalName = `${base} (${nameCounts[file.name]})${ext}`;
      nameCounts[file.name]++;
    } else {
      nameCounts[file.name] = 1;
    }

    zip.file(finalName, file.data);
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, zipName);
}
