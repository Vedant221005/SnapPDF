import type { ImageFile, PDFSettings } from "@/types";

interface PendingConversion {
  images: ImageFile[];
  settings: PDFSettings;
}

let pendingConversion: PendingConversion | null = null;

export function setPendingConversion(conversion: PendingConversion) {
  pendingConversion = conversion;
}

export function getPendingConversion() {
  return pendingConversion;
}

export function clearPendingConversion() {
  pendingConversion = null;
}
