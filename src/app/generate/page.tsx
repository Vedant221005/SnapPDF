"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Download, FileImage, FileText, RotateCcw, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { clearPendingConversion, getPendingConversion, useConversionStore } from "@/lib/conversion-store";
import { downloadBlob, generatePdf } from "@/lib/pdf-generator";
import { formatBytes } from "@/lib/utils";
import type { ImageFile, PDFSettings } from "@/types";

const pageLabels = { auto: "Auto", a4: "A4", letter: "Letter", legal: "Legal" };
const orientationLabels = { auto: "Auto", portrait: "Portrait", landscape: "Landscape" };

interface Result { blob: Blob; pages: number; filename: string; }

const PDFPreview = dynamic(
  () => import("@/components/PDFPreview").then((module) => module.PDFPreview),
  { ssr: false, loading: () => <div className="flex min-h-48 items-center justify-center rounded-2xl border border-border bg-muted/30 text-sm text-muted-foreground">Loading PDF preview...</div> },
);

export default function GeneratePage() {
  const router = useRouter();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<PDFSettings | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [previewKey, setPreviewKey] = useState(0);
  const setGeneratedPdf = useConversionStore((state) => state.setGeneratedPdf);
  const generatedPdfUrl = useConversionStore((state) => state.generatedPdfUrl);
  const totalPages = useConversionStore((state) => state.totalPages);

  useEffect(() => {
    const conversion = getPendingConversion();
    if (!conversion) {
      setError("This conversion session has expired. Please choose your images again.");
      return;
    }
    setImages(conversion.images);
    setSettings(conversion.settings);
    let cancelled = false;
    void generatePdf(conversion.images, conversion.settings)
      .then((blob) => {
        const filename = `${conversion.settings.filename.trim().replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-").replace(/\.pdf$/i, "") || "SnapPDF-Converted"}.pdf`;
        if (!cancelled) {
          const url = URL.createObjectURL(blob);
          setGeneratedPdf(blob, url, conversion.images.length);
          setResult({ blob, pages: conversion.images.length, filename });
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "Something went wrong while creating your PDF.");
      });
    return () => {
      cancelled = true;
      const currentUrl = useConversionStore.getState().generatedPdfUrl;
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [setGeneratedPdf]);

  const startOver = () => {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    const currentUrl = useConversionStore.getState().generatedPdfUrl;
    if (currentUrl) URL.revokeObjectURL(currentUrl);
    clearPendingConversion();
    router.push("/");
  };

  return <div className="min-h-screen bg-hero-grid bg-[size:32px_32px]">
    <Header />
    <main className="mx-auto flex max-w-5xl flex-col items-center px-5 pb-20 pt-12 lg:pt-20">
      <button onClick={startOver} className="mb-10 flex items-center gap-2 self-start text-sm font-medium text-muted-foreground transition hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to editor</button>
      <AnimatePresence mode="wait">
        {!result && !error ? <motion.div key="loading" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="w-full max-w-2xl">
          <Card className="overflow-hidden p-8 text-center shadow-soft sm:p-12">
            <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
              <motion.div className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary" animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
              <FileImage className="h-9 w-9" />
            </div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Almost there</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Creating your PDF</h1>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">We&apos;re arranging your images and preparing a polished document. Everything happens privately in your browser.</p>
            <div className="mx-auto mt-8 h-2 max-w-md overflow-hidden rounded-full bg-muted"><motion.div className="h-full w-1/2 rounded-full bg-primary" animate={{ x: ["-100%", "200%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} /></div>
            <div className="mt-9 grid grid-cols-2 gap-3 text-left sm:grid-cols-4"><Detail label="Images" value={String(images.length)} /><Detail label="Est. pages" value={String(images.length)} /><Detail label="Page size" value={settings ? pageLabels[settings.pageSize] : "—"} /><Detail label="Orientation" value={settings ? orientationLabels[settings.orientation] : "—"} /></div>
          </Card>
        </motion.div> : error ? <motion.div key="error" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg"><Card className="p-8 text-center"><div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive"><RotateCcw className="h-6 w-6" /></div><h1 className="text-2xl font-bold">Unable to create PDF</h1><p className="mt-2 text-sm text-muted-foreground">{error}</p><Button className="mt-7" onClick={startOver}>Convert another file <ArrowRight className="h-4 w-4" /></Button></Card></motion.div> : <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
          <Card className="overflow-hidden p-8 text-center shadow-soft sm:p-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15 }} className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-11 w-11" /></motion.div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Conversion complete</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your PDF is ready</h1>
            <p className="mt-3 text-muted-foreground">Your images have been combined into one downloadable document.</p>
            <div className="mx-auto mt-8 flex max-w-md items-center gap-4 rounded-xl border border-border bg-muted/40 p-4 text-left"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{result!.filename}</p><p className="mt-1 text-xs text-muted-foreground">{result!.pages} {result!.pages === 1 ? "page" : "pages"} · {formatBytes(result!.blob.size)}</p></div></div>
            {generatedPdfUrl && <div className="mt-10 text-left"><h2 className="mb-3 text-lg font-semibold">PDF Preview</h2><PDFPreview key={previewKey} url={generatedPdfUrl} totalPages={totalPages || result!.pages} onPageCount={(pages) => useConversionStore.getState().setGeneratedPdf(result!.blob, generatedPdfUrl, pages)} onRetry={() => setPreviewKey((key) => key + 1)} /></div>}
            <div className="mx-auto mt-7 flex max-w-md flex-col gap-3"><Button size="lg" onClick={() => downloadBlob(result!.blob, result!.filename)}><Download className="h-5 w-5" /> Download PDF</Button><Button variant="outline" size="lg" onClick={startOver}>Convert Another File</Button></div>
            <p className="mt-7 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Processed locally and securely in your browser</p>
          </Card>
        </motion.div>}
      </AnimatePresence>
    </main>
  </div>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-muted/60 px-3 py-2.5"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>;
}
