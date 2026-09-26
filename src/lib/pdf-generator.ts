import { PDFDocument } from "pdf-lib";
import type { ImageFile, PDFSettings } from "@/types";

const PAGE_SIZES = {
  a4: [595.28, 841.89],
  letter: [612, 792],
  legal: [612, 1008],
} as const;

const MARGINS = { none: 0, small: 28, medium: 56, large: 84 } as const;

export async function generatePdf(images: ImageFile[], settings: PDFSettings): Promise<Blob> {
  if (!images.length) throw new Error("Add at least one PNG image before generating a PDF.");

  const pdf = await PDFDocument.create();
  const baseSize = PAGE_SIZES[settings.pageSize];
  const pageSize: [number, number] =
    settings.orientation === "portrait" ? [baseSize[0], baseSize[1]] : [baseSize[1], baseSize[0]];
  const margin = MARGINS[settings.margin];

  for (const image of images) {
    const png = await pdf.embedPng(await image.file.arrayBuffer());
    const page = pdf.addPage(pageSize);
    const availableWidth = Math.max(1, page.getWidth() - margin * 2);
    const availableHeight = Math.max(1, page.getHeight() - margin * 2);
    const scale = Math.min(availableWidth / png.width, availableHeight / png.height);
    const width = png.width * scale;
    const height = png.height * scale;

    page.drawImage(png, {
      x: (page.getWidth() - width) / 2,
      y: (page.getHeight() - height) / 2,
      width,
      height,
    });
  }

  const bytes = await pdf.save();
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new Blob([buffer], { type: "application/pdf" });
}

export function downloadBlob(blob: Blob, filename = "snappdf-converted.pdf") {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
