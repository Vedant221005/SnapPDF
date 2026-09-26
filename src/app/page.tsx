"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Files, LockKeyhole, Sparkles, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { UploadZone } from "@/components/UploadZone";
import { ImagePreview } from "@/components/ImagePreview";
import { PDFSettings } from "@/components/PDFSettings";
import { GenerateButton } from "@/components/GenerateButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { setPendingConversion } from "@/lib/conversion-store";
import { formatBytes } from "@/lib/utils";
import type { ImageFile, PDFSettings as Settings } from "@/types";

const DEFAULT_SETTINGS: Settings = { pageSize: "a4", orientation: "portrait", margin: "none" };

export default function Home() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const imagesRef = useRef(images);
  const router = useRouter();

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  useEffect(() => () => imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl)), []);

  const addFiles = useCallback((files: File[]) => {
    const pngs = files.filter((file) => file.type === "image/png" || file.name.toLowerCase().endsWith(".png"));
    if (!pngs.length) {
      setError("Only PNG images are supported. Please choose a .png file.");
      return;
    }
    setError("");
    setSuccess(false);
    setImages((current) => [...current, ...pngs.map((file) => ({ id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`, file, previewUrl: URL.createObjectURL(file) }))]);
  }, []);

  const removeImage = (id: string) => {
    setImages((current) => {
      const image = current.find((item) => item.id === id);
      if (image) URL.revokeObjectURL(image.previewUrl);
      return current.filter((item) => item.id !== id);
    });
    setSuccess(false);
  };
  const clearAll = () => {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setImages([]);
    setSuccess(false);
  };
  const moveImage = (index: number, direction: "up" | "down") => {
    setImages((current) => {
      const next = [...current];
      const target = direction === "up" ? index - 1 : index + 1;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };
  const totalSize = useMemo(() => images.reduce((total, image) => total + image.file.size, 0), [images]);
  const createPdf = () => {
    if (!images.length) return;
    setPendingConversion({ images, settings });
    router.push("/generate");
  };

  return <div className="min-h-screen bg-hero-grid bg-[size:32px_32px]">
    <Header />
    <main className="mx-auto max-w-6xl px-5 pb-20 pt-12 lg:px-8 lg:pt-20">
      <section className="mx-auto mb-12 max-w-3xl text-center">
        {/* <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"><Sparkles className="h-3.5 w-3.5" /> Simple. Private. Powerful.</div> */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Turn your <span className="text-primary">PNGs</span> into a polished PDF.</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Combine images into one beautiful document in seconds. No uploads, no sign-ups, no compromises.</p>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_330px]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Upload images</CardTitle><p className="mt-1 text-sm text-muted-foreground">PNG files only &middot; Arrange them in your preferred order</p></div>
            {images.length > 0 && <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /> Clear all</Button>}
          </CardHeader>
          <CardContent>
            <UploadZone onFiles={addFiles} error={error} />
            {images.length > 0 ? <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm"><span className="font-semibold">{images.length} {images.length === 1 ? "image" : "images"} ready</span><span className="text-muted-foreground">{formatBytes(totalSize)} total</span></div>
              <div className="space-y-2">{images.map((image, index) => <ImagePreview key={image.id} image={image} index={index} total={images.length} onRemove={() => removeImage(image.id)} onMove={(direction) => moveImage(index, direction)} />)}</div>
            </div> : <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center"><Files className="mb-2 h-6 w-6 text-muted-foreground/50" /><p className="text-sm font-medium text-muted-foreground">Your image queue is empty</p><p className="mt-1 text-xs text-muted-foreground/70">Add one or more PNGs to get started</p></div>}
          </CardContent>
        </Card>

        <Card className="lg:sticky lg:top-6">
          <CardHeader><CardTitle>PDF settings</CardTitle><p className="mt-1 text-sm text-muted-foreground">Customize your document</p></CardHeader>
          <CardContent className="space-y-6"><PDFSettings settings={settings} onChange={setSettings} /><div className="border-t border-border pt-5"><GenerateButton disabled={!images.length} loading={false} success={success} onClick={createPdf} /></div></CardContent>
        </Card>
      </div>

      <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><LockKeyhole className="h-3.5 w-3.5 text-emerald-500" /> 100% private</span><span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> No file uploads</span><span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Free to use</span></div>
    </main>
  </div>;
}
