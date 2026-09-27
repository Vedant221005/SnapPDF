export type PageSize = "auto" | "a4" | "letter" | "legal";
export type Orientation = "auto" | "portrait" | "landscape";
export type Margin = "none" | "small" | "medium" | "large";

export interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
}

export interface PDFSettings {
  pageSize: PageSize;
  orientation: Orientation;
  margin: Margin;
  filename: string;
}

export const SUPPORTED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"] as const;
export const MAX_IMAGES = 100;
export const MAX_TOTAL_BYTES = 50 * 1024 * 1024;
