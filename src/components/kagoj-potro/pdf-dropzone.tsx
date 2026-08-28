"use client";

import { useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";

interface PdfDropzoneProps {
  onFileSelect: (file: File) => void;
  maxSizeMB?: number;
}

export function PdfDropzone({ onFileSelect, maxSizeMB = 100 }: PdfDropzoneProps) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        if (rejection.errors[0].code === "file-too-large") {
          toast.error(`File is too large. Max size is ${maxSizeMB} MB. Very large PDFs may exceed available browser memory.`);
        } else if (rejection.errors[0].code === "file-invalid-type") {
          toast.error("Please upload a valid PDF document.");
        } else {
          toast.error(rejection.errors[0].message);
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
          toast.error("Please upload a valid PDF document.");
          return;
        }
        onFileSelect(file);
      }
    },
    [maxSizeMB, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: maxSizeBytes,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all ${
        isDragActive
          ? "border-primary bg-primary/10 shadow-[0_0_40px_-10px_rgba(37,99,235,0.3)] scale-[1.02]"
          : "border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50"
      }`}
    >
      <input {...getInputProps()} />
      <div className="mb-6 rounded-full bg-white p-4 shadow-sm ring-1 ring-black/5">
        <UploadCloud
          className={`h-12 w-12 transition-colors ${
            isDragActive ? "text-primary" : "text-primary/70"
          }`}
        />
      </div>
      <h3 className="mb-1 text-2xl font-bold tracking-tight text-foreground">Drop your PDF here</h3>
      <p className="mb-6 text-sm text-muted-foreground">or click to choose a file</p>
      
      <div className="mb-8 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-105 active:scale-95">
        Choose PDF
      </div>

      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-primary/60"></div>
          PDF only
        </span>
        <span className="text-border">•</span>
        <span>Up to {maxSizeMB} MB</span>
      </div>
    </div>
  );
}
