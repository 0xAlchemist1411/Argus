"use client";

import { api } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Github, Loader2 } from "lucide-react";

export default function RepoImportCard() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/repos/ingest", { repoUrl });
      const repoId = res.data.repoId;

      if (!repoId) {
        throw new Error("Backend did not return repoId");
      }

      router.push(`/repo/${repoId}`);
    } catch (err) {
      setError("Failed to start indexing. Check the repo URL and backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-xl shadow-black/20"
    >
      <label className="mb-3 block text-sm text-zinc-400">
        Paste a GitHub repo URL
      </label>
      <div className="flex gap-2">
        <div className="flex flex-1 items-center rounded-2xl border border-zinc-800 bg-zinc-950 px-4">
          <Github className="h-4 w-4 text-zinc-500" />
          <input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/user/repo"
            className="w-full bg-transparent px-3 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-zinc-950 hover:bg-zinc-200 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          Index
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </form>
  );
}
