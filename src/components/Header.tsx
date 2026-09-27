"use client";

import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="SnapPDF logo" width={42} height={42} className="h-10 w-10 object-contain" priority />
          <span className="text-base font-bold tracking-tight">Snap<span className="text-primary">PDF</span></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground sm:block">Private &middot; Runs in your browser</span>
          <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => document.documentElement.classList.toggle("dark")}>
            <Sun className="h-4 w-4 dark:hidden" /><Moon className="hidden h-4 w-4 dark:block" />
          </Button>
        </div>
      </div>
    </header>
  );
}
