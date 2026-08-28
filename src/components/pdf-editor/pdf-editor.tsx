"use client";

import { ReactNode } from "react";
import { PdfEditorProvider } from "./pdf-editor-context";
import { PdfEditorLayout } from "./pdf-editor-layout";

export interface PdfEditorProps {
  onExport: (objects: import("@/types/pdf-editor").EditorObject[]) => void;
  isExporting?: boolean;
  allowedTools?: import("@/types/pdf-editor").ToolMode[];
}

import { usePdfEditor } from "./pdf-editor-context";
import { ToolMode } from "@/types/pdf-editor";

// A wrapper to access the context from the layout and pass the objects to the caller
function PdfEditorExportWrapper({ onExport, isExporting, allowedTools }: PdfEditorProps) {
  const { objects } = usePdfEditor();

  return <PdfEditorLayout onExport={() => onExport(objects)} isExporting={isExporting} allowedTools={allowedTools} />;
}

export function PdfEditor({ onExport, isExporting, allowedTools }: PdfEditorProps) {
  return (
    <PdfEditorProvider>
      <PdfEditorExportWrapper onExport={onExport} isExporting={isExporting} allowedTools={allowedTools} />
    </PdfEditorProvider>
  );
}
