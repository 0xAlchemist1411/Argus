import RepoImportCard from "@/components/home/repo-import-card";
import { ArrowRight, Code2, Sparkles, Workflow } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Code2,
    title: "Repo Explorer",
    description: "Browse files, symbols, and summaries from one workspace.",
  },
  {
    icon: Sparkles,
    title: "AI Explainer",
    description: "Explain files, functions, and architecture in plain English.",
  },
  {
    icon: Workflow,
    title: "Context-Aware Chat",
    description: "Ask repo-specific questions with code-aware retrieval.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_30%),linear-gradient(to_bottom,#09090b,#111113)]">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div className="text-4xl font-bold tracking-wide text-zinc-300">
            Argus
          </div>
          <Link
            href="/repo/demo"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
          >
            Open demo workspace <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-10 pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
              AI codebase explorer
            </div>
            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-white md:text-6xl">
              Understand any repository in minutes.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
              Argus turns a GitHub repo into a searchable, explorable,
              explainable workspace. Browse files, ask questions, and inspect
              code with AI help.
            </p>

            <div className="mt-8">
              <RepoImportCard />
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-lg shadow-black/20 backdrop-blur"
                  >
                    <Icon className="h-5 w-5 text-blue-400" />
                    <h3 className="mt-3 font-medium text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-400">Workspace preview</div>
                <div className="text-xl font-semibold text-white">
                  Repo intelligence, polished
                </div>
              </div>
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                Live
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                "File tree",
                "Code viewer",
                "Explain file",
                "Explain function",
                "Chat with repo",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
