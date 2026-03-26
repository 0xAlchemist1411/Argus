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
import { MessageSquare, X } from "lucide-react";

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
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        {/* Subtle background gradient for workspace */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-accent/40 via-white to-secondary/60 opacity-60" />

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
            className={`bg-white/90 backdrop-blur-xl border-r border-border flex flex-col transition-all duration-500 ease-in-out shrink-0 absolute md:relative inset-y-0 left-0 z-20 shadow-premium md:shadow-none ${
              sidebarCollapsed
                ? "w-0 -translate-x-full md:translate-x-0 opacity-0 border-none"
                : "w-[260px] md:w-[300px] opacity-100 translate-x-0"
            }`}
          >
            <div className="p-4">
              <RepoSummaryCard summary={summary || ""} status={status} />
            </div>

            <div className="flex-1 overflow-hidden">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  <Skeleton className="h-4 w-full bg-muted/50 rounded-full" />
                  <Skeleton className="h-4 w-3/4 bg-muted/50 rounded-full" />
                  <Skeleton className="h-4 w-5/6 bg-muted/50 rounded-full" />
                  <Skeleton className="h-4 w-2/3 bg-muted/50 rounded-full" />
                </div>
              ) : status === "READY" ? (
                <FileTree
                  files={files || []}
                  selectedFile={selectedFile}
                  onSelectFile={setSelectedFile}
                />
              ) : status === "INDEXING" ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 gap-5 animate-fade text-center">
                  <div className="flex gap-1.5 loading-dots">
                    <div />
                    <div />
                    <div />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground mb-1">
                      Indexing Repository
                    </div>
                    <div className="text-[11px] text-muted-foreground font-medium leading-relaxed px-4">
                      Analyzing modules and generating semantic map...
                    </div>
                  </div>
                </div>
              ) : status === "FAILED" ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade">
                  <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
                    <X className="h-6 w-6 text-destructive" />
                  </div>
                  <div className="text-sm font-bold text-destructive mb-1">
                    Indexing Failed
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Please check the URL or try again later.
                  </div>
                </div>
              ) : null}
            </div>
          </aside>

          {/* Code viewer */}
          <main className="flex-1 flex flex-col overflow-hidden min-w-0 bg-transparent">
            <div className="flex-1 m-2 rounded-2xl border border-border bg-white shadow-premium overflow-hidden">
              <CodeViewer
                key={selectedFile}
                repoId={repoId}
                filePath={selectedFile}
              />
            </div>
          </main>

          {/* Chat panel */}
          <aside
            className={`bg-white/90 backdrop-blur-xl border-l border-border flex flex-col transition-all duration-500 ease-in-out shrink-0 absolute md:relative inset-y-0 right-0 z-20 shadow-premium md:shadow-none ${
              chatOpen
                ? "w-[300px] sm:w-[360px] md:w-[400px] opacity-100 translate-x-0"
                : "w-0 translate-x-full opacity-0 border-none"
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
                  className="fixed bottom-8 right-8 z-50 h-14 w-14 rounded-2xl bg-primary text-background flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 hover:rotate-6 ring-4 ring-background animate-fade"
                >
                  <MessageSquare className="h-6 w-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="font-bold">
                Chat with AI
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      {/* Sidebar collapse overlay (mobile) */}
      {!sidebarCollapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-10 transition-opacity"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </TooltipProvider>
  );
}
