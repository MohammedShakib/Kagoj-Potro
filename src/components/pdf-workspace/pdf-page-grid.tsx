"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PdfPageGridProps {
  children: ReactNode;
  className?: string;
}

export function PdfPageGrid({ children, className }: PdfPageGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
        className
      )}
    >
      {children}
    </div>
  );
}
