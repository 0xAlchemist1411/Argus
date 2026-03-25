"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Loader2, Code2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ExplainSheet({
  open,
  onClose,
  repoId,
  functionName,
}: {
  open: boolean;
  onClose: () => void;
  repoId: string;
  functionName: string;
}) {
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleExplain() {
    if (!functionName) return;
    setLoading(true);
    try {
      const res = await api.post("/explain/function", {
        repoId,
        name: functionName,
      });
      setExplanation(res.data.explanation);
    } catch {
      setExplanation("Failed to generate explanation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="bg-white border-zinc-200 w-[400px] sm:max-w-[400px] shadow-2xl">
        <SheetHeader>
          <SheetTitle className="text-zinc-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            Explain Function
          </SheetTitle>
          <SheetDescription className="text-zinc-500">
            AI-powered code explanation
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <Code2 className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-zinc-700 font-mono">
              {functionName || "No function selected"}
            </span>
          </div>

          <Button
            onClick={handleExplain}
            disabled={loading || !functionName}
            className="w-full bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:brightness-110 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Explain
              </>
            )}
          </Button>

          {explanation && (
            <ScrollArea className="h-[400px]">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-7 text-zinc-700 prose-chat shadow-inner">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {explanation}
                </ReactMarkdown>
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
