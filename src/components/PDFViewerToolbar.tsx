"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  zoom: number;
  totalPages: number;
  onZoomChange: (zoom: number) => void;
}

export function PDFViewerToolbar({ zoom, totalPages, onZoomChange }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-3 py-2.5">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Zoom out" disabled={zoom <= 0.5} onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}><Minus className="h-4 w-4" /></Button>
        <span className="min-w-14 text-center text-xs font-semibold tabular-nums">{Math.round(zoom * 100)}%</span>
        <Button variant="ghost" size="icon" aria-label="Zoom in" disabled={zoom >= 2} onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}><Plus className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" className="ml-1 gap-1.5 text-xs" onClick={() => onZoomChange(1)}><RotateCcw className="h-3.5 w-3.5" /> Reset</Button>
      </div>
      <span className="text-xs font-medium text-muted-foreground">Pages: {totalPages}</span>
    </div>
  );
}
