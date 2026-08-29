// @ts-ignore
declare const cv: any;
declare function importScripts(...urls: string[]): void;

export type WorkerCommand = 
  | { type: "PING" }
  | { type: "DETECT_DOCUMENT", id: string, imageBlob: Blob }
  | { type: "TRANSFORM_PERSPECTIVE", id: string, imageBlob: Blob, corners: any, filter: string };

export type WorkerResponse = 
  | { type: "PONG" }
  | { type: "READY" }
  | { type: "DETECT_DOCUMENT_RESULT", id: string, corners: any | null, error?: string }
  | { type: "TRANSFORM_PERSPECTIVE_RESULT", id: string, resultBlob: Blob, error?: string };

let isReady = false;

// Load OpenCV script dynamically
try {
  importScripts("/lib/opencv.js");
} catch (err) {
  console.warn("Failed to importScripts. Maybe running in an environment without it?", err);
}

// Initialize OpenCV
if (typeof cv !== "undefined") {
  if (cv instanceof Promise) {
    cv.then(() => {
      isReady = true;
      postMessage({ type: "READY" });
    });
  } else {
    if (typeof cv.getBuildInformation === "function") {
      isReady = true;
      postMessage({ type: "READY" });
    } else {
      cv.onRuntimeInitialized = () => {
        isReady = true;
        postMessage({ type: "READY" });
      };
    }
  }
}

self.onmessage = async (e: MessageEvent<WorkerCommand>) => {
  const { data } = e;
  
  if (!isReady && data.type !== "PING") {
    // We should ideally queue these, but for now we'll just throw
    console.warn("Worker not ready yet");
  }

  try {
    switch (data.type) {
      case "PING":
        postMessage({ type: "PONG" });
        break;
      
      case "DETECT_DOCUMENT": {
        const corners = await detectDocument(data.imageBlob);
        postMessage({ type: "DETECT_DOCUMENT_RESULT", id: data.id, corners });
        break;
      }
      
      case "TRANSFORM_PERSPECTIVE": {
        const resultBlob = await transformPerspective(data.imageBlob, data.corners, data.filter);
        postMessage({ type: "TRANSFORM_PERSPECTIVE_RESULT", id: data.id, resultBlob });
        break;
      }
    }
  } catch (error) {
    console.error("Worker error:", error);
    if (data.type === "DETECT_DOCUMENT") {
      postMessage({ type: "DETECT_DOCUMENT_RESULT", id: data.id, corners: null, error: String(error) });
    } else if (data.type === "TRANSFORM_PERSPECTIVE") {
      // @ts-ignore
      postMessage({ type: "TRANSFORM_PERSPECTIVE_RESULT", id: data.id, resultBlob: null, error: String(error) });
    }
  }
};

