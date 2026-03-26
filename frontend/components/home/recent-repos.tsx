"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import { GitBranch, Clock, ArrowRight } from "lucide-react";

export default function RecentRepos() {
  const { data: repos } = useQuery({
    queryKey: ["recent-repos"],
    queryFn: async () => {
      try {
        const res = await api.get("/repos");
        return res.data as Array<{
          id: string;
          name: string;
          repoUrl: string;
          status: string;
          createdAt: string;
        }>;
      } catch {
        return [];
      }
    },
    retry: false,
  });

  if (!repos || repos.length === 0) return null;

  return (
    <div className="animate-fade">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            Recently Indexed
          </span>
        </div>
        <div className="h-px flex-1 bg-border ml-4" />
      </div>

      <div className="grid gap-3">
        {repos.slice(0, 4).map((repo, idx) => (
          <Link
            key={repo.id}
            href={`/repo/${repo.id}`}
            className="group flex items-center justify-between rounded-2xl border border-transparent bg-white/50 p-4 transition-all duration-300 hover:border-primary/20 hover:bg-white hover:shadow-premium animate-slide-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                <GitBranch className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {repo.name}
                </div>
                <div className="text-[10px] text-muted-foreground font-medium truncate">
                   {repo.repoUrl.replace('https://github.com/', '')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  repo.status === "READY"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : repo.status === "INDEXING"
                    ? "bg-amber-50 text-amber-600 border-amber-100"
                    : "bg-red-50 text-red-600 border-red-100"
                }`}
              >
                {repo.status === "READY"
                  ? "Ready"
                  : repo.status === "INDEXING"
                  ? "Indexing"
                  : "Failed"}
              </span>
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-transparent group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
