"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo, useState } from "react";
import {
  Search,
  FileCode2,
  FileJson,
  FileText,
  File,
  ChevronRight,
  FolderOpen,
  Folder,
} from "lucide-react";

function getFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
      return <FileCode2 className="h-4 w-4 text-blue-600" />;
    case "json":
      return <FileJson className="h-4 w-4 text-amber-500" />;
    case "md":
    case "mdx":
      return <FileText className="h-4 w-4 text-zinc-500" />;
    case "rs":
      return <FileCode2 className="h-4 w-4 text-orange-600" />;
    case "py":
      return <FileCode2 className="h-4 w-4 text-green-600" />;
    case "css":
    case "scss":
      return <FileCode2 className="h-4 w-4 text-pink-500" />;
    case "html":
      return <FileCode2 className="h-4 w-4 text-orange-500" />;
    case "toml":
    case "yaml":
    case "yml":
      return <FileJson className="h-4 w-4 text-zinc-500" />;
    default:
      return <File className="h-4 w-4 text-zinc-500" />;
  }
}

type TreeNode = {
  name: string;
  fullPath: string;
  children: TreeNode[];
  isDir: boolean;
};

function buildTree(paths: string[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const path of paths) {
    const parts = path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const existing = current.find((n) => n.name === part);

      if (existing) {
        current = existing.children;
      } else {
        const node: TreeNode = {
          name: part,
          fullPath: path,
          children: [],
          isDir: !isLast,
        };
        current.push(node);
        current = node.children;
      }
    }
  }

  // Sort: directories first, then alphabetical
  function sortNodes(nodes: TreeNode[]) {
    nodes.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => sortNodes(n.children));
  }
  sortNodes(root);
  return root;
}

function TreeItem({
  node,
  depth,
  selectedFile,
  onSelectFile,
  expandedDirs,
  toggleDir,
}: {
  node: TreeNode;
  depth: number;
  selectedFile?: string;
  onSelectFile?: (path: string) => void;
  expandedDirs: Set<string>;
  toggleDir: (path: string) => void;
}) {
  const isActive = selectedFile === node.fullPath;

  if (node.isDir) {
    const dirPath = node.fullPath.split("/").slice(0, depth + 1).join("/");
    const isDirExpanded = expandedDirs.has(dirPath);

    return (
      <div>
        <button
          onClick={() => toggleDir(dirPath)}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-zinc-100"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          <ChevronRight
            className={`h-3 w-3 text-zinc-400 transition-transform duration-200 ${
              isDirExpanded ? "rotate-90" : ""
            }`}
          />
          {isDirExpanded ? (
            <FolderOpen className="h-4 w-4 text-blue-500" />
          ) : (
            <Folder className="h-4 w-4 text-zinc-400" />
          )}
          <span className="text-zinc-700 truncate text-xs font-medium">
            {node.name}
          </span>
        </button>

        {isDirExpanded &&
          node.children.map((child) => (
            <TreeItem
              key={child.fullPath + child.name}
              node={child}
              depth={depth + 1}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
              expandedDirs={expandedDirs}
              toggleDir={toggleDir}
            />
          ))}
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelectFile?.(node.fullPath)}
      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-all duration-200 ${
        isActive
          ? "bg-blue-50 text-blue-700 border border-blue-200 font-medium"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 border border-transparent"
      }`}
      style={{ paddingLeft: `${depth * 16 + 8}px` }}
    >
      {getFileIcon(node.name)}
      <span className="truncate">{node.name}</span>
    </button>
  );
}

export default function FileTree({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  repoId,
  files,
  selectedFile,
  onSelectFile,
}: {
  repoId?: string;
  files: string[];
  selectedFile?: string;
  onSelectFile?: (path: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return files.filter((f) => f.toLowerCase().includes(query.toLowerCase()));
  }, [files, query]);

  const tree = useMemo(() => buildTree(filtered), [filtered]);

  const toggleDir = (path: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const showFlat = query.length > 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 py-2 text-xs text-zinc-700 outline-none placeholder:text-zinc-400 transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:bg-white"
          />
        </div>
        <div className="mt-2 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
          {files.length} files
        </div>
      </div>

      <ScrollArea className="flex-1 px-2 pb-4">
        <div className="space-y-0.5">
          {showFlat
            ? filtered.map((file) => (
                <button
                  key={file}
                  onClick={() => onSelectFile?.(file)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs transition-all ${
                    selectedFile === file
                      ? "bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 border border-transparent"
                  }`}
                >
                  {getFileIcon(file)}
                  <span className="truncate">{file}</span>
                </button>
              ))
            : tree.map((node) => (
                <TreeItem
                  key={node.fullPath + node.name}
                  node={node}
                  depth={0}
                  selectedFile={selectedFile}
                  onSelectFile={onSelectFile}
                  expandedDirs={expandedDirs}
                  toggleDir={toggleDir}
                />
              ))}

          {filtered.length === 0 && (
            <div className="text-xs text-zinc-500 px-3 py-4 text-center">
              No files match your search
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
