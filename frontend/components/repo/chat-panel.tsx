"use client";

import { api } from "@/lib/api";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  Bot,
  User,
  Sparkles,
  FileCode2,
  Loader2,
  MessageSquare,
  Lightbulb,
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

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
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const isReady = status === "READY";

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-zinc-200/80 px-5 py-3 shrink-0 bg-white">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
            <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-900">AI Chat</div>
            <div className="text-[10px] text-zinc-500">
              {isReady ? "Ask anything about this repo" : "Waiting for indexing"}
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 bg-zinc-50/30">
        <div className="space-y-4">
          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              {isReady ? (
                <>
                  <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
                    <Sparkles className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-zinc-900">
                      Ready to explore
                    </div>
                    <div className="text-xs text-zinc-500 mt-1 max-w-[200px]">
                      Ask questions about the codebase and get AI-powered answers
                    </div>
                  </div>

                  {/* Prompt chips */}
                  <div className="w-full space-y-2 mt-2">
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium flex items-center gap-1.5">
                      <Lightbulb className="h-3 w-3" />
                      Suggestions
                    </div>
                    {promptChips.map((chip) => (
                      <button
                        key={chip.label}
                        onClick={() => setQuestion(chip.label)}
                        className="w-full text-left rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-600 transition-all duration-200 hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-900 shadow-sm"
                      >
                        <span className="mr-2">{chip.icon}</span>
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : status === "INDEXING" ? (
                <>
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-amber-500 typing-dot" />
                    <div className="h-2 w-2 rounded-full bg-amber-500 typing-dot" />
                    <div className="h-2 w-2 rounded-full bg-amber-500 typing-dot" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-amber-600 font-medium">
                      Indexing in progress
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      Chat will be available once indexing is complete
                    </div>
                  </div>
                </>
              ) : status === "FAILED" ? (
                <div className="text-sm text-red-600 font-medium text-center">
                  Indexing failed. Chat is unavailable.
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-zinc-400 animate-spin" />
                  <span className="text-sm text-zinc-500">Loading...</span>
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 animate-fade-in-up ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
              style={{ animationDelay: "0.05s" }}
            >
              {msg.role === "assistant" && (
                <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-blue-600" />
                </div>
              )}

              <div
                className={`rounded-2xl px-4 py-3 max-w-[85%] shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 border border-transparent text-white"
                    : "bg-white border border-zinc-200 text-zinc-800"
                }`}
              >
                <div className="text-sm leading-relaxed prose-chat">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className={`mt-3 pt-3 border-t ${
                    msg.role === "user" ? "border-white/20" : "border-zinc-100"
                  }`}>
                    <div className={`text-[10px] uppercase tracking-wider font-medium mb-2 flex items-center gap-1 ${
                      msg.role === "user" ? "text-blue-100" : "text-zinc-500"
                    }`}>
                      <FileCode2 className="h-3 w-3" />
                      Sources
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((s) => (
                        <button
                          key={s}
                          onClick={() => onOpenFile?.(s)}
                          className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] transition-colors font-mono ${
                            msg.role === "user"
                              ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                              : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                          }`}
                        >
                          <FileCode2 className="h-2.5 w-2.5" />
                          {s.split("/").pop()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="h-7 w-7 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <User className="h-3.5 w-3.5 text-zinc-100" />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 items-start">
              <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <Bot className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <div className="rounded-2xl bg-white border border-zinc-200 px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center h-5">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 typing-dot" />
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 typing-dot" />
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 typing-dot" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-zinc-200/80 p-4 shrink-0 bg-white">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={question}
            disabled={loading || !isReady}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              isReady
                ? "Ask about this codebase..."
                : "Chat available after indexing..."
            }
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 pr-12 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 resize-none transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:bg-white disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
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
            className="absolute right-3 bottom-3 h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-md hover:shadow-blue-500/20 active:scale-95"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="text-[10px] text-zinc-400">
            {isReady ? "Enter to send · Shift+Enter for new line" : ""}
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="text-[10px] text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              Clear chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
