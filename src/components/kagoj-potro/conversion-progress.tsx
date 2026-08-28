import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { ConversionStatus } from "@/types/converter";

interface ConversionProgressProps {
  status: ConversionStatus;
  currentPage: number;
  totalPages: number;
}

export function ConversionProgress({ status, currentPage, totalPages }: ConversionProgressProps) {
  if (status !== "converting" && status !== "zipping") return null;

  const progress = Math.round((currentPage / totalPages) * 100) || 0;

  return (
    <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <h3 className="text-lg font-semibold">
          {status === "zipping" ? "Preparing download..." : "Converting PDF"}
        </h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Page {currentPage} of {totalPages}</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {status === "converting" && (
        <p className="text-xs text-muted-foreground animate-pulse">
          Converting page {currentPage} of {totalPages}...
        </p>
      )}
    </div>
  );
}
