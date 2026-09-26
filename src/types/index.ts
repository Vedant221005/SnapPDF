export type PageSize = "a4" | "letter" | "legal";
export type Orientation = "portrait" | "landscape";
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
}