async function blobToMat(blob: Blob): Promise<any> {
  const bitmap = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  ctx.drawImage(bitmap, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return cv.matFromImageData(imgData);
}

async function matToBlob(mat: any): Promise<Blob> {
  const canvas = new OffscreenCanvas(mat.cols, mat.rows);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  
  const imgData = new ImageData(new Uint8ClampedArray(mat.data), mat.cols, mat.rows);
  ctx.putImageData(imgData, 0, 0);
  
  return await canvas.convertToBlob({ type: "image/jpeg", quality: 0.85 });
}

async function detectDocument(blob: Blob) {
  let src;
  let dst;
  let gray;
  let blur;
  let edges;
  let contours;
  let hierarchy;
  
  try {
    src = await blobToMat(blob);
    
    // Scale down for faster detection
    const MAX_SIZE = 800;
    let scale = 1.0;
    if (src.cols > MAX_SIZE || src.rows > MAX_SIZE) {
      scale = Math.min(MAX_SIZE / src.cols, MAX_SIZE / src.rows);
    }
    
    dst = new cv.Mat();
    const dsize = new cv.Size(Math.round(src.cols * scale), Math.round(src.rows * scale));
    cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA);
    
    gray = new cv.Mat();
    cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
    
    blur = new cv.Mat();
    cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
    
    edges = new cv.Mat();
    cv.Canny(blur, edges, 75, 200, 3, false);
    
    contours = new cv.MatVector();
    hierarchy = new cv.Mat();
    cv.findContours(edges, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
    
    // Sort contours by area descending
    let maxArea = 0;
    let maxContourIndex = -1;
    
    for (let i = 0; i < contours.size(); ++i) {
      const cnt = contours.get(i);
      const area = cv.contourArea(cnt);
      if (area > maxArea) {
        // approximate polygon
        const peri = cv.arcLength(cnt, true);
        const approx = new cv.Mat();
        cv.approxPolyDP(cnt, approx, 0.02 * peri, true);
        
        if (approx.rows === 4) {
          maxArea = area;
          maxContourIndex = i;
        }
        approx.delete();
      }
      cnt.delete();
    }
    
    if (maxContourIndex !== -1) {
      const bestCnt = contours.get(maxContourIndex);
      const peri = cv.arcLength(bestCnt, true);
      const approx = new cv.Mat();
      cv.approxPolyDP(bestCnt, approx, 0.02 * peri, true);
      
      const pts = [];
      for (let i = 0; i < 4; i++) {
        pts.push({
          x: approx.data32S[i * 2] / scale,
          y: approx.data32S[i * 2 + 1] / scale
        });
      }
      approx.delete();
      bestCnt.delete();
      
      // Order points: tl, tr, br, bl
      return orderPoints(pts);
    }
    
    return null;
  } finally {
    if (src) src.delete();
    if (dst) dst.delete();
    if (gray) gray.delete();
    if (blur) blur.delete();
    if (edges) edges.delete();
    if (contours) contours.delete();
    if (hierarchy) hierarchy.delete();
  }
}

async function transformPerspective(blob: Blob, corners: any, filter: string) {
  let src;
  let dst;
  let M;
  
  try {
    src = await blobToMat(blob);
    
    // Output size
    const widthA = Math.hypot(corners.bottomRight.x - corners.bottomLeft.x, corners.bottomRight.y - corners.bottomLeft.y);
    const widthB = Math.hypot(corners.topRight.x - corners.topLeft.x, corners.topRight.y - corners.topLeft.y);
    const maxWidth = Math.max(widthA, widthB);

    const heightA = Math.hypot(corners.topRight.x - corners.bottomRight.x, corners.topRight.y - corners.bottomRight.y);
    const heightB = Math.hypot(corners.topLeft.x - corners.bottomLeft.x, corners.topLeft.y - corners.bottomLeft.y);
    const maxHeight = Math.max(heightA, heightB);

    const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      corners.topLeft.x, corners.topLeft.y,
      corners.topRight.x, corners.topRight.y,
      corners.bottomRight.x, corners.bottomRight.y,
      corners.bottomLeft.x, corners.bottomLeft.y
    ]);
    
    const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0, 0,
      maxWidth - 1, 0,
      maxWidth - 1, maxHeight - 1,
      0, maxHeight - 1
    ]);

    M = cv.getPerspectiveTransform(srcTri, dstTri);
    dst = new cv.Mat();
    cv.warpPerspective(src, dst, M, new cv.Size(maxWidth, maxHeight), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    
    // Apply filters
    if (filter === "grayscale" || filter === "bw") {
      cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 0);
      if (filter === "bw") {
        cv.adaptiveThreshold(dst, dst, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);
      }
      cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA, 0);
    } else if (filter === "document") {
      // simple document enhancement
      const alpha = 1.2;
      const beta = 10;
      dst.convertTo(dst, -1, alpha, beta);
    }
    
    srcTri.delete();
    dstTri.delete();
    
    return await matToBlob(dst);
  } finally {
    if (src) src.delete();
    if (dst) dst.delete();
    if (M) M.delete();
  }
}

function orderPoints(pts: any[]) {
  const sortedByX = [...pts].sort((a, b) => a.x - b.x);
  const leftPts = sortedByX.slice(0, 2);
  const rightPts = sortedByX.slice(2, 4);
  
  const tl = leftPts[0].y < leftPts[1].y ? leftPts[0] : leftPts[1];
  const bl = leftPts[0].y < leftPts[1].y ? leftPts[1] : leftPts[0];
  
  const tr = rightPts[0].y < rightPts[1].y ? rightPts[0] : rightPts[1];
  const br = rightPts[0].y < rightPts[1].y ? rightPts[1] : rightPts[0];
  
  return { topLeft: tl, topRight: tr, bottomRight: br, bottomLeft: bl };
}
