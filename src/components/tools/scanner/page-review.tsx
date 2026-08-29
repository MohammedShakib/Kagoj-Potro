"use client";

import { ScanFilter } from "@/types/scanner";
import { Button } from "@/components/ui/button";
import { RefreshCcw, RotateCw, Trash2 } from "lucide-react";

interface PageReviewProps {
  previewUrl: string;
  activeFilter: ScanFilter;
  onFilterChange: (filter: ScanFilter) => void;
  onRotate: () => void;
  onRetake: () => void;
  onDelete: () => void;
  onCrop: () => void;
  onDone: () => void;
}

const FILTERS: { id: ScanFilter; label: string }[] = [
  { id: "original", label: "Original" },
  { id: "document", label: "Document" },
  { id: "grayscale", label: "Grayscale" },
  { id: "bw", label: "B & W" },
  { id: "enhanced", label: "Enhanced" },
];

export function PageReview({
  previewUrl,
  activeFilter,
  onFilterChange,
  onRotate,
  onRetake,
  onDelete,
  onCrop,
  onDone
}: PageReviewProps) {
  return (
    <div className="flex h-full flex-col bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-950">
        <button onClick={onRetake} className="text-sm text-slate-400 hover:text-white">
          <RefreshCcw className="mr-1 inline h-4 w-4" />
          Retake
        </button>
        <div className="font-semibold tracking-wide">Review Page</div>
        <button onClick={onDone} className="text-sm font-semibold text-blue-400 hover:text-blue-300">
          Done
        </button>
      </div>

      {/* Main Image */}
      <div className="flex flex-1 items-center justify-center overflow-hidden p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={previewUrl} 
          alt="Scanned Page"
          className="max-h-full max-w-full rounded-md shadow-2xl object-contain"
        />
      </div>

      {/* Controls */}
      <div className="bg-slate-950 pb-[env(safe-area-inset-bottom,16px)] pt-4">
        {/* Filter Strip */}
        <div className="mb-6 flex gap-2 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className={`flex min-w-[80px] flex-col items-center gap-2 rounded-xl border p-2 transition-colors ${
                activeFilter === f.id
                  ? "border-blue-500 bg-blue-500/10 text-blue-400"
                  : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"
              }`}
            >
              <img 
                src={previewUrl}
                alt=""
                className={`h-10 w-8 rounded-sm object-cover ${
                  f.id === 'bw' ? 'grayscale contrast-[2] brightness-110' :
                  f.id === 'grayscale' ? 'grayscale' :
                  f.id === 'enhanced' ? 'saturate-150 contrast-125' :
                  f.id === 'document' ? 'contrast-125 brightness-110' :
                  ''
                }`} 
              />
              <span className="text-[10px] font-medium uppercase tracking-wider">{f.label}</span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-around px-4">
          <Button variant="ghost" onClick={onCrop} className="flex-col gap-1 text-slate-400 hover:text-white h-auto py-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>
            <span className="text-xs">Crop</span>
          </Button>

          <Button variant="ghost" onClick={onRotate} className="flex-col gap-1 text-slate-400 hover:text-white h-auto py-2">
            <RotateCw className="h-5 w-5" />
            <span className="text-xs">Rotate</span>
          </Button>
          
          <Button variant="ghost" onClick={onDelete} className="flex-col gap-1 text-red-400 hover:text-red-300 hover:bg-red-950/50 h-auto py-2">
            <Trash2 className="h-5 w-5" />
            <span className="text-xs">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
