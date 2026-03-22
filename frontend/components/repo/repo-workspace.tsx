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

  const { data: summary } = useQuery({
    queryKey: ["repo-summary", repoId],
    queryFn: async () =>
      (await api.get(`/repo/${repoId}/summary`)).data.summary || "",
  });

  const { data: files } = useQuery({
    queryKey: ["repo-files", repoId],
    queryFn: async () =>
      (await api.get(`/repo/${repoId}/files`)).data.files as string[],
  });

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="w-[320px] border-r border-zinc-800">
        <div className="p-4">
          <RepoSummaryCard summary={summary || ""} />
        </div>
        <FileTree
          repoId={repoId}
          files={files || []}
          onSelectFile={setSelectedFile}
        />
      </aside>

      <main className="flex-1">
        <CodeViewer repoId={repoId} filePath={selectedFile} />
      </main>

      <aside className="w-[360px] border-l border-zinc-800">
        <ChatPanel repoId={repoId} />
      </aside>
    </div>
  );
}
