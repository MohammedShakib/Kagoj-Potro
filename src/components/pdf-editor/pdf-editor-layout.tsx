"use client";

import { usePdfWorkspace } from "@/components/pdf-workspace/pdf-workspace";
import { usePdfEditor } from "./pdf-editor-context";
import { PdfEditorPage } from "./pdf-editor-page";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/signature/signature-pad";
import { 
  MousePointer2, 
  Type, 
  Image as ImageIcon, 
  PenTool, 
  Highlighter, 
  Square,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Download,
  Crop
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolMode } from "@/types/pdf-editor";

interface PdfEditorLayoutProps {
  onExport: () => void;
  isExporting?: boolean;
  allowedTools?: ToolMode[];
}

export function PdfEditorLayout({ onExport, isExporting, allowedTools }: PdfEditorLayoutProps) {
  const { pages, status } = usePdfWorkspace();
  const { toolMode, setToolMode, zoom, setZoom, undo, redo, canUndo, canRedo, selectedObjectId, objects, addObject } = usePdfEditor();

  if (status === "loading") {
    return <div className="p-8 text-center animate-pulse">Loading PDF...</div>;
  }

  const allTools: { id: ToolMode; icon: React.ReactNode; label: string }[] = [
    { id: "select", icon: <MousePointer2 className="w-5 h-5" />, label: "Select" },
    { id: "text", icon: <Type className="w-5 h-5" />, label: "Add Text" },
    { id: "image", icon: <ImageIcon className="w-5 h-5" />, label: "Add Image" },
    { id: "signature", icon: <PenTool className="w-5 h-5" />, label: "Signature" },
    { id: "highlight", icon: <Highlighter className="w-5 h-5" />, label: "Highlight" },
    { id: "draw", icon: <PenTool className="w-5 h-5" />, label: "Draw" },
    { id: "shape", icon: <Square className="w-5 h-5" />, label: "Shape" },
    { id: "crop", icon: <Crop className="w-5 h-5" />, label: "Crop" },
  ];

  const toolButtons = allowedTools 
    ? allTools.filter(t => allowedTools.includes(t.id) || t.id === "select")
    : allTools.filter(t => t.id !== "crop"); // default editor hides crop

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[600px] border rounded-xl overflow-hidden bg-slate-50">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-lg border">
          {toolButtons.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setToolMode(tb.id)}
              className={cn(
                "p-2 rounded-md transition-colors flex items-center justify-center relative group",
                toolMode === tb.id ? "bg-white shadow-sm text-blue-600" : "text-slate-600 hover:bg-slate-200/50"
              )}
              title={tb.label}
            >
              {tb.icon}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border-r pr-2 mr-2">
            <button 
              onClick={undo} 
              disabled={!canUndo}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button 
              onClick={redo} 
              disabled={!canRedo}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 border">
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
              className="p-1.5 hover:bg-white rounded-md shadow-sm transition-colors text-slate-700"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium w-12 text-center text-slate-700">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
              className="p-1.5 hover:bg-white rounded-md shadow-sm transition-colors text-slate-700"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <Button onClick={onExport} disabled={isExporting} className="ml-4 gap-2">
            <Download className="w-4 h-4" />
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Workspace Workspace */}
        <div className="flex-1 overflow-auto bg-slate-100/50 p-8 flex flex-col items-center gap-8 relative">
          {pages.map((page) => (
            <PdfEditorPage
              key={page.originalPageIndex}
              pageIndex={page.originalPageIndex}
            />
          ))}
        </div>

        {/* Properties Sidebar (Optional) */}
        {selectedObjectId && (
          <div className="w-72 bg-white border-l p-4 overflow-y-auto">
            <h3 className="font-semibold text-sm mb-4">Properties</h3>
            <div className="text-sm text-slate-500">
              Editing object: {selectedObjectId}
              {/* Properties controls go here */}
            </div>
          </div>
        )}
      </div>

      {/* Signature Modal */}
      {toolMode === "signature" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <SignaturePad 
            onSave={(blob: Blob) => {
              const url = URL.createObjectURL(blob);
              // We don't have the exact page coordinates here easily, so we drop it at the top-left of the first available page
              const pageIndex = pages.length > 0 ? pages[0].originalPageIndex : 0;
              
              addObject({
                id: Math.random().toString(36).substring(7),
                type: "signature",
                pageIndex,
                x: 50,
                y: 50,
                width: 200,
                height: 100, // Roughly 2:1 aspect ratio
                rotation: 0,
                opacity: 1,
                selected: true,
                src: url,
                file: blob,
                aspectRatio: 2
              });
            }}
            onCancel={() => setToolMode("select")}
          />
        </div>
      )}
    </div>
  );
}
