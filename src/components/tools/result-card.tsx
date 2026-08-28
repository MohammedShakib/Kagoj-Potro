import { CheckCircle2, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultCardProps {
  title?: string;
  description?: string;
  onDownload?: () => void;
  onReset: () => void;
  downloadText?: string;
  blob?: Blob;
  filename?: string;
}

export function ResultCard({
  title = "Processing Complete",
  description = "Your files are ready to download.",
  onDownload,
  onReset,
  downloadText = "Download Files",
  blob,
  filename = "download",
}: ResultCardProps) {
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    if (blob && filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-5 py-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm ring-4 ring-green-50">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      
      <div className="space-y-1.5">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="flex w-full max-w-sm flex-col gap-3 pt-2">
        <Button size="lg" className="h-12 w-full rounded-xl text-base font-semibold" onClick={handleDownload}>
          <Download className="mr-2 h-5 w-5" />
          {downloadText}
        </Button>
        <Button variant="outline" size="lg" className="h-12 w-full rounded-xl font-medium" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>
    </div>
  );
}
