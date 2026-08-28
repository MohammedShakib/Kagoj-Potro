import { FileText, X, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectedFilesListProps {
  files: File[];
  onRemove: (index: number) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  disabled?: boolean;
}

export function SelectedFilesList({
  files,
  onRemove,
  onMoveUp,
  onMoveDown,
  disabled = false,
}: SelectedFilesListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
      {files.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          className="flex items-center justify-between gap-4 rounded-xl border bg-card p-3 shadow-sm transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 shrink-0">
            {onMoveUp && onMoveDown && (
              <div className="flex flex-col mr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  disabled={disabled || index === 0}
                  onClick={() => onMoveUp(index)}
                  title="Move up"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  disabled={disabled || index === files.length - 1}
                  onClick={() => onMoveDown(index)}
                  title="Move down"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive transition-colors"
              onClick={() => onRemove(index)}
              disabled={disabled}
              title="Remove file"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
