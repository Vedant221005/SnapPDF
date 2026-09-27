"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { AlertCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PDFViewerToolbar } from "@/components/PDFViewerToolbar";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

interface Props {
  url: string;
  totalPages: number;
  onPageCount: (count: number) => void;
  onRetry: () => void;
}

export function PDFPreview({ url, totalPages, onPageCount, onRetry }: Props) {
  const [zoom, setZoom] = useState(1);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <Card className="flex min-h-48 flex-col items-center justify-center gap-3 p-8 text-center"><AlertCircle className="h-8 w-8 text-destructive" /><p className="font-semibold">Unable to load PDF preview.</p><button type="button" className="text-sm font-semibold text-primary hover:underline" onClick={() => { setFailed(false); onRetry(); }}>Retry preview</button></Card>;
  }

  return (
    <Card className="overflow-hidden">
      <PDFViewerToolbar zoom={zoom} totalPages={totalPages} onZoomChange={setZoom} />
      <div className="max-h-[70vh] overflow-auto scroll-smooth bg-muted/50 p-4 sm:p-6">
        <Document file={url} onLoadSuccess={({ numPages }) => onPageCount(numPages)} onLoadError={() => setFailed(true)} loading={<PreviewLoading />}>
          {Array.from({ length: totalPages }, (_, index) => (
            <div key={`page-${index + 1}`} className="mb-5 flex justify-center last:mb-0">
              <Page pageNumber={index + 1} scale={zoom} renderTextLayer={false} renderAnnotationLayer={false} loading={<PreviewLoading />} className="overflow-hidden rounded-sm shadow-lg" />
            </div>
          ))}
        </Document>
      </div>
    </Card>
  );
}

function PreviewLoading() {
  return <div className="flex h-72 w-full max-w-[595px] items-center justify-center rounded-sm bg-background text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading PDF preview...</div>;
}
