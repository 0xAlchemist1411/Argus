"use client";

export default function RepoSummaryCard({ summary }: { summary: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
      <div className="text-sm font-medium text-zinc-200">
        Repository summary
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-400">
        {summary || "Summary will appear after indexing finishes."}
      </p>
    </div>
  );
}
