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
    <div className="relative group">
      {/* Decorative glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-violet-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <form
        onSubmit={handleSubmit}
        className="relative rounded-3xl border border-white/50 bg-white/70 backdrop-blur-xl p-6 shadow-premium transition-all duration-500 hover:shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-[0.03]">
          <Github className="h-32 w-32" />
        </div>

        <div className="relative z-10">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
            Import Repository
          </label>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex flex-1 items-center">
              <Github className="absolute left-4 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/facebook/react"
                className="w-full rounded-2xl border border-border bg-white/50 backdrop-blur-sm pl-12 pr-4 py-4 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/50 transition-all duration-300 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 focus:bg-white shadow-inner-premium"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !repoUrl.trim()}
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-foreground px-8 py-4 text-sm font-bold text-background shadow-premium transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-20 disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed active:scale-95 group/btn"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              )}
              <span>{loading ? "Initializing..." : "Get Started"}</span>
            </button>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-destructive/5 border border-destructive/10 px-4 py-3 text-sm text-destructive animate-slide-up">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
             <div className="h-1 w-1 rounded-full bg-primary/40" />
             <span>Supports any public Git repository</span>
             <div className="h-1 w-1 rounded-full bg-primary/40" />
             <span>Full semantic indexing</span>
          </div>
        </div>
      </form>
    </div>
  );
}
