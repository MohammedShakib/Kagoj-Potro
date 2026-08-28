export type ToolMode = 
  | "select"
  | "text"
  | "image"
  | "signature"
  | "highlight"
  | "draw"
  | "shape"
  | "crop";

export interface EditorObjectBase {
  id: string;
  pageIndex: number;
  x: number; // PDF coordinates (bottom-left origin usually, but we might normalize to top-left)
  y: number;
  width: number;
  height: number;
  rotation: number; // in degrees
  opacity: number;  // 0 to 1
  selected: boolean;
}

export interface TextObject extends EditorObjectBase {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string; // hex
  fontWeight: string | number;
  alignment: "left" | "center" | "right";
}

export interface ImageObject extends EditorObjectBase {
  type: "image";
  src: string; // Object URL
  file: File;
  aspectRatio: number;
}

export interface SignatureObject extends EditorObjectBase {
  type: "signature";
  src: string; // Object URL of the signature image (usually PNG with transparency)
  file: File | Blob;
  aspectRatio: number;
}

export interface HighlightObject extends EditorObjectBase {
  type: "highlight";
  color: string; // hex
}

export interface ShapeObject extends EditorObjectBase {
  type: "shape";
  shapeType: "rectangle" | "circle" | "line" | "arrow";
  fill?: string;
  stroke: string;
  strokeWidth: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface DrawingObject extends EditorObjectBase {
  type: "drawing";
  points: Point[]; // Relative to the object's top-left corner
  color: string;
  strokeWidth: number;
}

export type EditorObject = 
  | TextObject
  | ImageObject
  | SignatureObject
  | HighlightObject
  | ShapeObject
  | DrawingObject;

export interface EditorState {
  objects: EditorObject[];
  history: EditorObject[][];
  historyIndex: number;
  toolMode: ToolMode;
  zoom: number; // e.g. 1.0 for 100%
  selectedObjectId: string | null;
}
