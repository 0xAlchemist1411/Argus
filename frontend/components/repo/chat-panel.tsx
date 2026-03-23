"use client";

import { api } from "@/lib/api";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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

  type Message = {
    role: "user" | "assistant";
    content: string;
    sources?: string[];
  };

  const [messages, setMessages] = useState<Message[]>([]);

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
    } finally {
      setLoading(false);
    }
  }

  const promptChips = [
    "How does auth work?",
    "Explain this repo",
    "Where is CPI handled?",
    "What are the main modules?",
  ];

  return (
    <div className="flex h-full flex-col border-l border-zinc-800">
      <div className="border-b border-zinc-800 px-4 py-4">
        <div className="text-sm text-zinc-400">AI chat</div>
        <div className="text-lg font-medium text-white">
          Ask about this repo
        </div>
      </div>

      <div className="space-y-2 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {promptChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setQuestion(chip)}
              className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
            >
              {chip}
            </button>
          ))}
        </div>

        {status !== "READY" && (
          <div className="text-sm text-yellow-400">
            ⏳ Repository is still indexing. Chat will unlock when ready.
          </div>
        )}

        <Textarea
          value={question}
          disabled={loading || status !== "READY"}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something about the repository..."
          className="min-h-[120px] border-zinc-800 bg-zinc-950 text-zinc-100"
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              handleAsk();
            }
          }}
        />

        <Button
          onClick={handleAsk}
          disabled={loading || status !== "READY" || !question.trim()}
          className="w-full"
        >
          {loading ? "Thinking..." : "Ask Argus"}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 pb-4">
        <div className="space-y-4">
          {messages.length === 0 && status === "READY" && (
            <div className="text-sm text-zinc-500">
              💬 Ask a question to get started.
            </div>
          )}

          {status !== "READY" && (
            <div className="text-sm text-zinc-500">
              ⏳ Waiting for indexing to complete...
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-3 ${
                msg.role === "user"
                  ? "bg-zinc-800 text-white"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-300"
              }`}
            >
              <div className="text-xs mb-1 text-zinc-500">
                {msg.role === "user" ? "You" : "Argus"}
              </div>

              <div className="prose prose-invert max-w-none text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>

              {/* Sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.sources.map((s) => (
                    <Badge
                      key={s}
                      onClick={() => onOpenFile?.(s)}
                      className="cursor-pointer border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="text-sm text-zinc-400 animate-pulse">
              Thinking...
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
