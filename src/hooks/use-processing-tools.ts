"use client";

import { useEffect, useRef, useState } from "react";
import { getProcessingTools } from "@/lib/processing-api";
import {
  normalizeProcessingError,
  type ProcessingApiError,
} from "@/lib/processing-errors";
import type { ProcessingTool } from "@/types/processing";

const SLOW_REQUEST_DELAY_MS = 4000;

interface UseProcessingToolsResult {
  error: ProcessingApiError | null;
  isLoading: boolean;
  isSlow: boolean;
  retry: () => void;
  tool: ProcessingTool | null;
  tools: ProcessingTool[];
}

export function useProcessingTools(toolId: string): UseProcessingToolsResult {
  const [tools, setTools] = useState<ProcessingTool[]>([]);
  const [error, setError] = useState<ProcessingApiError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlow, setIsSlow] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const slowTimerRef = useRef<number | null>(null);

  const clearSlowTimer = () => {
    if (slowTimerRef.current !== null) {
      window.clearTimeout(slowTimerRef.current);
      slowTimerRef.current = null;
    }
  };

  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    clearSlowTimer();

    slowTimerRef.current = window.setTimeout(() => {
      setIsSlow(true);
    }, SLOW_REQUEST_DELAY_MS);

    const controller = new AbortController();
    abortRef.current = controller;

    const run = async () => {
      try {
        const response = await getProcessingTools(controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setTools(response.tools);
        setError(null);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setTools([]);
        setError(normalizeProcessingError(error));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          setIsSlow(false);
        }

        clearSlowTimer();
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
      }
    };

    void run();

    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
      clearSlowTimer();
    };
  }, [reloadKey]);

  return {
    error,
    isLoading,
    isSlow,
    retry: () => {
      setIsLoading(true);
      setIsSlow(false);
      setError(null);
      setReloadKey((value) => value + 1);
    },
    tool: tools.find((candidate) => candidate.id === toolId) ?? null,
    tools,
  };
}
