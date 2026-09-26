import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GenerateButton({ disabled, loading, success, onClick }: { disabled: boolean; loading: boolean; success: boolean; onClick: () => void }) {
  return <div className="space-y-3">
    <Button size="lg" className="w-full shadow-lg shadow-primary/20" disabled={disabled || loading} onClick={onClick}>
      {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Creating your PDF...</> : success ? <><CheckCircle2 className="h-5 w-5" /> PDF downloaded</> : <>Generate PDF <ArrowRight className="h-5 w-5" /></>}
    </Button>
    <p className="text-center text-[11px] text-muted-foreground">One page will be created for each image</p>
  </div>;
}
