import RepoImportCard from "@/components/home/repo-import-card";
import RecentRepos from "@/components/home/recent-repos";
import {
  Code2,
  Sparkles,
  Workflow,
  Zap,
  Search,
  Brain,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Code2,
    title: "Repo Explorer",
    description:
      "Browse files, symbols, and summaries from a unified workspace with syntax highlighting.",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    icon: Sparkles,
    title: "AI Explainer",
    description:
      "Get file and function explanations in plain English. Understand any codebase fast.",
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
  },
  {
    icon: Workflow,
    title: "Context-Aware Chat",
    description:
      "Ask repo-specific questions powered by vector search and GPT. Sources always cited.",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
  },
];

const capabilities = [
  { icon: Search, label: "Semantic search" },
  { icon: Brain, label: "AI explanations" },
  { icon: Code2, label: "Code viewer" },
  { icon: Zap, label: "Fast indexing" },
];

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#F8F7F3]">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#F8F7F3]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,oklch(0.85_0.08_260_/_12%),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,oklch(0.85_0.08_310_/_6%),transparent_70%)]" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,oklch(0.85_0.08_180_/_5%),transparent_70%)]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(oklch(0.3 0 0 / 15%) 1px, transparent 1px), linear-gradient(90deg, oklch(0.3 0 0 / 15%) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Nav */}
      <nav className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/15">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            Argus
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com"
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            GitHub
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-20 relative z-10">
        <div className="grid gap-16 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
          {/* Left */}
          <div className="animate-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-700">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse-dot" />
              AI-powered codebase explorer
            </div>

            <h1 className="max-w-2xl text-5xl font-extrabold tracking-tight text-zinc-900 md:text-6xl lg:text-[4.25rem] leading-[1.08]">
              Understand any{" "}
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                repository
              </span>{" "}
              in minutes.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-500">
              Argus indexes your GitHub repos with AI, creating a searchable,
              explainable workspace. Browse files, ask questions, and get
              instant code insights.
            </p>

            {/* Capabilities row */}
            <div className="mt-8 flex flex-wrap gap-3">
              {capabilities.map((cap) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={cap.label}
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-500 shadow-sm"
                  >
                    <Icon className="h-3.5 w-3.5 text-zinc-400" />
                    {cap.label}
                  </div>
                );
              })}
            </div>

            {/* Import card */}
            <div className="mt-10">
              <RepoImportCard />
            </div>
          </div>

          {/* Right - Feature Cards */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
                    Platform
                  </div>
                  <div className="text-lg font-semibold text-zinc-900 mt-0.5">
                    Workspace Preview
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                  Live
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: "File tree", desc: "Browse & filter files" },
                  { label: "Code viewer", desc: "Syntax highlighted" },
                  { label: "Explain file", desc: "AI-powered analysis" },
                  { label: "Explain function", desc: "Deep code insight" },
                  { label: "Chat with repo", desc: "Natural language Q&A" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="group flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/50 px-4 py-3 transition-all duration-300 hover:bg-zinc-50 hover:border-zinc-200 hover:shadow-sm"
                  >
                    <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">
                      {item.label}
                    </span>
                    <span className="text-xs text-zinc-400 group-hover:text-zinc-500 transition-colors">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent repos */}
            <RecentRepos />
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-24 grid gap-5 sm:grid-cols-3 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-500 hover:border-zinc-300 hover:shadow-md"
              >
                {/* Gradient bg */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div className="relative">
                  <div className={`mb-4 inline-flex rounded-xl ${feature.iconBg} p-2.5`}>
                    <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200/60 py-8 mt-8">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <div className="text-xs text-zinc-400">
            Built by Alchemist · Powered by OpenAI
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-400">
            <Zap className="h-3 w-3" />
            Argus v1.0
          </div>
        </div>
      </footer>
    </main>
  );
}
