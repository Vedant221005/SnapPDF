"use client";

import type { ReactNode } from "react";
import { FileText, LayoutTemplate, Maximize2 } from "lucide-react";
import type { Margin, Orientation, PageSize, PDFSettings as Settings } from "@/types";
import { cn } from "@/lib/utils";

interface Props { settings: Settings; onChange: (settings: Settings) => void; }
const choices = {
  pageSize: [{ value: "a4", label: "A4" }, { value: "letter", label: "Letter" }, { value: "legal", label: "Legal" }],
  orientation: [{ value: "portrait", label: "Portrait" }, { value: "landscape", label: "Landscape" }],
  margin: [{ value: "none", label: "None" }, { value: "small", label: "Small" }, { value: "medium", label: "Medium" }, { value: "large", label: "Large" }],
} as const;

export function PDFSettings({ settings, onChange }: Props) {
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => onChange({ ...settings, [key]: value });
  return <div className="space-y-6">
    <SettingGroup icon={<FileText className="h-4 w-4" />} label="Page size">
      <div className="grid grid-cols-3 gap-2">{choices.pageSize.map((item) => <Choice key={item.value} active={settings.pageSize === item.value} label={item.label} onClick={() => set("pageSize", item.value as PageSize)} />)}</div>
    </SettingGroup>
    <SettingGroup icon={<LayoutTemplate className="h-4 w-4" />} label="Orientation">
      <div className="grid grid-cols-2 gap-2">{choices.orientation.map((item) => <Choice key={item.value} active={settings.orientation === item.value} label={item.label} onClick={() => set("orientation", item.value as Orientation)} />)}</div>
    </SettingGroup>
    <SettingGroup icon={<Maximize2 className="h-4 w-4" />} label="Margins">
      <div className="grid grid-cols-4 gap-2">{choices.margin.map((item) => <Choice key={item.value} active={settings.margin === item.value} label={item.label} onClick={() => set("margin", item.value as Margin)} />)}</div>
    </SettingGroup>
  </div>;
}

function SettingGroup({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return <div><div className="mb-2.5 flex items-center gap-2 text-sm font-medium text-muted-foreground">{icon}{label}</div>{children}</div>;
}
function Choice({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={cn("h-10 rounded-lg border border-border bg-background px-2 text-xs font-medium transition hover:border-primary/50", active && "border-primary bg-primary/10 text-primary ring-1 ring-primary/20")}>{label}</button>;
}
