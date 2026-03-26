"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  FileCode2,
  Zap,
  MessageSquare,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

const promptChips = [
  { label: "How does auth work?", icon: "🔐" },
  { label: "Explain this repo", icon: "📖" },
  { label: "What are the main modules?", icon: "📦" },
  { label: "What patterns are used?", icon: "🧩" },
];

export default function ChatPanel({
  repoId,
  status,
  onOpenFile,
}: {
  repoId: string;
  status?: string;
  onOpenFile?: (filePath: string) => void;
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function handleAsk() {
    if (!question.trim()) return;
    if (status !== "READY") return;

    const userMessage: Message = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await api.post("/chat", {
        repoId,
        question,
      });

      const aiMessage: Message = {
        role: "assistant",
        content: res.data.answer,
        sources: res.data.sources || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const isReady = status === "READY";

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl shadow-premium p-2">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 shrink-0 bg-white/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner-premium">
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div
              className="text-sm font-bold text-foreground"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              AI Workspace Agent
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className={`h-1.5 w-1.5 rounded-full ${isReady ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}
              />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {isReady ? "Online & Ready" : "Indexing Context"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 bg-background/30 scroll-smooth"
      >
        <div className="space-y-8 max-w-2xl mx-auto">
          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-6 animate-fade text-center">
              {isReady ? (
                <>
                  <div className="h-16 w-16 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center shadow-premium relative">
                    <Sparkles className="h-7 w-7 text-primary" />
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <div
                      className="text-lg font-bold text-foreground"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      How can I help you today?
                    </div>
                    <div className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
                      I&apos;ve mapped the entire repository. Ask me about
                      architecture, patterns, or specific logic.
                    </div>
                  </div>

                  {/* Prompt chips */}
                  <div className="w-full space-y-2.5 mt-4">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mb-2">
                      Suggested Queries
                    </div>
                    {promptChips.map((chip, idx) => (
                      <button
                        key={chip.label}
                        onClick={() => setQuestion(chip.label)}
                        className="w-full text-left rounded-2xl border border-border bg-white px-5 py-3.5 text-sm font-medium text-foreground/70 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:shadow-premium animate-slide-up group"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <span className="mr-3 opacity-60 group-hover:opacity-100 transition-opacity">
                          {chip.icon}
                        </span>
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : status === "INDEXING" ? (
                <div className="space-y-6">
                  <div className="flex justify-center gap-1.5 loading-dots">
                    <div />
                    <div />
                    <div />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-foreground">
                      Analyzing Codebase
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 max-w-[200px] leading-relaxed">
                      I&apos;m currently building a semantic index of all
                      functions and modules...
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm font-medium">
                    Initializing agent...
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-4 animate-slide-up ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                  msg.role === "user"
                    ? "bg-foreground border-foreground text-background"
                    : "bg-primary text-white border-primary"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>

              <div
                className={`flex flex-col gap-2 max-w-[85%] ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-5 py-4 shadow-premium border ${
                    msg.role === "user"
                      ? "bg-foreground text-background border-foreground"
                      : "bg-white border-border text-foreground"
                  }`}
                >
                  <div className="text-[14px] leading-[1.6] prose-chat">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div
                      className={`mt-4 pt-4 border-t ${
                        msg.role === "user"
                          ? "border-white/10"
                          : "border-border/60"
                      }`}
                    >
                      <div
                        className={`text-[10px] uppercase tracking-widest font-bold mb-3 flex items-center gap-2 ${
                          msg.role === "user"
                            ? "text-background/60"
                            : "text-muted-foreground"
                        }`}
                      >
                        <FileCode2 className="h-3 w-3" />
                        Contextual Sources
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((s) => (
                          <button
                            key={s}
                            onClick={() => onOpenFile?.(s)}
                            className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] transition-all font-mono shadow-sm group/source ${
                              msg.role === "user"
                                ? "bg-white/10 border-white/20 text-white hover:bg-white hover:text-foreground"
                                : "bg-muted/30 border-border text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5"
                            }`}
                          >
                            <FileCode2 className="h-3 w-3 opacity-60 group-hover/source:opacity-100 transition-opacity" />
                            {s.split("/").pop()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-4 animate-fade">
              <div className="h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 border border-primary shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-white border border-border px-5 py-4 shadow-premium flex items-center">
                <div className="flex gap-1.5 items-center h-4 loading-dots">
                  <div />
                  <div />
                  <div />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border p-6 shrink-0 bg-white shadow-[0_-4px_20px_oklch(0_0_0/0.02)]">
        <div className="max-w-2xl mx-auto relative group">
          <textarea
            ref={inputRef}
            value={question}
            disabled={loading || !isReady}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              isReady
                ? "Ask about architecture, logic, or specific files..."
                : "Context mapping in progress..."
            }
            className="w-full rounded-2xl border border-border bg-muted/30 px-5 py-4 pr-14 text-[14px] text-foreground outline-none placeholder:text-muted-foreground/60 resize-none transition-all duration-300 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 focus:bg-white disabled:opacity-40 disabled:cursor-not-allowed shadow-inner-premium"
            rows={2}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                handleAsk();
              }
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
          />

          <button
            onClick={handleAsk}
            disabled={loading || !isReady || !question.trim()}
            className="absolute right-3 bottom-3 h-10 w-10 rounded-xl bg-foreground text-background flex items-center justify-center shadow-premium disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.05] active:scale-95 group/send"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5 transition-transform group-hover/send:-rotate-12 group-hover/send:-translate-y-0.5 group-hover/send:translate-x-0.5" />
            )}
          </button>
        </div>

        <div className="mt-4 max-w-2xl mx-auto flex items-center justify-between">
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.15em] flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary" />
            {isReady ? "Argus Intelligence v1.0 online" : "Gathering context"}
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="text-[10px] font-bold text-muted-foreground hover:text-destructive uppercase tracking-widest transition-colors flex items-center gap-1.5"
            >
              Reset Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
