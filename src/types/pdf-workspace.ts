export interface WorkspacePage {
  originalPageIndex: number;
  pageNumber: number;
  rotation: number;
  selected: boolean;
  deleted?: boolean;
}

export type DocumentStatus = "idle" | "loading" | "ready" | "processing" | "complete" | "error";
