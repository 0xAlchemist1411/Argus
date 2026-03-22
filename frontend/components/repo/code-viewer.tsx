"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function CodeViewer({ repoId, filePath }: { repoId: string; filePath: string }) {
  const [explanation, setExplanation] = useState("");

  const { data } = useQuery({
    queryKey: ["file-content", filePath],
    queryFn: async () => {
      if (!filePath) return "";
      const res = await api.get("/file", { params: { path: filePath } });
      return res.data.content as string;
    },
    enabled: !!filePath,
  });

  async function explainCurrentFile() {
    if (!filePath) return;
    const res = await api.post("/explain/file", { filePath });
    setExplanation(res.data.explanation);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-zinc-400">Code viewer</div>
            <div className="font-medium text-white">
              {filePath || "Select a file to inspect"}
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={explainCurrentFile}
            disabled={!filePath}
          >
            Explain file
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4">
        <Card className="h-full overflow-hidden border-zinc-800 bg-zinc-900/70">
          <MonacoEditor
            height="70vh"
            theme="vs-dark"
            language="typescript"
            value={data || "// Select a file from the left panel"}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
            }}
            onChange={() => {}}
          />
        </Card>

        {explanation && (
          <Card className="mt-4 border-zinc-800 bg-zinc-900/70 p-4">
            <div className="text-sm font-medium text-white">Explanation</div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-300">
              {explanation}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
