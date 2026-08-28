"use client";

import { useState } from "react";
import { TOOLS } from "@/config/tools";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ToolUploadZone } from "@/components/tools/tool-upload-zone";
import { ProcessingState } from "@/components/tools/processing-state";
import { ResultCard } from "@/components/tools/result-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import { sanitizeFileName } from "@/lib/utils/file-name";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Copy, RotateCw, Trash2 } from "lucide-react";
import { PdfWorkspaceProvider, usePdfWorkspace } from "@/components/pdf-workspace/pdf-workspace";
import { PdfPageGrid } from "@/components/pdf-workspace/pdf-page-grid";
import { PdfPageCard } from "@/components/pdf-workspace/pdf-page-card";
import { PdfPageThumbnail } from "@/components/pdf-workspace/pdf-page-thumbnail";
import { PageSelectionToolbar } from "@/components/pdf-workspace/page-selection-toolbar";
import { organizePdf } from "@/lib/pdf/organize-pdf";
import { RelatedTools } from "@/components/tools/related-tools";

export default function OrganizePdfPage() {
  const tool = TOOLS.find((t) => t.id === "organize-pdf")!;
  const [file, setFile] = useState<File | null>(null);

  const handleFilesSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  return (
    <div className="container mx-auto max-w-[1240px] px-4 py-10 sm:py-14">
      <ToolPageHeader tool={tool} />

      {!file ? (
        <div className="mx-auto w-full max-w-2xl">
          <Card className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
            <CardContent className="p-5 sm:p-7">
              <ToolUploadZone
                onFilesSelect={handleFilesSelect}
                accept={{ "application/pdf": [".pdf"] }}
                maxSizeMB={100}
                maxFiles={1}
                title="Select PDF"
                buttonText="Choose PDF"
                helperText="PDF"
                icon="pdf"
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <PdfWorkspaceProvider initialFile={file}>
          <OrganizeWorkspace onReset={() => setFile(null)} />
        </PdfWorkspaceProvider>
      )}

      <RelatedTools currentToolId={tool.id} />
    </div>
  );
}

