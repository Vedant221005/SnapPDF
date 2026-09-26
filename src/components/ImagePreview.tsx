"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, FileImage, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";
import type { ImageFile } from "@/types";

interface ImagePreviewProps {
  image: ImageFile;
  index: number;
  total: number;
  onRemove: () => void;
  onMove: (direction: "up" | "down") => void;
}

export function ImagePreview({ image, index, total, onRemove, onMove }: ImagePreviewProps) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border bg-background p-2.5 transition hover:border-primary/30">
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
        <Image src={image.previewUrl} alt={image.file.name} fill unoptimized className="object-cover" />
        <span className="absolute left-1 top-1 rounded bg-foreground/70 px-1.5 py-0.5 text-[10px] font-semibold text-background">{index + 1}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{image.file.name}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><FileImage className="h-3 w-3" />{formatBytes(image.file.size)}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Move image up" disabled={index === 0} onClick={() => onMove("up")}><ArrowUp className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" aria-label="Move image down" disabled={index === total - 1} onClick={() => onMove("down")}><ArrowDown className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" aria-label={`Remove ${image.file.name}`} onClick={onRemove} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
