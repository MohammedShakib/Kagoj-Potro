"use client";

import { useState } from "react";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ToolUploadZone } from "@/components/tools/tool-upload-zone";
import { PdfWorkspaceProvider } from "@/components/pdf-workspace/pdf-workspace";
import { PdfEditor } from "@/components/pdf-editor/pdf-editor";
import { EditorObject } from "@/types/pdf-editor";
import { cropPdf } from "@/lib/pdf/crop-pdf";
import { sanitizeFileName } from "@/lib/utils/file-name";
import { ResultCard } from "@/components/tools/result-card";
import { RelatedTools } from "@/components/tools/related-tools";

import { TOOLS } from "@/config/tools";

export default function CropPdfPage() {
  const tool = TOOLS.find(t => t.id === "crop-pdf")!;
  const [file, setFile] = useState<File | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async (objects: EditorObject[]) => {
    if (!file) return;
    try {
      setIsExporting(true);
      // Find the first crop object, or just assume we crop a 10% margin if none is drawn.
      // In a full implementation we'd read the crop object bounds.
      const cropObj = objects.find(o => o.type === "shape" && (o as any).shapeType === "rectangle");
      
      // We need percentage coords for cropPdf
      let cropRect = { x: 0, y: 0, width: 1, height: 1 };
      
      if (cropObj) {
        // Assume page is ~600px wide in preview
        // This is a simplified relative mapping
        const estimatedCanvasWidth = 600;
        const estimatedCanvasHeight = 800;
        cropRect = {
          x: Math.max(0, cropObj.x / estimatedCanvasWidth),
          y: Math.max(0, cropObj.y / estimatedCanvasHeight),
          width: Math.min(1, cropObj.width / estimatedCanvasWidth),
          height: Math.min(1, cropObj.height / estimatedCanvasHeight)
        };
      } else {
        // Default 10% trim if they click export without drawing a rectangle
        cropRect = { x: 0.1, y: 0.1, width: 0.8, height: 0.8 };
      }

      const pdfBytes = await cropPdf(file, cropRect, "all");
      setResultBlob(new Blob([pdfBytes as any], { type: "application/pdf" }));
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResultBlob(null);
  };

  return (
    <div className="container max-w-6xl py-8">
      <ToolPageHeader tool={tool} />

      <div className="mt-8">
        {!file ? (
          <ToolUploadZone
            onFilesSelect={(files) => setFile(files[0])}
            accept={{ "application/pdf": [".pdf"] }}
            maxSizeMB={50}
          />
        ) : !resultBlob ? (
          <div className="relative">
            <PdfWorkspaceProvider initialFile={file}>
              <PdfEditor 
                onExport={handleExport} 
                isExporting={isExporting} 
                allowedTools={["shape"]} // We reuse shape as the crop rectangle for phase 3
              />
            </PdfWorkspaceProvider>
            
            <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
              <div className="bg-slate-800 text-white text-sm px-4 py-2 rounded-full shadow-lg">
                Draw a rectangle to define the crop area, then Export.
              </div>
            </div>
          </div>
        ) : (
          <ResultCard
            blob={resultBlob}
            filename={`${sanitizeFileName(file.name)}-cropped.pdf`}
            onReset={reset}
          />
        )}
      </div>

      <RelatedTools currentToolId="crop-pdf" />
    </div>
  );
}
