export type ImageFormat = "jpeg" | "png" | "webp";

export interface ImageConversionOptions {
  format: ImageFormat;
  quality?: number; // 0 to 1 for jpeg and webp
  background?: string; // hex color (e.g. #ffffff) for png -> jpeg conversion
}

export interface ConvertedFile {
  file: File;
  originalName: string;
}

export async function convertImages(
  files: File[],
  options: ImageConversionOptions,
  onProgress?: (current: number, total: number) => void
): Promise<ConvertedFile[]> {
  const convertedFiles: ConvertedFile[] = [];
  const { format, quality = 0.9, background = "#ffffff" } = options;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Create an ImageBitmap which is more memory efficient than loading an Image element
    let imageBitmap: ImageBitmap | null = null;
    try {
      imageBitmap = await createImageBitmap(file);
    } catch (err) {
      console.error(`Failed to create ImageBitmap for ${file.name}`, err);
      continue;
    }

    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      imageBitmap.close();
      throw new Error("Could not create canvas context");
    }

    // If converting to JPEG, fill the background first since JPEG doesn't support transparency
    if (format === "jpeg") {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(imageBitmap, 0, 0);
    imageBitmap.close();

    const mimeType = `image/${format}`;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("Canvas toBlob failed"));
        },
        mimeType,
        quality
      );
    });

    // Cleanup canvas
    canvas.width = 0;
    canvas.height = 0;

    // Generate new filename
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const newExt = format === "jpeg" ? "jpg" : format;
    const newFileName = `${nameWithoutExt}.${newExt}`;

    const newFile = new File([blob], newFileName, { type: mimeType });
    convertedFiles.push({ file: newFile, originalName: file.name });

    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }

  return convertedFiles;
}
