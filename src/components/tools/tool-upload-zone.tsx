import { useDropzone, Accept, FileRejection } from "react-dropzone";
import { UploadCloud, File, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ToolUploadZoneProps {
  onFilesSelect: (files: File[]) => void;
  accept: Accept;
  maxSizeMB?: number;
  maxFiles?: number;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  helperText?: string;
  icon?: "pdf" | "image" | "default";
}

export function ToolUploadZone({
  onFilesSelect,
  accept,
  maxSizeMB = 100,
  maxFiles = 0,
  title = "Select your files",
  subtitle = "",
  buttonText = "Choose Files",
  helperText,
  icon = "default",
}: ToolUploadZoneProps) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((e) => {
          if (e.code === "file-too-large") {
            toast.error(`File ${file.name} is too large. Max size is ${maxSizeMB}MB.`);
          } else if (e.code === "file-invalid-type") {
            toast.error(`File ${file.name} has an invalid type.`);
          } else if (e.code === "too-many-files") {
            toast.error(`Too many files. Maximum allowed is ${maxFiles}.`);
          } else {
            toast.error(`Error with file ${file.name}: ${e.message}`);
          }
        });
      });
    }

    if (acceptedFiles.length > 0) {
      onFilesSelect(acceptedFiles);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
    maxSize: maxSizeBytes,
    maxFiles,
  });

  const renderIcon = () => {
    const className = cn("h-11 w-11 transition-colors", isDragActive ? "text-primary" : "text-primary/75");
    if (icon === "pdf") return <File className={className} />;
    if (icon === "image") return <ImageIcon className={className} />;
    return <UploadCloud className={className} />;
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed px-8 py-12 text-center transition-all duration-300 md:px-10 md:py-14",
        isDragActive
          ? "scale-[1.01] border-primary bg-blue-50/80 shadow-[0_0_40px_-10px_rgba(37,99,235,0.16)]"
          : "border-slate-200 bg-slate-50/70 hover:border-primary/40 hover:bg-blue-50/40",
      )}
    >
      <input {...getInputProps()} />
      <div className="mb-5 rounded-[1.35rem] bg-white p-5 text-primary shadow-sm ring-1 ring-slate-200/70">
        {renderIcon()}
      </div>
      <h3 className="mb-5 text-[1.7rem] font-bold tracking-tight text-slate-900">{title}</h3>
      {subtitle ? <p className="mb-5 text-sm font-medium text-slate-500">{subtitle}</p> : null}
      <div className="rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-primary/90">
        {buttonText}
      </div>
      {(helperText || maxSizeMB) ? (
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {[helperText, `Up to ${maxSizeMB} MB`].filter(Boolean).join(" . ")}
        </p>
      ) : null}
    </div>
  );
}
