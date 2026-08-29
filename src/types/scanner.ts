export type ScannerState = 
  | "idle"
  | "camera"
  | "captured"
  | "adjusting"
  | "review"
  | "page_review"
  | "processing"
  | "ready"
  | "complete"
  | "error";

export interface Point {
  x: number;
  y: number;
}

export interface Quadrilateral {
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
}

export type ScanFilter = "original" | "magic" | "document" | "grayscale" | "bw" | "enhanced";

export interface ScanPage {
  id: string;
  originalBlob: Blob;
  processedBlob: Blob;
  previewUrl: string; // ObjectURL for rendering UI
  corners?: Quadrilateral;
  rotation: number;
  filter: ScanFilter;
}
