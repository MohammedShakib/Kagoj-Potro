import { compress, CompressionPreset, CompressionResult, ProgressEvent } from '@quicktoolsone/pdf-compress';

export type CompressionLevel = 'high-quality' | 'recommended' | 'strong';

const LEVEL_TO_PRESET: Record<CompressionLevel, CompressionPreset> = {
  'high-quality': 'lossless',
  'recommended': 'balanced',
  'strong': 'max'
};

export interface CompressPdfOptions {
  level: CompressionLevel;
  onProgress?: (phase: string, progress: number, message?: string) => void;
}

export async function compressPdf(file: File, options: CompressPdfOptions): Promise<CompressionResult> {
  const arrayBuffer = await file.arrayBuffer();
  const preset = LEVEL_TO_PRESET[options.level];
  
  const result = await compress(arrayBuffer, {
    preset,
    onProgress: (event: ProgressEvent) => {
      if (options.onProgress) {
        // Map library events to a readable string for the UI
        let phaseText = "Processing...";
        switch(event.phase) {
          case 'chunking': phaseText = "Analyzing pages..."; break;
          case 'compressing': phaseText = "Optimizing images..."; break;
          case 'merging': phaseText = "Rebuilding PDF..."; break;
          case 'error-recovery': phaseText = "Recovering from error..."; break;
        }
        
        let message = event.message;
        if (!message && event.currentChunk && event.totalChunks) {
          message = `Part ${event.currentChunk} of ${event.totalChunks}`;
        }
        
        options.onProgress(phaseText, event.progress, message);
      }
    }
  });
  
  return result;
}
