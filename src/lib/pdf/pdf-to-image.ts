import { ConvertedImage, ConvertPdfOptions } from "@/types/converter";
import { sanitizeFileName } from "@/lib/utils/file-name";

export async function convertPdfToImages(
  file: File,
  options?: ConvertPdfOptions & { format?: "jpeg" | "png" }
): Promise<ConvertedImage[]> {
  const { pdfjs } = await import("./pdf-worker");
  
  const scale = options?.scale || 2.0;
  const quality = options?.quality || 0.9;
  const format = options?.format || "jpeg";
  const onProgress = options?.onProgress;

  const arrayBuffer = await file.arrayBuffer();
  
  // Load the PDF document
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const baseName = sanitizeFileName(file.name);
  const convertedImages: ConvertedImage[] = [];

  for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
    if (onProgress) {
      onProgress(pageNumber, numPages);
    }

    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      page.cleanup();
      throw new Error(`Failed to create canvas context for page ${pageNumber}`);
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (format === "jpeg") {
      // Fill white background to handle transparency in JPEGs
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    const renderContext = {
      canvasContext: context,
      canvas: null,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";

    // Generate output
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) {
            resolve(b);
          } else {
            reject(new Error(`Failed to convert canvas to Blob for page ${pageNumber}`));
          }
        },
        mimeType,
        quality
      );
    });

    const paddedPageNum = pageNumber.toString().padStart(numPages.toString().length, "0");
    const fileName = `${baseName}-page-${paddedPageNum}.${format === "jpeg" ? "jpg" : "png"}`;

    convertedImages.push({
      pageNumber,
      fileName,
      blob,
      width: canvas.width,
      height: canvas.height,
    });

    // Clean up
    page.cleanup();
    canvas.width = 0;
    canvas.height = 0;
  }

  // Cleanup PDF doc
  await loadingTask.destroy();

  return convertedImages;
}
