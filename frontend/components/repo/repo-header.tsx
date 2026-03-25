"use client";

import Link from "next/link";
import {
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  MessageSquareOff,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function RepoHeader({
  repoId,
  status,
  chatOpen,
  onToggleChat,
  sidebarCollapsed,
  onToggleSidebar,
}: {
  repoId: string;
  status?: string;
  chatOpen: boolean;
  onToggleChat: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200/80 bg-white px-4 py-2.5 h-[52px] shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleSidebar}
              className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          </TooltipContent>
        </Tooltip>

        <div className="h-4 w-px bg-zinc-200" />

        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-sm shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-shadow">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-zinc-700 group-hover:text-zinc-900 transition-colors">
            Argus
          </span>
        </Link>

        <div className="h-4 w-px bg-zinc-200" />

        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500 font-mono truncate max-w-[200px]">
            {repoId.length > 12 ? `${repoId.slice(0, 8)}...` : repoId}
          </span>

          {status && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                status === "READY"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : status === "INDEXING"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <div
                className={`h-1.5 w-1.5 rounded-full ${
                  status === "READY"
                    ? "bg-emerald-500"
                    : status === "INDEXING"
                    ? "bg-amber-500 animate-pulse-dot"
                    : "bg-red-500"
                }`}
              />
              {status === "READY"
                ? "Ready"
                : status === "INDEXING"
                ? "Indexing"
                : "Failed"}
            </span>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/">
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
              >
                <Home className="h-4 w-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Home</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleChat}
              className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            >
              {chatOpen ? (
                <MessageSquareOff className="h-4 w-4" />
              ) : (
                <MessageSquare className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {chatOpen ? "Hide chat" : "Show chat"}
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
