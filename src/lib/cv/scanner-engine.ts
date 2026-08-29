import type { WorkerCommand, WorkerResponse } from "./scanner.worker";
import type { Quadrilateral } from "@/types/scanner";

export class ScannerEngine {
  private worker: Worker | null = null;
  private pendingRequests = new Map<string, { resolve: (val: any) => void, reject: (err: any) => void }>();
  private isReady = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.worker = new Worker(new URL("./scanner.worker.ts", import.meta.url));
      this.worker.onmessage = this.handleMessage.bind(this);
    }
  }

  private handleMessage(e: MessageEvent<WorkerResponse>) {
    const data = e.data;
    
    if (data.type === "READY") {
      this.isReady = true;
      return;
    }

    if (data.type === "DETECT_DOCUMENT_RESULT" || data.type === "TRANSFORM_PERSPECTIVE_RESULT") {
      const pending = this.pendingRequests.get(data.id);
      if (pending) {
        if (data.error) {
          pending.reject(new Error(data.error));
        } else {
          // @ts-ignore
          pending.resolve(data.type === "DETECT_DOCUMENT_RESULT" ? data.corners : data.resultBlob);
        }
        this.pendingRequests.delete(data.id);
      }
    }
  }

  public waitUntilReady(): Promise<void> {
    if (this.isReady) return Promise.resolve();
    
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (this.isReady) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
  }

  public detectDocument(imageBlob: Blob): Promise<Quadrilateral | null> {
    return new Promise((resolve, reject) => {
      if (!this.worker) return reject(new Error("Worker not initialized"));
      
      const id = crypto.randomUUID();
      this.pendingRequests.set(id, { resolve, reject });
      
      const cmd: WorkerCommand = { type: "DETECT_DOCUMENT", id, imageBlob };
      this.worker.postMessage(cmd);
    });
  }

  public transformPerspective(imageBlob: Blob, corners: Quadrilateral, filter: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.worker) return reject(new Error("Worker not initialized"));
      
      const id = crypto.randomUUID();
      this.pendingRequests.set(id, { resolve, reject });
      
      const cmd: WorkerCommand = { type: "TRANSFORM_PERSPECTIVE", id, imageBlob, corners, filter };
      this.worker.postMessage(cmd);
    });
  }

  public destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
