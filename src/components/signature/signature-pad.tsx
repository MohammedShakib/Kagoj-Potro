"use client";

import { useRef, useState, useEffect, MouseEvent, TouchEvent } from "react";
import { Button } from "@/components/ui/button";

interface SignaturePadProps {
  onSave: (blob: Blob) => void;
  onCancel: () => void;
}

export function SignaturePad({ onSave, onCancel }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [activeTab, setActiveTab] = useState<"draw" | "type" | "upload">("draw");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set up canvas resolution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Make canvas physically larger for high DPI, but scaled down with CSS
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#000000";
    }
  }, [activeTab]);

  const getCoordinates = (e: MouseEvent | TouchEvent | globalThis.MouseEvent | globalThis.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: MouseEvent | TouchEvent) => {
    setIsDrawing(true);
    setIsEmpty(false);
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.closePath();
    }
  };

  const clearPad = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // The dimensions used here need to account for scale, or just clear the rect
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setIsEmpty(true);
    }
  };

  const handleSave = () => {
    if (activeTab === "draw" && !isEmpty && canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) onSave(blob);
      }, "image/png");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSave(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Create Signature</h3>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800">&times;</button>
      </div>

      <div className="flex border-b mb-4">
        <button 
          onClick={() => setActiveTab("draw")}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "draw" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Draw
        </button>
        <button 
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "upload" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Upload
        </button>
      </div>

      {activeTab === "draw" && (
        <>
          <div className="border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 relative mb-4">
            <canvas
              ref={canvasRef}
              className="w-full h-48 touch-none cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {isEmpty && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400">
                Sign here
              </div>
            )}
          </div>
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={clearPad} disabled={isEmpty}>Clear</Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>Cancel</Button>
              <Button onClick={handleSave} disabled={isEmpty}>Create Signature</Button>
            </div>
          </div>
        </>
      )}

      {activeTab === "upload" && (
        <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg mb-4 bg-slate-50">
          <p className="text-sm text-slate-500 mb-4">Upload a transparent PNG or JPG</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/png, image/jpeg, image/jpg" 
            onChange={handleFileUpload} 
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            Browse Files
          </Button>
        </div>
      )}
    </div>
  );
}
