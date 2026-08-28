"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from "pdfjs-dist";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PdfPageThumbnailProps {
  pdfDocument: PDFDocumentProxy | null;
  pageNumber: number;
  rotation?: number;
  scale?: number;
  className?: string;
  onLoad?: () => void;
}

export function PdfPageThumbnail({
  pdfDocument,
  pageNumber,
  rotation = 0,
  scale = 0.4,
  className,
  onLoad,
}: PdfPageThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const pageProxyRef = useRef<PDFPageProxy | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function renderPage() {
      if (!pdfDocument || !canvasRef.current || isRendering) {
        return;
      }

      setIsRendering(true);
      setHasRendered(false);

      try {
        const page = await pdfDocument.getPage(pageNumber);
        if (!isMounted) {
          page.cleanup();
          return;
        }

        pageProxyRef.current = page;
        const viewport = page.getViewport({ scale, rotation });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas 2D context not available");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;

        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise;

        if (isMounted) {
          setHasRendered(true);
          onLoad?.();
        }
      } catch (error: unknown) {
        if ((error as Error)?.name !== "RenderingCancelledException" && isMounted) {
          console.error(`Error rendering thumbnail for page ${pageNumber}:`, error);
        }
      } finally {
        if (isMounted) {
          setIsRendering(false);
        }
      }
    }

    renderPage();

    return () => {
      isMounted = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
      if (pageProxyRef.current) {
        pageProxyRef.current.cleanup();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDocument, pageNumber, rotation, scale, onLoad]);

  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden bg-white", className)}>
      {!hasRendered && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50">
          <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={cn(
          "max-h-full max-w-full object-contain transition-opacity duration-300 shadow-[0_2px_8px_rgba(15,23,42,0.06)]",
          hasRendered ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
