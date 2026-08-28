"use client";

import { useState, useEffect } from "react";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ToolUploadZone } from "@/components/tools/tool-upload-zone";
import { PdfWorkspaceProvider, usePdfWorkspace } from "@/components/pdf-workspace/pdf-workspace";
import { PdfPageThumbnail } from "@/components/pdf-workspace/pdf-page-thumbnail";
import { FormFieldData, getFormFields, fillForm } from "@/lib/pdf/fill-form";
import { sanitizeFileName } from "@/lib/utils/file-name";
import { ResultCard } from "@/components/tools/result-card";
import { RelatedTools } from "@/components/tools/related-tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

function FillWorkspace({ file, onExport }: { file: File, onExport: (blob: Blob) => void }) {
  const { pages, status, pdfDocument } = usePdfWorkspace();
  const [fields, setFields] = useState<FormFieldData[]>([]);
  const [formData, setFormData] = useState<Record<string, string | boolean | string[]>>({});
  const [flatten, setFlatten] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    getFormFields(file).then((f) => setFields(f)).catch(console.error);
  }, [file]);

  const handleChange = (name: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const pdfBytes = await fillForm(file, formData, flatten);
      onExport(new Blob([pdfBytes as any], { type: "application/pdf" }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to export filled form.");
    } finally {
      setIsExporting(false);
    }
  };

  if (status === "loading") {
    return <div className="p-8 text-center animate-pulse">Loading PDF...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] min-h-[600px] border rounded-xl overflow-hidden bg-slate-50">
      <div className="flex-1 overflow-auto p-8 flex flex-col items-center gap-8 bg-slate-200/50">
        {pages.map((page) => (
          <div key={page.originalPageIndex} className="shadow-md bg-white">
            <PdfPageThumbnail
              pdfDocument={pdfDocument!}
              pageNumber={page.pageNumber}
              rotation={page.rotation}
              scale={1.0}
            />
          </div>
        ))}
      </div>

      <div className="w-full md:w-96 bg-white border-l flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Form Fields</h3>
          <p className="text-sm text-slate-500">
            {fields.length === 0 ? "No interactive fields found." : `${fields.length} fields detected.`}
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <Label className="text-xs text-slate-500 truncate" title={field.name}>
                {field.name}
              </Label>
              {field.type === "text" && (
                <Input 
                  value={(formData[field.name] as string) ?? (field.value as string) ?? ""} 
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}
              {field.type === "checkbox" && (
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={(formData[field.name] as boolean) ?? (field.value as boolean) ?? false}
                    onCheckedChange={(c) => handleChange(field.name, c === true)}
                  />
                  <span className="text-sm text-slate-700">Check</span>
                </div>
              )}
              {field.type === "dropdown" && field.options && (
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={(formData[field.name] as string) ?? (field.value as string) ?? ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                >
                  <option value="">Select option...</option>
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
              {(field.type === "radio" || field.type === "optionList") && (
                <Input 
                  placeholder={`Value for ${field.type}`}
                  value={(formData[field.name] as string) ?? (field.value as string) ?? ""} 
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}
          {fields.length === 0 && (
            <div className="p-4 bg-slate-50 border rounded-lg text-center text-sm text-slate-600">
              This document does not contain any AcroForm fields. You can still add text using the PDF Editor.
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-slate-50 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="flatten" className="text-sm font-medium">Flatten Form</Label>
            <Switch id="flatten" checked={flatten} onCheckedChange={setFlatten} />
          </div>
          <p className="text-xs text-slate-500 leading-tight">
            Flattening prevents further editing by baking the values into the page.
          </p>
          <Button className="w-full" onClick={handleExport} disabled={isExporting || fields.length === 0}>
            {isExporting ? "Saving..." : "Save Filled Form"}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { TOOLS } from "@/config/tools";

export default function FillPdfPage() {
  const tool = TOOLS.find(t => t.id === "fill-pdf")!;
  const [file, setFile] = useState<File | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  
  const reset = () => {
    setFile(null);
    setResultBlob(null);
  };

  return (
    <div className="container max-w-6xl py-8">
      <ToolPageHeader tool={tool} />

      <div className="mt-8">
        {!file ? (
          <ToolUploadZone
            onFilesSelect={(files) => setFile(files[0])}
            accept={{ "application/pdf": [".pdf"] }}
            maxSizeMB={50}
          />
        ) : !resultBlob ? (
          <PdfWorkspaceProvider initialFile={file}>
            <FillWorkspace file={file} onExport={setResultBlob} />
          </PdfWorkspaceProvider>
        ) : (
          <ResultCard
            blob={resultBlob}
            filename={`${sanitizeFileName(file.name)}-filled.pdf`}
            onReset={reset}
          />
        )}
      </div>

      <RelatedTools currentToolId="fill-pdf" />
    </div>
  );
}
