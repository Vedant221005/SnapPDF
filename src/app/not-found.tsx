import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-hero-grid bg-[size:32px_32px]">
      <Header />
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center px-5 py-16">
        <Card className="w-full p-8 text-center sm:p-12">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FileQuestion className="h-8 w-8" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">404</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
          <p className="mt-3 text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or was moved.
          </p>
          <Link href="/" className="mt-8 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            <ArrowLeft className="h-4 w-4" />
            Back to SnapPDF
          </Link>
        </Card>
      </main>
    </div>
  );
}
