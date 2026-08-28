"use client";

import { ReactNode } from "react";
import { CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageSelectionToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  children?: ReactNode; // Custom actions like Delete, Rotate
  className?: string;
}

export function PageSelectionToolbar({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  children,
  className,
}: PageSelectionToolbarProps) {
  const allSelected = selectedCount === totalCount && totalCount > 0;
  const someSelected = selectedCount > 0 && selectedCount < totalCount;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={allSelected ? onClearSelection : onSelectAll}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
        >
          {allSelected ? (
            <CheckSquare className="h-5 w-5 text-blue-600" />
          ) : someSelected ? (
            <div className="flex h-5 w-5 items-center justify-center rounded-[4px] border-2 border-blue-600 bg-blue-600">
              <div className="h-0.5 w-2.5 bg-white" />
            </div>
          ) : (
            <Square className="h-5 w-5 text-slate-400" />
          )}
          <span>
            {selectedCount > 0 ? `${selectedCount} selected` : "Select All"}
          </span>
        </button>
      </div>

      {children && (
        <div className="flex flex-wrap items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
