import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnapPDF — PNG to PDF Converter",
  description: "Convert PNG images to a PDF privately, right in your browser.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
