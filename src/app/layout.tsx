import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnapPDF — Image to PDF Converter",
  description: "Convert common image formats to PDF privately in your browser.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
