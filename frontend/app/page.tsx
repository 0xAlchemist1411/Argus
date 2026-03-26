import RepoImportCard from "@/components/home/repo-import-card";
import RecentRepos from "@/components/home/recent-repos";
import {
  Code2,
  Sparkles,
  Workflow,
  Zap,
  Search,
  Brain,
  MessageSquare,
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
    <main className="min-h-screen relative overflow-hidden bg-background">
      {/* Premium Background Background effects */}
      <div className="fixed inset-0 -z-10 bg-animated-gradient" />
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "10s" }}
        />
        {/* Subtle noise/grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Nav */}
      <nav className="mx-auto max-w-7xl px-6 py-8 flex items-center justify-between relative z-10 animate-fade">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-premium ring-2 ring-white/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span
            className="text-2xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Argus
          </span>
        </div>

        {/* Removed GitHub and Docs buttons as requested */}
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-24 relative z-10">
        <div className="grid gap-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          {/* Left */}
          <div className="animate-blur-in">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Revolutionizing Codebase Intelligence
            </div>

            <h1
              className="max-w-2xl text-6xl font-extrabold tracking-tight text-foreground md:text-7xl lg:text-[5rem] leading-[0.95] mb-8"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Index your repo. <br />
              <span className="bg-gradient-to-r from-primary via-violet-600 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Talk to your code.
              </span>
            </h1>

            <p className="max-w-xl text-xl leading-relaxed text-muted-foreground mb-10">
              Argus transforms your GitHub repositories into high-performance,
              AI-driven workspaces. Understand complex logic, find bugs, and
              navigate files with pure natural language.
            </p>

            {/* Import card container */}
            <div
              className="animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <RepoImportCard />
            </div>

            {/* Capabilities row */}
            <div className="mt-12 flex flex-wrap gap-4 opacity-70">
              {capabilities.map((cap) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={cap.label}
                    className="inline-flex items-center gap-2.5 text-sm font-medium text-muted-foreground"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {cap.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right - Platform Showcase */}
          <div
            className="animate-blur-in hidden lg:block"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-black/5">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mb-1">
                    Enterprise Suite
                  </div>
                  <div
                    className="text-2xl font-bold text-foreground"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Workspace Preview
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    label: "Semantic File Tree",
                    desc: "AI-indexed navigation",
                    icon: Brain,
                  },
                  {
                    label: "Deep Code Search",
                    desc: "Contextual results",
                    icon: Search,
                  },
                  {
                    label: "Smart Explainer",
                    desc: "Natural language insights",
                    icon: Sparkles,
                  },
                  {
                    label: "Interactive Chat",
                    desc: "Multi-file context",
                    icon: MessageSquare,
                  },
                ].map((item, idx) => (
                  <div
                    key={item.label}
                    className="group flex items-center justify-between rounded-2xl border border-transparent bg-white/60 p-4 transition-all duration-300 hover:border-primary/20 hover:bg-white hover:shadow-premium"
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors">
                        <item.icon className="h-4 w-4 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent section inside the showcase for better integration */}
              <div className="mt-8 pt-8 border-t border-black/5">
                <RecentRepos />
              </div>
            </div>
          </div>
        </div>

        {/* Features - Horizontal Scroll/Grid */}
        <div
          className="mt-32 grid gap-6 sm:grid-cols-3 animate-slide-up"
          style={{ animationDelay: "0.5s" }}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-3xl border border-border bg-white p-8 shadow-premium transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
              >
                <div
                  className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-3xl`}
                />
                <div className="relative z-10">
                  <div
                    className={`mb-6 inline-flex rounded-2xl ${feature.iconBg} p-3.5 ring-1 ring-black/5`}
                  >
                    <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <h3
                    className="text-xl font-bold text-foreground mb-3"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-white/50 backdrop-blur-md py-12 mt-20">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 opacity-60">
            <div className="h-8 w-8 rounded-xl bg-foreground flex items-center justify-center">
              <Zap className="h-4 w-4 text-background" />
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground">
              Argus
            </span>
          </div>

          <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Crafted for engineers · © 2026
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
