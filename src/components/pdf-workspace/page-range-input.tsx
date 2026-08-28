"use client";

import { useState } from "react";
import { parsePageRange } from "@/lib/pdf/page-range-parser";
import { cn } from "@/lib/utils";

interface PageRangeInputProps {
  totalPages: number;
  selectedPages: number[]; // Array of selected page numbers (1-indexed)
  onChange: (selectedPages: number[]) => void;
  className?: string;
}

export function PageRangeInput({
  totalPages,
  selectedPages,
  onChange,
  className,
}: PageRangeInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [prevSelectedPages, setPrevSelectedPages] = useState(selectedPages);

  // Sync external selection to input value when external selection changes
  if (prevSelectedPages !== selectedPages) {
    setPrevSelectedPages(selectedPages);
    
    let isSame = false;
    try {
      const parsed = parsePageRange(inputValue, totalPages);
      const parsedSorted = [...parsed].sort((a, b) => a - b);
      const selectedSorted = [...selectedPages].sort((a, b) => a - b);
      
      isSame =
        parsedSorted.length === selectedSorted.length &&
        parsedSorted.every((val, index) => val === selectedSorted[index]);
    } catch {
      isSame = false;
    }

    if (!isSame) {
      setInputValue(formatPageRange(selectedPages));
      setError(null);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (val.trim() === "") {
      setError(null);
      onChange([]);
      return;
    }

    try {
      const parsed = parsePageRange(val, totalPages);
      setError(null);
      onChange(parsed);
    } catch (err: unknown) {
      setError((err as Error).message || "Invalid page range");
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor="page-range" className="text-sm font-medium text-slate-700">
        Page Range
      </label>
      <input
        id="page-range"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="e.g. 1-3, 5, 8-10"
        className={cn(
          "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
            : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
        )}
      />
      {error ? (
        <span className="text-xs text-red-500">{error}</span>
      ) : (
        <span className="text-xs text-slate-500">
          Enter page numbers and/or ranges separated by commas.
        </span>
      )}
    </div>
  );
}

// Helper to format an array of numbers into a range string
function formatPageRange(pages: number[]): string {
  if (pages.length === 0) return "";
  
  const sorted = [...new Set(pages)].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let prev = start;

  for (let i = 1; i <= sorted.length; i++) {
    if (sorted[i] === prev + 1) {
      prev = sorted[i];
    } else {
      if (start === prev) {
        ranges.push(`${start}`);
      } else {
        ranges.push(`${start}-${prev}`);
      }
      start = sorted[i];
      prev = start;
    }
  }

  return ranges.join(", ");
}
