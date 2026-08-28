"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { DocumentStatus, WorkspacePage } from "@/types/pdf-workspace";

interface PdfWorkspaceState {
  file: File | null;
  pdfDocument: PDFDocumentProxy | null;
  status: DocumentStatus;
  pages: WorkspacePage[];
  error: string | null;
  setFile: (file: File | null) => void;
  setPages: (pages: WorkspacePage[] | ((prev: WorkspacePage[]) => WorkspacePage[])) => void;
  updatePage: (originalPageIndex: number, updates: Partial<WorkspacePage>) => void;
  togglePageSelection: (originalPageIndex: number) => void;
  selectAll: () => void;
  clearSelection: () => void;
  selectedCount: number;
}

const PdfWorkspaceContext = createContext<PdfWorkspaceState | null>(null);

export function usePdfWorkspace() {
  const context = useContext(PdfWorkspaceContext);
  if (!context) {
    throw new Error("usePdfWorkspace must be used within a PdfWorkspaceProvider");
  }
  return context;
}

interface PdfWorkspaceProviderProps {
  children: ReactNode;
  initialFile?: File | null;
  onLoadSuccess?: (numPages: number) => void;
}

export function PdfWorkspaceProvider({ children, initialFile = null, onLoadSuccess }: PdfWorkspaceProviderProps) {
  const [file, setFile] = useState<File | null>(initialFile);
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [status, setStatus] = useState<DocumentStatus>("idle");
  const [pages, setPages] = useState<WorkspacePage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPdfDocument(null);
      setPages([]);
      setStatus("idle");
      setError(null);
      return;
    }

    let isMounted = true;
    let loadingTask: ReturnType<typeof import("pdfjs-dist").getDocument> | null = null;

    async function loadPdf() {
      setStatus("loading");
      setError(null);

      try {
        const { pdfjs } = await import("@/lib/pdf/pdf-worker");
        const arrayBuffer = await file!.arrayBuffer();
        
        loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        if (!isMounted) return;

        setPdfDocument(pdf);
        
        const initialPages: WorkspacePage[] = Array.from({ length: pdf.numPages }, (_, i) => ({
          originalPageIndex: i,
          pageNumber: i + 1,
          rotation: 0,
          selected: false,
        }));
        
        setPages(initialPages);
        setStatus("ready");
        onLoadSuccess?.(pdf.numPages);
      } catch (err: unknown) {
        if (isMounted) {
          console.error("Failed to load PDF:", err);
          setError((err as Error).message || "Failed to load PDF document.");
          setStatus("error");
        }
      }
    }

    loadPdf();

    return () => {
      isMounted = false;
      if (loadingTask) {
        loadingTask.destroy();
      }
    };
  }, [file, onLoadSuccess]);

  const updatePage = useCallback((originalPageIndex: number, updates: Partial<WorkspacePage>) => {
    setPages((prev) =>
      prev.map((p) => (p.originalPageIndex === originalPageIndex ? { ...p, ...updates } : p))
    );
  }, []);

  const togglePageSelection = useCallback((originalPageIndex: number) => {
    setPages((prev) =>
      prev.map((p) =>
        p.originalPageIndex === originalPageIndex ? { ...p, selected: !p.selected } : p
      )
    );
  }, []);

  const selectAll = useCallback(() => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: true })));
  }, []);

  const clearSelection = useCallback(() => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: false })));
  }, []);

  const selectedCount = pages.filter((p) => p.selected).length;

  return (
    <PdfWorkspaceContext.Provider
      value={{
        file,
        pdfDocument,
        status,
        pages,
        error,
        setFile,
        setPages,
        updatePage,
        togglePageSelection,
        selectAll,
        clearSelection,
        selectedCount,
      }}
    >
      {children}
    </PdfWorkspaceContext.Provider>
  );
}
