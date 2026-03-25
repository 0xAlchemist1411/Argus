"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState, useCallback, useEffect } from "react";
import FileTree from "./file-tree";
import CodeViewer from "./code-viewer";
import ChatPanel from "./chat-panel";
import RepoHeader from "./repo-header";
import RepoSummaryCard from "./repo-summary-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageSquare } from "lucide-react";

export default function RepoWorkspace({ repoId }: { repoId: string }) {
  const [selectedFile, setSelectedFile] = useState("");
  const [chatOpen, setChatOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setChatOpen(false);
    }
  }, []);

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

  const handleOpenFile = useCallback((filePath: string) => {
    setSelectedFile(filePath);
  }, []);

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-[#F8F7F3]">
        {/* Header */}
        <RepoHeader
          repoId={repoId}
          status={status}
          chatOpen={chatOpen}
          onToggleChat={() => setChatOpen(!chatOpen)}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Sidebar */}
          <aside
            className={`border-r border-zinc-200/80 bg-white flex flex-col transition-all duration-300 ease-in-out shrink-0 absolute md:relative inset-y-0 left-0 z-20 shadow-2xl md:shadow-none ${
              sidebarCollapsed ? "w-0 overflow-hidden opacity-0 md:opacity-100 border-none" : "w-[280px] md:w-[300px] opacity-100"
            }`}
          >
            <div className="p-4 border-b border-zinc-100">
              <RepoSummaryCard summary={summary || ""} status={status} />
            </div>

            {isLoading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-full bg-zinc-100" />
                <Skeleton className="h-4 w-3/4 bg-zinc-100" />
                <Skeleton className="h-4 w-5/6 bg-zinc-100" />
                <Skeleton className="h-4 w-2/3 bg-zinc-100" />
              </div>
            ) : status === "READY" ? (
              <FileTree
                repoId={repoId}
                files={files || []}
                selectedFile={selectedFile}
                onSelectFile={setSelectedFile}
              />
            ) : status === "INDEXING" ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-amber-500 typing-dot" />
                  <div className="h-2 w-2 rounded-full bg-amber-500 typing-dot" />
                  <div className="h-2 w-2 rounded-full bg-amber-500 typing-dot" />
                </div>
                <div className="text-sm text-zinc-400 text-center">
                  Indexing repository...
                  <br />
                  <span className="text-xs text-zinc-400">
                    Files will appear when ready
                  </span>
                </div>
              </div>
            ) : status === "FAILED" ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-sm text-red-500 text-center">
                  Indexing failed. Please try again.
                </div>
              </div>
            ) : null}
          </aside>

          {/* Code viewer */}
          <main className="flex-1 flex flex-col overflow-hidden min-w-0">
            <CodeViewer
              key={selectedFile}
              repoId={repoId}
              filePath={selectedFile}
            />
          </main>

          {/* Chat panel */}
          <aside
            className={`border-l border-zinc-200/80 bg-white flex flex-col transition-all duration-300 ease-in-out shrink-0 absolute md:relative inset-y-0 right-0 z-20 shadow-2xl md:shadow-none ${
              chatOpen ? "w-[300px] sm:w-[360px] md:w-[400px] opacity-100" : "w-0 overflow-hidden opacity-0 md:opacity-100 border-none"
            }`}
          >
            <ChatPanel
              repoId={repoId}
              status={status}
              onOpenFile={handleOpenFile}
            />
          </aside>

          {/* Chat toggle fab when closed */}
          {!chatOpen && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setChatOpen(true)}
                  className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <MessageSquare className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">Open AI Chat</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
