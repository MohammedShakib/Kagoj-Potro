"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PdfPageCardProps {
  pageNumber: number;
  selected: boolean;
  deleted?: boolean;
  onClick?: () => void;
  children: ReactNode; // Typically the PdfPageThumbnail
  actions?: ReactNode; // Tool-specific actions like rotate, delete icons on hover
  className?: string;
  badge?: string; // Optional badge like "1 of 10"
}

export function PdfPageCard({
  pageNumber,
  selected,
  deleted,
  onClick,
  children,
  actions,
  className,
  badge,
}: PdfPageCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-white p-2 transition-all duration-200",
        selected
          ? "border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.1)]"
          : "border-slate-200 hover:border-blue-300 hover:shadow-md",
        deleted && "opacity-50 grayscale",
        className
      )}
    >
      <div className="relative mb-2 aspect-[1/1.414] w-full overflow-hidden rounded-lg bg-slate-50">
        {children}
        
        {/* Selection Indicator */}
        <div
          className={cn(
            "absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
            selected
              ? "border-blue-500 bg-blue-500 text-white"
              : "border-slate-300 bg-white/80 text-transparent group-hover:border-blue-400 group-hover:bg-white"
          )}
        >
          <Check className="h-3 w-3" strokeWidth={3} />
        </div>

        {/* Action Overlay */}
        {actions && (
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-1 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {actions}
          </div>
        )}

        {/* Deleted Overlay */}
        {deleted && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-red-500/10">
            <div className="rounded-md bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
              DELETED
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-medium text-slate-700">Page {pageNumber}</span>
        {badge && <span className="text-[10px] font-semibold text-slate-400">{badge}</span>}
      </div>
    </div>
  );
}
