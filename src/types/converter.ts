export type ConversionStatus =
  | "idle"
  | "loading"
  | "converting"
  | "zipping"
  | "complete"
  | "error";

export type ConvertedImage = {
  pageNumber: number;
  fileName: string;
  blob: Blob;
  width: number;
  height: number;
};

export type ConvertPdfOptions = {
  scale?: number;
  quality?: number;
  onProgress?: (currentPage: number, totalPages: number) => void;
};
