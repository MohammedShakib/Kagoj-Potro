import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface ProcessingStateProps {
  status: string;
  title?: string;
  progress?: number; 
}

export function ProcessingState({
  status,
  title = "Processing...",
  progress,
}: ProcessingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 text-primary">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
      
      <div className="w-full max-w-sm space-y-4 text-center">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground capitalize">{status.replace(/-/g, " ")}</p>
        
        {progress !== undefined && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2 w-full" />
            <p className="text-xs font-medium text-muted-foreground text-right">{Math.round(progress)}%</p>
          </div>
        )}
      </div>
    </div>
  );
}
