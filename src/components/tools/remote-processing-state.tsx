"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, XCircle } from "lucide-react";

interface RemoteProcessingStateProps {
  cancelDisabled?: boolean;
  message?: string | null;
  onCancel?: () => void;
  progress?: number | null;
  slowMessage?: string | null;
  stage?: string | null;
  status: string;
  title: string;
}

function formatLabel(value: string) {
  return value.replace(/_/g, " ");
}

export function RemoteProcessingState({
  cancelDisabled = false,
  message,
  onCancel,
  progress,
  slowMessage,
  stage,
  status,
  title,
}: RemoteProcessingStateProps) {
  const normalizedProgress = typeof progress === "number" ? Math.max(0, Math.min(progress, 100)) : undefined;

  return (
    <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
      <Loader2 className="mx-auto mb-6 h-12 w-12 animate-spin text-blue-600" />
      <h3 className="mb-2 text-xl font-bold text-slate-900">{title}</h3>
      <p className="mx-auto max-w-xl text-slate-500">
        {message || "Your document is being processed by the Kagoj Processing Engine."}
      </p>

      <div className="mt-6 space-y-3">
        <Progress value={normalizedProgress ?? 0} className="w-full" />
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <Badge variant="secondary" className="border-none bg-slate-100 text-slate-700">
            Status: {formatLabel(status)}
          </Badge>
          {typeof normalizedProgress === "number" ? (
            <Badge variant="secondary" className="border-none bg-blue-100 text-blue-700">
              {Math.round(normalizedProgress)}%
            </Badge>
          ) : null}
          {stage ? (
            <Badge variant="secondary" className="border-none bg-amber-100 text-amber-700">
              Stage: {formatLabel(stage)}
            </Badge>
          ) : null}
        </div>
      </div>

      {slowMessage ? (
        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {slowMessage}
        </p>
      ) : null}

      {onCancel ? (
        <Button
          variant="outline"
          className="mt-6"
          onClick={onCancel}
          disabled={cancelDisabled}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Cancel Job
        </Button>
      ) : null}
    </div>
  );
}
