"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";
import FileTree from "./file-tree";
import CodeViewer from "./code-viewer";
import ChatPanel from "./chat-panel";
import RepoSummaryCard from "./repo-summary-card";

export default function RepoWorkspace({ repoId }: { repoId: string }) {
  const [selectedFile, setSelectedFile] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["repo-summary", repoId],
    queryFn: async () => {
      const res = await api.get(`/repo/${repoId}/summary`);
      return res.data;
    },
    refetchInterval: (query) =>
      query.state.data?.status === "INDEXING" ? 3000 : false,
  });

  const summary = data?.summary;
  const status = data?.status;

  const { data: files } = useQuery({
    queryKey: ["repo-files", repoId],
    queryFn: async () =>
      (await api.get(`/repo/${repoId}/files`)).data.files as string[],
    enabled: status === "READY",
  });

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="w-[320px] border-r border-zinc-800">
        <div className="p-4">
          <RepoSummaryCard summary={summary || ""} />
          <div className="mt-3 text-sm">
            {isLoading && (
              <span className="text-zinc-400 animate-pulse">Loading...</span>
            )}

            {status === "INDEXING" && (
              <span className="text-yellow-400">⏳ Indexing...</span>
            )}

            {status === "READY" && (
              <span className="text-green-400">✅ Ready</span>
            )}

            {status === "FAILED" && (
              <span className="text-red-400">❌ Failed</span>
            )}
          </div>
        </div>

        {status === "READY" ? (
          <FileTree
            repoId={repoId}
            files={files || []}
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
          />
        ) : (
          <div className="p-4 text-sm text-zinc-500 animate-pulse">
            Preparing files...
          </div>
        )}
      </aside>

      <main className="flex-1">
        <CodeViewer key={repoId} repoId={repoId} filePath={selectedFile} />
      </main>

      <aside className="w-[360px] border-l border-zinc-800">
        <ChatPanel repoId={repoId} status={status} onOpenFile={setSelectedFile} />
      </aside>
    </div>
  );
}
