import { PDFDocument } from "pdf-lib";
import type { ImageFile, PDFSettings } from "@/types";

const SIZES = { a4: [595.28, 841.89], letter: [612, 792], legal: [612, 1008] } as const;
const MARGINS = { none: 0, small: 28, medium: 56, large: 84 } as const;

async function embed(pdf: PDFDocument, file: File) {
  const type = `${file.type} ${file.name}`.toLowerCase();
  if (type.includes("png")) return pdf.embedPng(await file.arrayBuffer());
  if (type.includes("jpg") || type.includes("jpeg")) return pdf.embedJpg(await file.arrayBuffer());

  let width = 0;
  let height = 0;
  let source: ImageBitmap | HTMLImageElement;
  if (typeof createImageBitmap === "function") {
    source = await createImageBitmap(file);
    width = source.width;
    height = source.height;
  } else {
    source = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);
      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error(`Could not decode ${file.name}.`));
      };
      image.src = objectUrl;
    });
    width = source.naturalWidth;
    height = source.naturalHeight;
  }
  if (!width || !height) throw new Error(`Could not read image dimensions for ${file.name}.`);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser could not create an image canvas.");
  context.drawImage(source, 0, 0);
  if ("close" in source) source.close();
  const png = await new Promise<ArrayBuffer>((resolve, reject) => canvas.toBlob((b) => b ? b.arrayBuffer().then(resolve) : reject(new Error(`Could not convert ${file.name} to PDF.`)), "image/png"));
  return pdf.embedPng(png);
}
export async function generatePdf(images: ImageFile[], settings: PDFSettings): Promise<Blob> {
  if (!images.length) throw new Error("Add at least one image before generating a PDF.");
  const pdf = await PDFDocument.create();
  for (const image of images) {
    const embedded = await embed(pdf, image.file);
    const base = settings.pageSize === "auto" ? [embedded.width, embedded.height] : SIZES[settings.pageSize];
    const pageSize = settings.orientation === "auto"
      ? (embedded.width > embedded.height ? [base[1], base[0]] : [base[0], base[1]])
      : settings.orientation === "landscape" ? [base[1], base[0]] : [base[0], base[1]];
    const maxPageDimension = 14000;
    const pageScale = Math.min(1, maxPageDimension / Math.max(pageSize[0], pageSize[1]));
    const page = pdf.addPage([pageSize[0] * pageScale, pageSize[1] * pageScale] as [number, number]);
    const margin = MARGINS[settings.margin], aw = page.getWidth() - margin * 2, ah = page.getHeight() - margin * 2;
    const scale = Math.min(aw / embedded.width, ah / embedded.height);
    const width = embedded.width * scale, height = embedded.height * scale;
    page.drawImage(embedded, { x: (page.getWidth() - width) / 2, y: (page.getHeight() - height) / 2, width, height });
  }
  const bytes = await pdf.save();
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new Blob([buffer], { type: "application/pdf" });
}
export function downloadBlob(blob: Blob, filename = "snappdf-converted.pdf") {
  const url = URL.createObjectURL(blob), anchor = document.createElement("a");
  anchor.href = url; anchor.download = filename; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
