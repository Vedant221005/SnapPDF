"use client";

import { create } from "zustand";
import type { ImageFile, PDFSettings } from "@/types";

interface ConversionState {
  images: ImageFile[];
  settings: PDFSettings;
  error: string;
  generatedPdfBlob: Blob | null;
  generatedPdfUrl: string | null;
  totalPages: number;
  setImages: (images: ImageFile[]) => void;
  setSettings: (settings: PDFSettings) => void;
  setError: (error: string) => void;
  setGeneratedPdf: (blob: Blob, url: string, totalPages: number) => void;
  clearGeneratedPdf: () => void;
  clear: () => void;
}

export const DEFAULT_SETTINGS: PDFSettings = {
  pageSize: "auto",
  orientation: "auto",
  margin: "small",
  filename: "",
};

export const useConversionStore = create<ConversionState>((set) => ({
  images: [],
  settings: DEFAULT_SETTINGS,
  error: "",
  generatedPdfBlob: null,
  generatedPdfUrl: null,
  totalPages: 0,
  setImages: (images) => set({ images }),
  setSettings: (settings) => set({ settings }),
  setError: (error) => set({ error }),
  setGeneratedPdf: (generatedPdfBlob, generatedPdfUrl, totalPages) => set({ generatedPdfBlob, generatedPdfUrl, totalPages }),
  clearGeneratedPdf: () => set({ generatedPdfBlob: null, generatedPdfUrl: null, totalPages: 0 }),
  clear: () => set({ images: [], error: "", generatedPdfBlob: null, generatedPdfUrl: null, totalPages: 0 }),
}));

export function setPendingConversion(conversion: { images: ImageFile[]; settings: PDFSettings }) {
  useConversionStore.setState(conversion);
}

export function getPendingConversion() {
  const { images, settings } = useConversionStore.getState();
  return images.length ? { images, settings } : null;
}

export function clearPendingConversion() {
  useConversionStore.getState().clear();
}
