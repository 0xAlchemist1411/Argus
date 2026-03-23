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
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim()) return;
    if (status !== "READY") return;

    setLoading(true);
    try {
      const res = await api.post("/chat", {
        repoId,
        question,
      });

      setAnswer(res.data.answer);
      setSources(res.data.sources || []);
      setQuestion("");
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
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
          <div className="text-sm font-medium text-white">Answer</div>

          <div className="prose prose-invert mt-3 max-w-none text-sm text-zinc-300 prose-p:leading-6">
            {!answer &&
              status === "READY" &&
              "💬 Ask a question to get started."}

            {status !== "READY" && "⏳ Waiting for indexing to complete..."}

            {answer && (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {answer}
              </ReactMarkdown>
            )}
          </div>
          {loading && (
            <div className="mt-3 text-sm text-zinc-400 animate-pulse">
              Thinking...
            </div>
          )}
          {sources.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-xs uppercase tracking-wide text-zinc-500">
                Sources
              </div>
              <div className="flex flex-wrap gap-2">
                {sources.map((s) => (
                  <Badge
                    key={s}
                    onClick={() => onOpenFile?.(s)}
                    className="cursor-pointer border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
