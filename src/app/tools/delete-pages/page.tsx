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
import { PdfWorkspaceProvider, usePdfWorkspace } from "@/components/pdf-workspace/pdf-workspace";
import { PdfPageGrid } from "@/components/pdf-workspace/pdf-page-grid";
import { PdfPageCard } from "@/components/pdf-workspace/pdf-page-card";
import { PdfPageThumbnail } from "@/components/pdf-workspace/pdf-page-thumbnail";
import { PageSelectionToolbar } from "@/components/pdf-workspace/page-selection-toolbar";
import { deletePages } from "@/lib/pdf/delete-pages";
import { Trash2 } from "lucide-react";
import { RelatedTools } from "@/components/tools/related-tools";

export default function DeletePagesPage() {
  const tool = TOOLS.find((t) => t.id === "delete-pages")!;
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
          <DeleteWorkspace onReset={() => setFile(null)} />
        </PdfWorkspaceProvider>
      )}

      <RelatedTools currentToolId={tool.id} />
    </div>
  );
}

function DeleteWorkspace({ onReset }: { onReset: () => void }) {
  const {
    file,
    pdfDocument,
    status: workspaceStatus,
    pages,
    togglePageSelection,
    selectAll,
    clearSelection,
    selectedCount,
  } = usePdfWorkspace();

  const [status, setStatus] = useState<"idle" | "processing" | "complete" | "error">("idle");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const handleProcess = async () => {
    if (!file || selectedCount === 0) return;
    
    if (selectedCount === pages.length) {
      toast.error("A PDF must contain at least one page.");
      return;
    }

    setStatus("processing");

    try {
      const selectedIndices = pages.filter((p) => p.selected).map((p) => p.originalPageIndex);
      const resultBytes = await deletePages(file, selectedIndices);
      setPdfBlob(new Blob([resultBytes as unknown as BlobPart], { type: "application/pdf" }));
      setStatus("complete");
    } catch (error: unknown) {
      console.error(error);
      setStatus("error");
      toast.error((error as Error).message || "An error occurred while removing pages.");
    }
  };

  const handleDownload = () => {
    if (!pdfBlob || !file) return;
    try {
      const baseName = sanitizeFileName(file.name.replace(/\.pdf$/i, ""));
      saveAs(pdfBlob, `${baseName}-pages-removed.pdf`);
    } catch (error) {
      console.error(error);
      toast.error("Download failed. Please try again.");
    }
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
    return <ProcessingState status="processing" title="Removing Pages..." progress={0} />;
  }

  if (status === "complete") {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <ResultCard
          title="Pages Removed"
          description={`${selectedCount} page${selectedCount === 1 ? "" : "s"} deleted. The document now has ${pages.length - selectedCount} page${pages.length - selectedCount === 1 ? "" : "s"}.`}
          onDownload={handleDownload}
          onReset={onReset}
          downloadText="Download PDF"
        />
      </div>
    );
  }

  const allSelected = selectedCount === pages.length;

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/50 sm:mx-0 sm:px-0 sm:bg-transparent sm:backdrop-blur-none sm:border-0">
        <PageSelectionToolbar
          selectedCount={selectedCount}
          totalCount={pages.length}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
        >
          <div className="text-sm font-medium text-slate-600 px-2">
            Select pages to delete
          </div>
        </PageSelectionToolbar>
      </div>

      <PdfPageGrid>
        {pages.map((page) => (
          <PdfPageCard
            key={page.originalPageIndex}
            pageNumber={page.pageNumber}
            selected={page.selected}
            deleted={page.selected} // Reusing the visual deleted state to show what will be removed
            onClick={() => togglePageSelection(page.originalPageIndex)}
            className={page.selected ? "border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.1)]" : ""}
          >
            <PdfPageThumbnail
              pdfDocument={pdfDocument}
              pageNumber={page.pageNumber}
            />
          </PdfPageCard>
        ))}
      </PdfPageGrid>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <Button
          size="lg"
          className="h-14 rounded-full bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20 px-8 text-base font-semibold text-white"
          onClick={handleProcess}
          disabled={selectedCount === 0 || allSelected}
        >
          <Trash2 className="mr-2 h-5 w-5" />
          Delete Selected ({selectedCount})
        </Button>
        {allSelected && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-3 py-1.5 text-xs text-white shadow-md">
            A PDF must contain at least one page.
          </div>
        )}
      </div>
    </div>
  );
}
