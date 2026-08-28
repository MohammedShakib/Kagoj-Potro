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
  title = "Drop your files here",
  subtitle = "or click to choose files",
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
    const className = cn("h-12 w-12 transition-colors", isDragActive ? "text-primary" : "text-primary/70");
    if (icon === "pdf") return <File className={className} />;
    if (icon === "image") return <ImageIcon className={className} />;
    return <UploadCloud className={className} />;
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all",
        isDragActive
          ? "border-primary bg-primary/10 shadow-[0_0_40px_-10px_rgba(37,99,235,0.3)] scale-[1.02]"
          : "border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50"
      )}
    >
      <input {...getInputProps()} />
      <div className="mb-6 rounded-full bg-white p-4 shadow-sm ring-1 ring-black/5">
        {renderIcon()}
      </div>
      <h3 className="mb-1 text-2xl font-bold tracking-tight text-foreground">{title}</h3>
      <p className="mb-6 text-sm text-muted-foreground">{subtitle}</p>
      
      <div className="mb-8 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-105 active:scale-95">
        {buttonText}
      </div>

      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {helperText && (
          <>
            <span className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-primary/60"></div>
              {helperText}
            </span>
            <span className="text-border">•</span>
          </>
        )}
        <span>Up to {maxSizeMB} MB</span>
      </div>
    </div>
  );
}
