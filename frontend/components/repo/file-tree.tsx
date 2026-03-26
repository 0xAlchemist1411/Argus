"use client";

import { useMemo, useState } from "react";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  FileCode2,
  Search,
  Zap,
} from "lucide-react";

interface TreeNode {
  name: string;
  isDir: boolean;
  fullPath: string;
  children: TreeNode[];
}

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = {
    name: "root",
    isDir: true,
    fullPath: "",
    children: [],
  };

  for (const path of paths) {
    const parts = path.split("/");
    let current = root;
    let currentPath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isDir = i < parts.length - 1;

      let child = current.children.find((c) => c.name === part);
      if (!child) {
        child = { name: part, isDir, fullPath: currentPath, children: [] };
        current.children.push(child);
      }
      current = child;
    }
  }

  const sortNodes = (node: TreeNode) => {
    node.children.sort((a, b) => {
      if (a.isDir && !b.isDir) return -1;
      if (!a.isDir && b.isDir) return 1;
      return a.name.localeCompare(b.name);
    });
    node.children.forEach(sortNodes);
  };

  sortNodes(root);
  return root;
}

function getFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  const iconClass = "h-4 w-4 shrink-0 drop-shadow-sm";

  switch (ext) {
    case "ts":
    case "tsx":
      return <FileCode2 className={`${iconClass} text-blue-500`} />;
    case "js":
    case "jsx":
      return <FileCode2 className={`${iconClass} text-amber-500`} />;
    case "json":
      return <FileCode2 className={`${iconClass} text-emerald-500`} />;
    case "css":
      return <FileCode2 className={`${iconClass} text-pink-500`} />;
    case "html":
      return <FileCode2 className={`${iconClass} text-orange-500`} />;
    case "md":
      return <FileCode2 className={`${iconClass} text-foreground/40`} />;
    default:
      return <FileCode2 className={`${iconClass} text-muted-foreground/60`} />;
  }
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
    const isExpanded = expandedDirs.has(node.fullPath);

    return (
      <div className="animate-fade">
        <button
          onClick={() => toggleDir(node.fullPath)}
          className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left transition-all duration-300 hover:bg-muted/50 group"
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
        >
          <div
            className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}
          >
            <ChevronRight
              className={`h-3 w-3 ${isExpanded ? "text-primary" : "text-muted-foreground"}`}
            />
          </div>
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 text-primary opacity-80" />
          ) : (
            <Folder className="h-4 w-4 text-muted-foreground opacity-60 group-hover:opacity-80 transition-opacity" />
          )}
          <span
            className={`text-[13px] truncate ${isExpanded ? "font-bold text-foreground" : "font-medium text-foreground/70"}`}
          >
            {node.name}
          </span>
        </button>

        {isExpanded && (
          <div className="relative">
            <div
              className="absolute left-[15px] top-0 bottom-2 w-px bg-border/40"
              style={{ left: `${depth * 14 + 15}px` }}
            />
            <div>
              {node.children.map((child) => (
                <TreeItem
                  key={child.fullPath}
                  node={child}
                  depth={depth + 1}
                  selectedFile={selectedFile}
                  onSelectFile={onSelectFile}
                  expandedDirs={expandedDirs}
                  toggleDir={toggleDir}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelectFile?.(node.fullPath)}
      className={`flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left transition-all duration-300 relative group animate-fade ${
        isActive
          ? "bg-accent text-primary shadow-inner-premium font-bold"
          : "text-foreground/70 hover:bg-accent hover:text-primary font-medium"
      }`}
      style={{ paddingLeft: `${depth * 14 + 8}px` }}
    >
      {getFileIcon(node.name)}
      <span className="truncate text-[13px]">{node.name}</span>
      {isActive && (
        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-blur-in shadow-[0_0_8px_oklch(var(--primary))]" />
      )}
    </button>
  );
}

export default function FileTree({
  files,
  selectedFile,
  onSelectFile,
}: {
  files: string[];
  selectedFile?: string;
  onSelectFile?: (path: string) => void;
}) {
  const [query, setQuery] = useState("");
  const tree = useMemo(() => buildTree(files), [files]);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set([""]));

  const toggleDir = (path: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const filteredTree = useMemo(() => {
    if (!query) return tree;

    const filter = (node: TreeNode): TreeNode | null => {
      const match = node.name.toLowerCase().includes(query.toLowerCase());
      const filteredChildren = node.children
        .map(filter)
        .filter((c): c is TreeNode => c !== null);

      if (match || filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
      return null;
    };

    return (
      filter(tree) || { name: "root", isDir: true, fullPath: "", children: [] }
    );
  }, [tree, query]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Explorer search */}
      <div className="px-4 py-3 border-b border-border/40 shrink-0">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search files..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl bg-muted/40 border border-border/80 pl-9 pr-3 py-2 text-[12px] font-medium text-foreground outline-none transition-all duration-300 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 focus:bg-white placeholder:text-muted-foreground/60 shadow-inner-premium"
          />
        </div>
      </div>

      <div className="px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-lg bg-foreground/5 flex items-center justify-center">
            <Zap className="h-3 w-3 text-muted-foreground" />
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            Project Files
          </span>
        </div>
        <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10">
          {files.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-8 custom-scrollbar scroll-smooth">
        {filteredTree.children.map((child) => (
          <TreeItem
            key={child.fullPath}
            node={child}
            depth={0}
            selectedFile={selectedFile}
            onSelectFile={onSelectFile}
            expandedDirs={expandedDirs}
            toggleDir={toggleDir}
          />
        ))}

        {filteredTree.children.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-center animate-fade">
            <div className="h-10 w-10 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
              <Search className="h-5 w-5 text-muted-foreground/40" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              No matches found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
