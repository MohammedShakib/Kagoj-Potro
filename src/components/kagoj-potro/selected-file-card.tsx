import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectedFileCardProps {
  file: File;
  numPages: number | null;
  onRemove: () => void;
  disabled?: boolean;
}

export function SelectedFileCard({ file, numPages, onRemove, disabled }: SelectedFileCardProps) {
  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

  return (
    <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-none mb-1.5" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {fileSizeMB} MB • {numPages ? `${numPages} pages` : "Loading..."}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={disabled}
        className="shrink-0 text-muted-foreground hover:text-destructive"
        title="Remove file"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Remove file</span>
      </Button>
    </div>
  );
}
