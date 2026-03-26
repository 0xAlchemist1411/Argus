"use client";

import { BookOpen, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RepoSummaryCard({
  summary,
  status,
}: {
  summary: string;
  status?: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-border bg-card p-5 shadow-premium transition-all duration-300 hover:shadow-lg overflow-hidden">
      <div className="absolute top-0 right-0 p-3 opacity-[0.07] group-hover:scale-110 transition-transform duration-500">
        <BookOpen className="h-12 w-12" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            Repository Intelligence
          </span>

          <div className="ml-auto">
            {status === "INDEXING" && (
              <Loader2 className="h-3.5 w-3.5 text-amber-500 animate-spin" />
            )}
            {status === "READY" && (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 animate-fade" />
            )}
            {status === "FAILED" && (
              <AlertCircle className="h-3.5 w-3.5 text-red-500 animate-fade" />
            )}
          </div>
        </div>

        {summary ? (
          <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-[13px] leading-relaxed text-foreground/80 font-medium">
              {summary}
            </p>
          </div>
        ) : status === "INDEXING" ? (
          <div className="space-y-3">
            <div className="h-2.5 w-full rounded-full bg-muted/40 animate-pulse" />
            <div className="h-2.5 w-[90%] rounded-full bg-muted/40 animate-pulse" />
            <div className="h-2.5 w-[75%] rounded-full bg-muted/40 animate-pulse" />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic leading-relaxed">
            AI is analyzing your repository to generate a comprehensive
            architectural summary...
          </p>
        )}
      </div>
    </div>
  );
}
