"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Camera as CameraIcon, Zap, ZapOff, Image as ImageIcon } from "lucide-react";

interface CameraViewProps {
  onCapture: (blob: Blob) => void;
  onCancel: () => void;
}

export function CameraView({ onCapture, onCancel }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera API not supported in this browser.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });

        if (!mounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera error:", err);
        if (mounted) {
          setError(
            err instanceof Error 
              ? err.message 
              : "Camera access was denied or unavailable."
          );
        }
      }
    }

    initCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleCaptureClick = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        onCapture(blob);
      } else {
        setError("Failed to capture image.");
      }
    }, "image/jpeg", 1.0);
  };

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-black p-4 text-white">
        <div className="mb-4 rounded-full bg-red-500/20 p-4 text-red-500">
          <CameraIcon className="h-8 w-8" />
        </div>
        <h3 className="mb-2 text-xl font-bold">Camera Unavailable</h3>
        <p className="mb-8 max-w-sm text-center text-slate-400">{error}</p>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={onCancel}>
            Go Back
          </Button>
          <label className="cursor-pointer">
            <Button type="button" className="pointer-events-none">
              <span>
                <ImageIcon className="mr-2 h-4 w-4 inline" />
                Choose Image
              </span>
            </Button>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  onCapture(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-4 pb-8 text-white z-10 absolute top-0 w-full left-0">
        <button 
          onClick={onCancel}
          className="rounded-full bg-black/30 p-2 backdrop-blur-sm transition-colors hover:bg-black/50"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="font-semibold tracking-wide">Scan Document</div>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Video Preview */}
      <div className="relative flex-1 overflow-hidden flex items-center justify-center">
        <video 
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          autoPlay
          muted
          onCanPlay={() => setIsReady(true)}
        />
        
        {/* Viewfinder overlay */}
        {isReady && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8">
            <div className="aspect-[3/4] w-full max-w-sm rounded-xl border-2 border-white/40 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
              {/* Corner markers */}
              <div className="absolute -left-1 -top-1 h-8 w-8 border-l-4 border-t-4 border-blue-500 rounded-tl-lg" />
              <div className="absolute -right-1 -top-1 h-8 w-8 border-r-4 border-t-4 border-blue-500 rounded-tr-lg" />
              <div className="absolute -left-1 -bottom-1 h-8 w-8 border-l-4 border-b-4 border-blue-500 rounded-bl-lg" />
              <div className="absolute -right-1 -bottom-1 h-8 w-8 border-r-4 border-b-4 border-blue-500 rounded-br-lg" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col items-center justify-center bg-black pb-[env(safe-area-inset-bottom)] pt-4 relative z-10">
        <div className="mb-4 text-sm font-medium text-white/80">
          Hold steady
        </div>
        <div className="flex w-full items-center justify-around px-8 pb-8">
          <label className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
            <ImageIcon className="h-5 w-5" />
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  onCapture(e.target.files[0]);
                }
              }}
            />
          </label>

          <button 
            onClick={handleCaptureClick}
            disabled={!isReady}
            className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-transparent transition-transform active:scale-95 disabled:opacity-50"
          >
            <div className="h-16 w-16 rounded-full bg-white transition-transform active:scale-90" />
          </button>

          {/* Spacer to balance the layout since flash isn't consistently supported yet */}
          <div className="h-12 w-12" />
        </div>
      </div>
    </div>
  );
}
