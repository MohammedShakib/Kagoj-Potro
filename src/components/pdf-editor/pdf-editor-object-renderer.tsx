"use client";

import { useRef, MouseEvent as ReactMouseEvent, useEffect } from "react";
import { EditorObject } from "@/types/pdf-editor";
import { usePdfEditor } from "./pdf-editor-context";
import { cn } from "@/lib/utils";

interface PdfEditorObjectRendererProps {
  obj: EditorObject;
}

export function PdfEditorObjectRenderer({ obj }: PdfEditorObjectRendererProps) {
  const { updateObject, selectObject, toolMode } = usePdfEditor();
  const isSelected = obj.selected;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const startObjPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent page from handling the click
    selectObject(obj.id);

    if (toolMode === "select" || isSelected) {
      isDragging.current = true;
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      startObjPos.current = { x: obj.x, y: obj.y };
      document.body.style.cursor = "grabbing";
    }
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      
      updateObject(obj.id, {
        x: startObjPos.current.x + dx,
        y: startObjPos.current.y + dy,
      });
    };

    const handlePointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = "default";
      }
    };

    if (isSelected) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isSelected, obj.id, updateObject]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className={cn(
        "absolute",
        isSelected ? "cursor-grab active:cursor-grabbing ring-2 ring-blue-500" : "hover:ring-1 hover:ring-blue-300",
        toolMode === "select" ? "pointer-events-auto cursor-pointer" : "pointer-events-auto"
      )}
      style={{
        left: obj.x,
        top: obj.y,
        width: obj.width,
        height: obj.height,
        opacity: obj.opacity,
        transform: `rotate(${obj.rotation}deg)`,
        transformOrigin: "center center",
      }}
    >
      {/* Content based on type */}
      <div className="w-full h-full relative">
        {obj.type === "text" && (
          <div 
            style={{ 
              color: obj.color, 
              fontSize: obj.fontSize, 
              fontFamily: obj.fontFamily,
              fontWeight: obj.fontWeight,
              textAlign: obj.alignment
            }}
            className="w-full h-full flex items-center p-1 whitespace-pre-wrap leading-tight"
          >
            {obj.text}
          </div>
        )}

        {obj.type === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={obj.src} 
            alt="Editor image" 
            className="w-full h-full object-contain pointer-events-none" 
            draggable={false}
          />
        )}

        {obj.type === "signature" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={obj.src} 
            alt="Signature" 
            className="w-full h-full object-contain pointer-events-none" 
            draggable={false}
          />
        )}
      </div>

      {/* Resize Handles (Simplified for now - bottom right corner) */}
      {isSelected && (
        <div
          className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-se-resize"
          onPointerDown={(e) => {
            e.stopPropagation();
            // TODO: Implement resizing logic
            console.log("Resize initiated");
          }}
        />
      )}
    </div>
  );
}
