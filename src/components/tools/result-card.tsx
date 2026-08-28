import { CheckCircle2, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultCardProps {
  title?: string;
  description?: string;
  onDownload: () => void;
  onReset: () => void;
  downloadText?: string;
}

export function ResultCard({
  title = "Processing Complete",
  description = "Your files are ready to download.",
  onDownload,
  onReset,
  downloadText = "Download Files",
}: ResultCardProps) {
  return (
    <div className="flex flex-col items-center space-y-6 py-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm ring-8 ring-green-50">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="flex w-full max-w-sm flex-col gap-3 pt-4">
        <Button size="lg" className="h-14 w-full rounded-xl text-lg font-semibold" onClick={onDownload}>
          <Download className="mr-2 h-5 w-5" />
          {downloadText}
        </Button>
        <Button variant="outline" size="lg" className="h-14 w-full rounded-xl font-medium" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>
    </div>
  );
}
