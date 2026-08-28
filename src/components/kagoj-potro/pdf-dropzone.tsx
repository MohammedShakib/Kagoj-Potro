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
      className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 bg-muted/20 hover:bg-muted/40"
      }`}
    >
      <input {...getInputProps()} />
      <UploadCloud
        className={`mb-4 h-12 w-12 ${
          isDragActive ? "text-primary" : "text-muted-foreground"
        }`}
      />
      <h3 className="mb-2 text-xl font-semibold">Drop your PDF here</h3>
      <p className="mb-4 text-sm text-muted-foreground">or click to choose a file</p>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
          PDF files only
        </span>
        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
          Up to {maxSizeMB} MB
        </span>
      </div>
    </div>
  );
}
