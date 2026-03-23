"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo, useState } from "react";
import { ChevronRight, FileCode2 } from "lucide-react";

export default function FileTree({
  repoId,
  files,
  selectedFile,
  onSelectFile,
}: {
  repoId: string;
  files: string[];
  selectedFile?: string;
  onSelectFile?: (path: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return files.filter((f) => f.toLowerCase().includes(query.toLowerCase()));
  }, [files, query]);

  return (
    <div className="h-full p-4">
      <div className="mb-3">
        <div className="text-sm font-medium text-zinc-200">Files</div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter files..."
          className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
        />
      </div>

      <ScrollArea className="h-[calc(100vh-210px)] pr-2">
        <div className="space-y-1">
          {filtered.map((file) => {
            const isActive = selectedFile === file;

            return (
              <button
                key={file}
                onClick={() => onSelectFile?.(file)}
                className={`
                  flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-all
                  ${
                    isActive
                      ? "bg-zinc-800 text-white shadow-inner"
                      : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  }
                `}
              >
                <ChevronRight
                  className={`h-3.5 w-3.5 ${
                    isActive ? "text-white" : "text-zinc-500"
                  }`}
                />

                <FileCode2
                  className={`h-4 w-4 ${
                    isActive ? "text-blue-300" : "text-blue-400"
                  }`}
                />

                <span className="truncate">{file}</span>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-sm text-zinc-500 px-2 py-2">
              No files found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
