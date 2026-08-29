"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Quadrilateral, Point } from "@/types/scanner";
import { Button } from "@/components/ui/button";
import { Maximize, RefreshCcw } from "lucide-react";

interface CropAdjusterProps {
  previewUrl: string;
  initialCorners?: Quadrilateral;
  onDone: (corners: Quadrilateral) => void;
  onRetake?: () => void;
}

export function CropAdjuster({ previewUrl, initialCorners, onDone, onRetake }: CropAdjusterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  
  const [corners, setCorners] = useState<Quadrilateral | null>(null);
  const [activeHandle, setActiveHandle] = useState<keyof Quadrilateral | null>(null);

  // Initialize corners to full image if none provided
  const initFullCorners = useCallback(() => {
    if (imageSize.width > 0 && imageSize.height > 0) {
      setCorners({
        topLeft: { x: 0, y: 0 },
        topRight: { x: imageSize.width, y: 0 },
        bottomRight: { x: imageSize.width, y: imageSize.height },
        bottomLeft: { x: 0, y: imageSize.height }
      });
    }
  }, [imageSize]);

  useEffect(() => {
    if (initialCorners) {
      setCorners(initialCorners);
    } else {
      initFullCorners();
    }
  }, [initialCorners, initFullCorners]);

  const updateDisplaySize = useCallback(() => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      setDisplaySize({ width: rect.width, height: rect.height });
    }
  }, []);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    updateDisplaySize();
  };

  useEffect(() => {
    window.addEventListener("resize", updateDisplaySize);
    return () => window.removeEventListener("resize", updateDisplaySize);
  }, [updateDisplaySize]);

  // Map from original image coordinates to display coordinates
  const toDisplay = useCallback((p: Point) => {
    if (imageSize.width === 0 || displaySize.width === 0) return { x: 0, y: 0 };
    return {
      x: (p.x / imageSize.width) * displaySize.width,
      y: (p.y / imageSize.height) * displaySize.height
    };
  }, [imageSize, displaySize]);

  // Map from display coordinates to original image coordinates
  const toImage = useCallback((p: Point) => {
    if (imageSize.width === 0 || displaySize.width === 0) return { x: 0, y: 0 };
    return {
      x: Math.max(0, Math.min(imageSize.width, (p.x / displaySize.width) * imageSize.width)),
      y: Math.max(0, Math.min(imageSize.height, (p.y / displaySize.height) * imageSize.height))
    };
  }, [imageSize, displaySize]);

  const handlePointerDown = (handle: keyof Quadrilateral) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveHandle(handle);
  };

  useEffect(() => {
    if (!activeHandle) return;

    const onPointerMove = (e: PointerEvent) => {
      e.preventDefault();
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setCorners(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [activeHandle]: toImage({ x, y })
        };
      });
    };

    const onPointerUp = () => {
      setActiveHandle(null);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [activeHandle, toImage]);

  if (!corners) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="h-full w-full animate-pulse rounded-lg bg-slate-200" />
        <img 
          ref={imgRef}
          src={previewUrl}
          className="hidden"
          onLoad={handleImageLoad}
          alt="Preview"
        />
      </div>
    );
  }

  const tl = toDisplay(corners.topLeft);
  const tr = toDisplay(corners.topRight);
  const br = toDisplay(corners.bottomRight);
  const bl = toDisplay(corners.bottomLeft);
  
  const polygonPoints = `${tl.x},${tl.y} ${tr.x},${tr.y} ${br.x},${br.y} ${bl.x},${bl.y}`;

  return (
    <div className="flex h-full flex-col bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-950">
        <button onClick={onRetake} className="text-sm text-slate-400 hover:text-white">
          Retake
        </button>
        <div className="font-semibold tracking-wide">Adjust Corners</div>
        <button onClick={() => onDone(corners)} className="text-sm font-semibold text-blue-400 hover:text-blue-300">
          Done
        </button>
      </div>

      {/* Main Area */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-6">
        <div 
          ref={containerRef}
          className="relative inline-block touch-none select-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            ref={imgRef}
            src={previewUrl}
            alt="Adjust Crop"
            className="pointer-events-none max-h-[70vh] max-w-full rounded-md shadow-2xl"
            onLoad={handleImageLoad}
          />
          
          <svg className="absolute inset-0 h-full w-full pointer-events-none">
            {/* Darken outside */}
            <defs>
              <mask id="cropMask">
                <rect width="100%" height="100%" fill="white" />
                <polygon points={polygonPoints} fill="black" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#cropMask)" />
            
            {/* Outline */}
            <polygon 
              points={polygonPoints} 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="2" 
            />
          </svg>

          {/* Handles */}
          {(Object.keys(corners) as Array<keyof Quadrilateral>).map((handleKey) => {
            const p = toDisplay(corners[handleKey]);
            return (
              <div 
                key={handleKey}
                onPointerDown={handlePointerDown(handleKey)}
                className={`absolute -ml-5 -mt-5 flex h-10 w-10 cursor-move items-center justify-center rounded-full bg-blue-500/10 active:bg-blue-500/30 touch-none ${
                  activeHandle === handleKey ? "scale-125 z-10" : ""
                }`}
                style={{ transform: `translate(${p.x}px, ${p.y}px)` }}
              >
                <div className="h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-md" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-around bg-slate-950 p-4 pb-[env(safe-area-inset-bottom,16px)]">
        <Button variant="ghost" className="text-slate-300 hover:text-white" onClick={initFullCorners}>
          <Maximize className="mr-2 h-4 w-4" />
          Full Image
        </Button>
        <Button variant="ghost" className="text-slate-300 hover:text-white" onClick={() => onRetake && onRetake()}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retake
        </Button>
      </div>
    </div>
  );
}
