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
    <header className="flex items-center justify-between border-b border-border bg-white/90 backdrop-blur-xl px-8 py-4 h-[64px] shrink-0 relative z-30 shadow-premium">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl h-9 w-9 transition-all duration-300"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>
            {sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          </TooltipContent>
        </Tooltip>

        <div className="h-5 w-px bg-border/60 mx-1" />

        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-inner-premium group-hover:scale-110 transition-transform duration-300">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span
            className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors hidden sm:inline"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Argus
          </span>
        </Link>

        <div className="h-5 w-px bg-border/60 mx-1 hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/40 border border-border/40">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              Repo ID
            </span>
            <span className="text-xs text-foreground font-mono font-medium">
              {repoId.length > 20 ? `${repoId.slice(0, 12)}...` : repoId}
            </span>
          </div>

          {status && (
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-inner-premium border ${
                status === "READY"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : status === "INDEXING"
                    ? "bg-amber-50 text-amber-600 border-amber-100"
                    : "bg-red-50 text-red-600 border-red-100"
              }`}
            >
              <div
                className={`h-1.5 w-1.5 rounded-full ${
                  status === "READY"
                    ? "bg-emerald-500"
                    : status === "INDEXING"
                      ? "bg-amber-500 animate-pulse"
                      : "bg-red-500"
                }`}
              />
              {status}
            </div>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary hover:bg-accent rounded-xl h-9 w-9"
              >
                <Home className="h-4 w-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>Back Home</TooltipContent>
        </Tooltip>

        <div className="h-5 w-px bg-border/60 mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={chatOpen ? "secondary" : "ghost"}
              size="icon"
              onClick={onToggleChat}
              className={`rounded-xl h-9 w-9 transition-all duration-300 ${
                chatOpen
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "text-muted-foreground hover:text-primary hover:bg-accent"
              }`}
            >
              {chatOpen ? (
                <MessageSquareOff className="h-4 w-4" />
              ) : (
                <MessageSquare className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>
            {chatOpen ? "Close AI Chat" : "Open AI Chat"}
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
