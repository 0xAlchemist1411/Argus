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
    <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-4 w-4 text-zinc-500" />
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Summary
        </span>

        {status === "INDEXING" && (
          <Loader2 className="h-3 w-3 text-amber-500 animate-spin ml-auto" />
        )}
        {status === "READY" && (
          <CheckCircle2 className="h-3 w-3 text-emerald-500 ml-auto" />
        )}
        {status === "FAILED" && (
          <AlertCircle className="h-3 w-3 text-red-500 ml-auto" />
        )}
      </div>

      {summary ? (
        <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-sm leading-6 text-zinc-600">{summary}</p>
        </div>
      ) : status === "INDEXING" ? (
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-zinc-200/50 animate-shimmer" />
          <div className="h-3 w-4/5 rounded bg-zinc-200/50 animate-shimmer" />
          <div className="h-3 w-3/5 rounded bg-zinc-200/50 animate-shimmer" />
        </div>
      ) : (
        <p className="text-sm text-zinc-400 italic">
          Summary will appear after indexing.
        </p>
      )}
    </div>
  );
}
