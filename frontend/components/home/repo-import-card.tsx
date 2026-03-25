"use client";

import { api } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Github, Loader2, AlertCircle } from "lucide-react";

export default function RepoImportCard() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/repos/ingest", { repoUrl });
      const repoId = res.data.repoId;

      if (!repoId) {
        throw new Error("Backend did not return repoId");
      }

      router.push(`/repo/${repoId}`);
    } catch {
      setError("Failed to start indexing. Check the repo URL and backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <label className="block text-sm font-medium text-zinc-700 mb-3">
        Import a repository
      </label>
      <div className="flex gap-2">
        <div className="relative flex flex-1 items-center">
          <Github className="absolute left-4 h-4 w-4 text-zinc-400 pointer-events-none" />
          <input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/user/repo"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !repoUrl.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/15 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:brightness-110 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          {loading ? "Indexing..." : "Index"}
        </button>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-3 text-xs text-zinc-400">
        Paste any public GitHub repo URL. We&apos;ll clone, index, and make it searchable.
      </div>
    </form>
  );
}
