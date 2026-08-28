"use client";

import { useRef, MouseEvent } from "react";
import { PdfPageThumbnail } from "@/components/pdf-workspace/pdf-page-thumbnail";
import { usePdfWorkspace } from "@/components/pdf-workspace/pdf-workspace";
import { usePdfEditor } from "./pdf-editor-context";
import { cn } from "@/lib/utils";
import { screenToPdfCoordinates, ViewportInfo } from "@/lib/editor/coordinate-system";
import { EditorObject } from "@/types/pdf-editor";

// We'll create these next
// import { PdfEditorObject } from "./pdf-editor-object";
// import { DrawingLayer } from "./drawing-layer";

import { PdfEditorObjectRenderer } from "./pdf-editor-object-renderer";

interface PdfEditorPageProps {
  pageIndex: number;
  className?: string;
}

export function PdfEditorPage({ pageIndex, className }: PdfEditorPageProps) {
  const { pdfDocument, pages } = usePdfWorkspace();
  const { toolMode, zoom, objects, addObject, selectObject } = usePdfEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const page = pages.find((p) => p.originalPageIndex === pageIndex);

  if (!page || !pdfDocument) return null;

  const pageObjects = objects.filter((o) => o.pageIndex === pageIndex);

  const handlePointerDown = async (e: MouseEvent<HTMLDivElement>) => {
    if (toolMode === "select") {
      selectObject(null);
      return;
    }

    if (toolMode === "text") {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      const newId = Math.random().toString(36).substring(7);
      
      addObject({
        id: newId,
        type: "text",
        pageIndex,
        x: screenX, // Screen coordinates temporarily
        y: screenY,
        width: 150,
        height: 40,
        rotation: 0,
        opacity: 1,
        selected: true,
        text: "New Text",
        fontSize: 16,
        fontFamily: "Helvetica",
        color: "#000000",
        fontWeight: "normal",
        alignment: "left"
      });
    }
  };

  return (
    <div 
      className={cn("relative shadow-md bg-white select-none shrink-0", className)}
      style={{ touchAction: toolMode === "draw" || toolMode === "highlight" ? "none" : "auto" }}
    >
      <div 
        ref={containerRef}
        className="relative w-full h-full"
        onPointerDown={handlePointerDown}
      >
        <PdfPageThumbnail
          pdfDocument={pdfDocument}
          pageNumber={page.pageNumber}
          rotation={page.rotation}
          scale={zoom}
          className="pointer-events-none"
        />
        
        {/* Render overlay objects here */}
        <div className="absolute inset-0 pointer-events-none">
          {pageObjects.map((obj) => (
            <PdfEditorObjectRenderer key={obj.id} obj={obj} />
          ))}
        </div>
      </div>
    </div>
  );
}
