export type ImageFormat = "jpeg" | "png" | "webp";
export type ImageCleanupMode = "none" | "ai-shade";

export interface ImageConversionOptions {
  format: ImageFormat;
  quality?: number; // 0 to 1 for jpeg and webp
  background?: string; // hex color (e.g. #ffffff) for png -> jpeg conversion
  cleanupMode?: ImageCleanupMode;
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
  const { format, quality = 0.9, background = "#ffffff", cleanupMode = "none" } = options;

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

    ctx.drawImage(imageBitmap, 0, 0);
    imageBitmap.close();

    if (cleanupMode === "ai-shade") {
      removeAiBackgroundShade(ctx, canvas.width, canvas.height);
    }

    let outputCanvas = canvas;
    const shouldFlattenBackground = format === "jpeg" || cleanupMode === "ai-shade";

    // JPEG needs flattening; shade cleanup also flattens so the result prints as real white.
    if (shouldFlattenBackground) {
      const flattenedCanvas = document.createElement("canvas");
      flattenedCanvas.width = canvas.width;
      flattenedCanvas.height = canvas.height;

      const flattenedCtx = flattenedCanvas.getContext("2d");
      if (!flattenedCtx) {
        throw new Error("Could not create canvas context");
      }

      flattenedCtx.fillStyle = background;
      flattenedCtx.fillRect(0, 0, flattenedCanvas.width, flattenedCanvas.height);
      flattenedCtx.drawImage(canvas, 0, 0);
      if (cleanupMode === "ai-shade") {
        forcePureWhite(flattenedCtx, flattenedCanvas.width, flattenedCanvas.height);
      }
      outputCanvas = flattenedCanvas;
    }

    const mimeType = `image/${format}`;

    const blob = await new Promise<Blob>((resolve, reject) => {
      outputCanvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("Canvas toBlob failed"));
        },
        mimeType,
        cleanupMode === "ai-shade" && format !== "png" ? 1 : quality
      );
    });

    // Cleanup canvas
    canvas.width = 0;
    canvas.height = 0;
    if (outputCanvas !== canvas) {
      outputCanvas.width = 0;
      outputCanvas.height = 0;
    }

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

function removeAiBackgroundShade(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const saturation = max === 0 ? 0 : chroma / max;
    const isNeutral = saturation < 0.16 || chroma < 18;

    if (a < 12) {
      data[i + 3] = 0;
      continue;
    }

    // ChatGPT-style exports often include soft, neutral drop shadows as semi-transparent
    // black/gray pixels. Removing only low-saturation soft pixels keeps colored artwork intact.
    if (isNeutral && a < 235 && luma < 245) {
      data[i + 3] = luma < 90 && a > 150 ? a : 0;
      continue;
    }

    // Some files arrive already flattened: the shade is no longer alpha, just gray pixels.
    if (isNeutral && luma > 130) {
      const cleanupStrength = Math.min(1, Math.max(0, (luma - 130) / 65));
      data[i] = Math.round(r + (255 - r) * cleanupStrength);
      data[i + 1] = Math.round(g + (255 - g) * cleanupStrength);
      data[i + 2] = Math.round(b + (255 - b) * cleanupStrength);
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function forcePureWhite(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    if ((chroma < 20 && luma >= 245) || (chroma < 10 && luma >= 235)) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
