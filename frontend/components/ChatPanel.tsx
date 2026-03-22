"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function ChatPanel({ repoId }: { repoId: string }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<string[]>([]);

  async function handleAsk() {
    const res = await api.post("/chat", {
      repoId,
      question,
    });

    console.log(res.data); // 👈 debug

    setAnswer(res.data.answer);        // ✅ MUST be .answer
    setSources(res.data.sources || []);
  }

  return (
    <div className="p-4 flex flex-col gap-2">

      <textarea
        className="border p-2"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={handleAsk} className="bg-black text-white p-2">
        Ask
      </button>

      {/* ✅ ONLY STRING HERE */}
      <div className="mt-4 text-sm whitespace-pre-wrap">
        {answer}
      </div>

      {/* sources */}
      {sources.length > 0 && (
        <div className="text-xs mt-2">
          {sources.map((s, i) => (
            <div key={i}>{s}</div>
          ))}
        </div>
      )}

    </div>
  );
}