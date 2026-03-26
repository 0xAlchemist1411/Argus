"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  FileCode2,
  Sparkles,
  X,
  Loader2,
  Copy,
  Check,
  Code2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-white">
      <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
    </div>
  ),
});

export default function CodeViewer({
  repoId,
  filePath,
}: {
  repoId?: string;
  filePath: string;
}) {
  const [explanation, setExplanation] = useState("");
  const [explaining, setExplaining] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["file-content", filePath],
    queryFn: async () => {
      if (!filePath) return "";
      const res = await api.get("/file", {
        params: { path: filePath },
      });
      return res.data.content as string;
    },
    enabled: !!filePath,
  });

  const language = useMemo(() => {
    if (!filePath) return "plaintext";
    const ext = filePath.split(".").pop()?.toLowerCase();
    const map: Record<string, string> = {
      ts: "typescript",
      tsx: "typescript",
      js: "javascript",
      jsx: "javascript",
      json: "json",
      rs: "rust",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      go: "go",
      md: "markdown",
      html: "html",
      css: "css",
      scss: "scss",
      yaml: "yaml",
      yml: "yaml",
      toml: "toml",
      sql: "sql",
      sh: "shell",
      bash: "shell",
      dockerfile: "dockerfile",
    };
    return map[ext || ""] || "plaintext";
  }, [filePath]);

  const fileName = filePath ? filePath.split("/").pop() : "";
  const lineCount = data ? data.split("\n").length : 0;

  async function explainFile() {
    if (!filePath) return;
    setExplaining(true);
    try {
      const res = await api.post("/explain/file", { filePath });
      setExplanation(res.data.explanation);
    } catch {
      setExplanation("Failed to generate explanation.");
    } finally {
      setExplaining(false);
    }
  }

  async function copyContent() {
    if (!data) return;
    await navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0 bg-white/80 backdrop-blur-xl shadow-inner-premium rounded-t-2xl">
        <div className="flex items-center gap-4 min-w-0">
          {filePath ? (
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-inner-premium shrink-0">
                <FileCode2 className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <div
                  className="text-base font-bold text-foreground truncate"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {fileName}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest truncate">
                  <span className="opacity-60">{filePath}</span>
                  {lineCount > 0 && (
                    <>
                      <div className="h-1 w-1 rounded-full bg-border" />
                      <span className="text-primary/70">{lineCount} lines</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shadow-inner-premium">
                <Code2 className="h-5 w-5 text-muted-foreground/60" />
              </div>
              <span
                className="text-base font-bold text-muted-foreground uppercase tracking-widest"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Select a module to begin
              </span>
            </div>
          )}
        </div>

        {filePath && (
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={copyContent}
              disabled={!data}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-muted/50 border border-border px-4 py-2 text-[11px] font-bold text-foreground transition-all duration-300 hover:bg-white hover:shadow-premium disabled:opacity-30 disabled:cursor-not-allowed group/copy"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500 animate-blur-in" />
              ) : (
                <Copy className="h-3.5 w-3.5 opacity-60 group-hover/copy:opacity-100 transition-opacity" />
              )}
              <span className="uppercase tracking-widest">
                {copied ? "Copied" : "Copy Source"}
              </span>
            </button>

            <button
              onClick={explainFile}
              disabled={!filePath || explaining}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2 text-[11px] font-bold text-background transition-all duration-300 hover:scale-[1.02] hover:shadow-premium disabled:opacity-30 disabled:cursor-not-allowed group/explain shadow-lg ring-offset-background"
            >
              {explaining ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 transition-transform group-hover/explain:rotate-12" />
              )}
              <span className="uppercase tracking-widest">
                {explaining ? "Analyzing..." : "AI Intelligence"}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-hidden relative">
        {!filePath ? (
          <div className="h-full flex flex-col items-center justify-center gap-6 bg-background/20 relative">
            <div className="absolute inset-0 bg-animated-gradient opacity-[0.03] pointer-events-none" />
            <div className="h-20 w-20 rounded-[2rem] bg-white border border-border shadow-premium flex items-center justify-center animate-blur-in group">
              <div className="absolute -inset-2 bg-primary/5 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <FileCode2 className="h-9 w-9 text-muted-foreground/30 transition-colors group-hover:text-primary/40 duration-500" />
            </div>
            <div className="text-center space-y-2 animate-slide-up">
              <div
                className="text-base font-bold text-foreground"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Ready to deep-dive into code
              </div>
              <p className="text-xs text-muted-foreground font-medium max-w-[240px] leading-relaxed mx-auto px-4 opacity-70">
                Select any file from the explorer on the left to view and
                analyze its implementation details.
              </p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 animate-fade">
            <div className="flex gap-1.5 loading-dots">
              <div className="w-2.5 h-2.5" />
              <div className="w-2.5 h-2.5" />
              <div className="w-2.5 h-2.5" />
            </div>
            <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">
              Hydrating module...
            </div>
          </div>
        ) : (
          <MonacoEditor
            height="100%"
            theme="light"
            language={language}
            value={data || ""}
            options={{
              readOnly: true,
              minimap: {
                enabled: true,
                side: "right",
                scale: 1,
                showSlider: "mouseover",
              },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              wordWrap: "on",
              scrollBeyondLastLine: false,
              padding: { top: 24, bottom: 24 },
              lineNumbers: "on",
              renderLineHighlight: "line",
              smoothScrolling: true,
              cursorBlinking: "smooth",
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true,
              },
              lineHeight: 1.6,
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
            }}
          />
        )}
      </div>

      {/* Explanation panel */}
      {explanation && (
        <div className="border-t border-border bg-white shadow-2xl relative z-20 animate-slide-up">
          <div className="flex items-center justify-between px-6 py-3 border-b border-border/60 bg-white/50 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <span
                className="text-[10px] font-bold text-foreground uppercase tracking-widest"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                AI Context Insight
              </span>
            </div>
            <button
              onClick={() => setExplanation("")}
              className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-[320px] overflow-auto px-6 py-6 custom-scrollbar scroll-smooth">
            <div className="max-w-3xl mx-auto prose-chat">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {explanation}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
