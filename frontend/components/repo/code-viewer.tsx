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
    <div className="flex h-full flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-zinc-200/80 px-5 py-3 shrink-0 bg-white">
        <div className="flex items-center gap-3 min-w-0">
          {filePath ? (
            <>
              <FileCode2 className="h-4 w-4 text-blue-500 shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-zinc-900 truncate">
                  {fileName}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono truncate">
                  {filePath}
                  {lineCount > 0 && ` · ${lineCount} lines`}
                </div>
              </div>
            </>
          ) : (
            <>
              <Code2 className="h-4 w-4 text-zinc-400 shrink-0" />
              <span className="text-sm text-zinc-500">No file selected</span>
            </>
          )}
        </div>

        {filePath && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyContent}
              disabled={!data}
              className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 gap-1.5"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={explainFile}
              disabled={!filePath || explaining}
              className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 gap-1.5"
            >
              {explaining ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              )}
              {explaining ? "Explaining..." : "Explain"}
            </Button>
          </div>
        )}
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-hidden relative">
        {!filePath ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 bg-zinc-50/50">
            <div className="h-16 w-16 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center">
              <FileCode2 className="h-7 w-7 text-zinc-400" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-zinc-700">
                Select a file to view
              </div>
              <div className="text-xs text-zinc-500 mt-1">
                Choose a file from the sidebar to start exploring
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="h-full flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
            <span className="text-sm text-zinc-500">Loading file...</span>
          </div>
        ) : (
          <MonacoEditor
            height="100%"
            theme="light"
            language={language}
            value={data || ""}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              wordWrap: "on",
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              lineNumbers: "on",
              renderLineHighlight: "line",
              smoothScrolling: true,
              cursorBlinking: "smooth",
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true,
              },
            }}
          />
        )}
      </div>

      {/* Explanation panel */}
      {explanation && (
        <div className="border-t border-zinc-200/80 bg-zinc-50/80 max-h-[300px] overflow-auto">
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-200/60 bg-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <span className="text-sm font-medium text-zinc-900">
                AI Explanation
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setExplanation("")}
              className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="px-5 py-4 text-sm leading-7 text-zinc-700 prose-chat">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {explanation}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
