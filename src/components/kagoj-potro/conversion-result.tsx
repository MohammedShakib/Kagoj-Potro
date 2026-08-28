import { CheckCircle2, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConversionResultProps {
  numPages: number;
  onDownload: () => void;
  onReset: () => void;
}

export function ConversionResult({ numPages, onDownload, onReset }: ConversionResultProps) {
  const isSinglePage = numPages === 1;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 rounded-xl border bg-card p-10 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold tracking-tight">Conversion complete!</h3>
        <p className="text-muted-foreground">
          {numPages} {numPages === 1 ? "page" : "pages"} converted successfully.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" className="gap-2 sm:w-auto w-full" onClick={onDownload}>
          <Download className="h-5 w-5" />
          {isSinglePage ? "Download JPG" : "Download JPGs (.ZIP)"}
        </Button>
        <Button size="lg" variant="outline" className="gap-2 sm:w-auto w-full" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          Convert another PDF
        </Button>
      </div>
    </div>
  );
}
