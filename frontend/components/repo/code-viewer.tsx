"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileCode2 } from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function CodeViewer({
  repoId,
  filePath,
}: {
  repoId: string;
  filePath: string;
}) {
  const [explanation, setExplanation] = useState("");

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
    };

    return map[ext || ""] || "plaintext";
  }, [filePath]);

  async function explainFile() {
    if (!filePath) return;

    const res = await api.post("/explain/file", {
      filePath,
    });

    setExplanation(res.data.explanation);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-800 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileCode2 className="h-5 w-5 text-blue-400" />

          <div>
            <div className="text-sm text-zinc-400">Code Viewer</div>
            <div className="text-sm font-medium text-white truncate max-w-[500px]">
              {filePath || "Select a file"}
            </div>
          </div>
        </div>

        <Button variant="secondary" onClick={explainFile} disabled={!filePath}>
          Explain file
        </Button>
      </div>

      <div className="flex-1 p-4">
        {!filePath ? (
          <div className="h-full flex items-center justify-center text-zinc-500">
            Select a file from the left panel
          </div>
        ) : isLoading ? (
          <div className="h-full flex items-center justify-center text-zinc-500 animate-pulse">
            Loading file...
          </div>
        ) : (
          <Card className="h-full overflow-hidden border-zinc-800 bg-zinc-900/70">
            <MonacoEditor
              height="70vh"
              theme="vs-dark"
              language={language} // 🔥 dynamic
              value={data || ""}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                scrollBeyondLastLine: false,
                padding: { top: 12 },
              }}
            />
          </Card>
        )}

        {explanation && (
          <Card className="mt-4 border-zinc-800 bg-zinc-900/70 p-4">
            <div className="text-sm font-medium text-white">Explanation</div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-300">
              {explanation}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