function OrganizeWorkspace({ onReset }: { onReset: () => void }) {
  const {
    file,
    pdfDocument,
    status: workspaceStatus,
    pages,
    setPages,
    updatePage,
    togglePageSelection,
    selectAll,
    clearSelection,
    selectedCount,
  } = usePdfWorkspace();

  const [status, setStatus] = useState<"idle" | "processing" | "complete" | "error">("idle");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleProcess = async () => {
    if (!file || pages.length === 0) return;
    setStatus("processing");

    try {
      const activePages = pages.filter((p) => !p.deleted);
      if (activePages.length === 0) {
        toast.error("Cannot create an empty PDF. Please keep at least one page.");
        setStatus("idle");
        return;
      }

      const resultBytes = await organizePdf(file, activePages);
      setPdfBlob(new Blob([resultBytes as unknown as BlobPart], { type: "application/pdf" }));
      setStatus("complete");
    } catch (error) {
      console.error(error);
      setStatus("error");
      toast.error("An error occurred while organizing the PDF.");
    }
  };

  const handleDownload = () => {
    if (!pdfBlob || !file) return;
    try {
      const baseName = sanitizeFileName(file.name.replace(/\.pdf$/i, ""));
      saveAs(pdfBlob, `${baseName}-organized.pdf`);
    } catch (error) {
      console.error(error);
      toast.error("Download failed. Please try again.");
    }
  };

  // Actions
  const rotateSelected = (degrees: number = 90) => {
    setPages((prev) =>
      prev.map((p) => (p.selected && !p.deleted ? { ...p, rotation: (p.rotation + degrees) % 360 } : p))
    );
  };

  const deleteSelected = () => {
    const activeCount = pages.filter((p) => !p.deleted).length;
    const selectedActiveCount = pages.filter((p) => p.selected && !p.deleted).length;
    
    if (activeCount - selectedActiveCount <= 0) {
      toast.error("A PDF must contain at least one page.");
      return;
    }

    setPages((prev) =>
      prev.map((p) => (p.selected ? { ...p, deleted: true, selected: false } : p))
    );
  };

  const duplicateSelected = () => {
    setPages((prev) => {
      const next = [...prev];
      // Work backwards so inserting doesn't mess up indices
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].selected && !next[i].deleted) {
          const dup = { ...next[i], selected: false };
          next.splice(i + 1, 0, dup);
        }
      }
      return next;
    });
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    setPages((prev) => {
      const next = [...prev];
      const draggedItem = next[draggedIndex];
      next.splice(draggedIndex, 1);
      next.splice(index, 0, draggedItem);
      return next;
    });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Move individual (for mobile fallback)
  const moveLeft = (index: number) => {
    if (index === 0) return;
    setPages((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const moveRight = (index: number) => {
    if (index === pages.length - 1) return;
    setPages((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  if (workspaceStatus === "loading") {
    return <ProcessingState status="processing" title="Loading PDF pages..." progress={0} />;
  }
  
  if (workspaceStatus === "error") {
    return (
      <div className="mx-auto w-full max-w-2xl text-center py-12">
        <p className="text-destructive">Failed to read the PDF document.</p>
        <Button variant="outline" className="mt-4" onClick={onReset}>Start Over</Button>
      </div>
    );
  }

  if (status === "processing") {
    return <ProcessingState status="processing" title="Organizing PDF..." progress={0} />;
  }

  if (status === "complete") {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <ResultCard
          title="PDF Organized successfully"
          description="Your pages have been reordered, rotated, and processed."
          onDownload={handleDownload}
          onReset={onReset}
          downloadText="Download PDF"
        />
      </div>
    );
  }

  const activePageCount = pages.filter(p => !p.deleted).length;

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/50 sm:mx-0 sm:px-0 sm:bg-transparent sm:backdrop-blur-none sm:border-0">
        <PageSelectionToolbar
          selectedCount={selectedCount}
          totalCount={pages.length}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
        >
          <Button variant="outline" size="sm" onClick={() => rotateSelected(90)} disabled={selectedCount === 0}>
            <RotateCw className="mr-2 h-4 w-4" />
            Rotate
          </Button>
          <Button variant="outline" size="sm" onClick={duplicateSelected} disabled={selectedCount === 0}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          <Button variant="outline" size="sm" onClick={deleteSelected} disabled={selectedCount === 0} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </PageSelectionToolbar>
      </div>

      <PdfPageGrid>
        {pages.map((page, index) => (
          <div
            key={`${page.originalPageIndex}-${index}`}
            draggable={!page.deleted}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={draggedIndex === index ? "opacity-50 scale-95" : "transition-transform duration-200"}
          >
            <PdfPageCard
              pageNumber={page.pageNumber}
              selected={page.selected}
              deleted={page.deleted}
              onClick={() => togglePageSelection(page.originalPageIndex)}
              actions={!page.deleted && (
                <div className="flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveLeft(index); }}
                    className="p-1.5 rounded-full bg-white/20 text-white hover:bg-white/40 md:hidden"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); updatePage(page.originalPageIndex, { rotation: (page.rotation + 90) % 360 }); }}
                    className="p-1.5 rounded-full bg-white/20 text-white hover:bg-white/40"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); updatePage(page.originalPageIndex, { deleted: true }); }}
                    className="p-1.5 rounded-full bg-red-500/80 text-white hover:bg-red-600 md:hidden"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveRight(index); }}
                    className="p-1.5 rounded-full bg-white/20 text-white hover:bg-white/40 md:hidden"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            >
              <PdfPageThumbnail
                pdfDocument={pdfDocument}
                pageNumber={page.pageNumber}
                rotation={page.rotation}
              />
            </PdfPageCard>
          </div>
        ))}
      </PdfPageGrid>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <Button
          size="lg"
          className="h-14 rounded-full shadow-lg shadow-blue-500/20 px-8 text-base font-semibold"
          onClick={handleProcess}
          disabled={activePageCount === 0}
        >
          Save & Download ({activePageCount} pages)
        </Button>
      </div>
    </div>
  );
}
