import type { ReactNode } from "react";
import type { Metadata } from "next";
import Providers from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Argus — AI Codebase Explorer",
  description:
    "Clone GitHub repositories, index them with semantic search, and ask natural language questions about your code. Powered by AI.",
  keywords: [
    "codebase explorer",
    "AI code analysis",
    "GitHub",
    "semantic search",
    "code chat",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-background text-foreground min-h-screen selection:bg-primary/10 selection:text-primary font-sans"
        style={{ fontFamily: "'Inter', 'Outfit', Arial, sans-serif" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
