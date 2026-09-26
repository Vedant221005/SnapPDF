"use client";

import { useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { FileUp, ImagePlus, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFiles: (files: File[]) => void;
  error?: string;
}

export function UploadZone({ onFiles, error }: UploadZoneProps) {
  const onDrop = useCallback((accepted: File[], rejected: FileRejection[]) => {
    if (rejected.length) return;
    onFiles(accepted);
  }, [onFiles]);
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/png": [".png"] },
    multiple: true,
    noClick: true,
  });

  return (
    <div {...getRootProps()} className={cn("group relative flex min-h-[255px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-primary/25 bg-primary/[0.03] p-8 text-center transition-all hover:border-primary/50 hover:bg-primary/[0.06]", isDragActive && "border-primary bg-primary/[0.1]")}>
      <input {...getInputProps()} />
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-transform group-hover:scale-125" />
      <div className={cn("relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:-translate-y-1", isDragActive && "scale-110")}>
        {isDragActive ? <ImagePlus className="h-7 w-7" /> : <FileUp className="h-7 w-7" />}
      </div>
      <p className="relative text-base font-semibold">{isDragActive ? "Drop your images here" : "Drop PNG images here"}</p>
      <p className="relative mt-1 text-sm text-muted-foreground">or choose files from your device</p>
      <button type="button" onClick={open} className="relative mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">Browse files</button>
      <div className="relative mt-5 flex items-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Your images never leave your device</div>
      {error && <p className="relative mt-3 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
