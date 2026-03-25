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
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-zinc-400" />
        <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
          Recent Repos
        </div>
      </div>

      <div className="space-y-2">
        {repos.slice(0, 4).map((repo) => (
          <Link
            key={repo.id}
            href={`/repo/${repo.id}`}
            className="group flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/50 px-4 py-3 transition-all duration-300 hover:bg-zinc-50 hover:border-zinc-200 hover:shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <GitBranch className="h-4 w-4 text-zinc-400 shrink-0" />
              <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors truncate">
                {repo.name}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  repo.status === "READY"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : repo.status === "INDEXING"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {repo.status === "READY"
                  ? "Ready"
                  : repo.status === "INDEXING"
                  ? "Indexing"
                  : "Failed"}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
