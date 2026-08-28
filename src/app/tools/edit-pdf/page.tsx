"use client";

import { useState } from "react";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ToolUploadZone } from "@/components/tools/tool-upload-zone";
import { PdfWorkspaceProvider } from "@/components/pdf-workspace/pdf-workspace";
import { PdfEditor } from "@/components/pdf-editor/pdf-editor";
import { EditorObject } from "@/types/pdf-editor";
import { applyEditorObjects } from "@/lib/pdf/apply-editor-objects";
import { sanitizeFileName } from "@/lib/utils/file-name";
import { ResultCard } from "@/components/tools/result-card";
import { RelatedTools } from "@/components/tools/related-tools";

import { TOOLS } from "@/config/tools";

export default function EditPdfPage() {
  const tool = TOOLS.find(t => t.id === "edit-pdf")!;
  const [file, setFile] = useState<File | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async (objects: EditorObject[]) => {
    if (!file) return;
    try {
      setIsExporting(true);
      const pdfBytes = await applyEditorObjects(file, objects, 1.0);
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
              <PdfEditor onExport={handleExport} isExporting={isExporting} />
            </PdfWorkspaceProvider>
          </div>
        ) : (
          <ResultCard
            blob={resultBlob}
            filename={`${sanitizeFileName(file.name)}-edited.pdf`}
            onReset={reset}
          />
        )}
      </div>

      <RelatedTools currentToolId="edit-pdf" />
    </div>
  );
}
