import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AnchorFix } from "@/components/anchor-fix";
import { DeferredPalette } from "@/components/deferred-palette";
import { Toaster } from "@/components/toaster";
import { themeInitScript } from "@/lib/client-events";
import { profile } from "@/lib/portfolio";

// Self-hosted variable fonts: no build-time call to Google Fonts, one file per family.
const hanken = localFont({
  src: "../node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2",
  variable: "--font-hanken",
  weight: "100 900",
  display: "swap"
});

const martian = localFont({
  src: "../node_modules/@fontsource-variable/martian-mono/files/martian-mono-latin-wght-normal.woff2",
  variable: "--font-martian",
  weight: "100 800",
  display: "swap"
});


export const metadata: Metadata = {
  title: "Ashutosh Singh | AI Engineer",
  description:
    "Ashutosh Singh, AI Engineer building enterprise AI systems with Azure OpenAI, RAG, multi-agent workflows, .NET, React, and Python.",
  metadataBase: new URL("https://www.ashutoshysingh.com"),
  // /resume, /projects, etc. render the same page; point search engines at one URL.
  alternates: { canonical: "/" },
  authors: [{ name: profile.name, url: "https://www.ashutoshysingh.com" }],
  openGraph: {
    title: "Ashutosh Singh | AI Engineer",
    description: "Enterprise AI systems, OpenAI, RAG, document intelligence, and agentic workflows.",
    url: "https://www.ashutoshysingh.com",
    siteName: "Ashutosh Singh",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Ashutosh Singh — AI Engineer building enterprise AI systems" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashutosh Singh | AI Engineer",
    description: "Enterprise AI systems, OpenAI, RAG, document intelligence, and agentic workflows.",
    images: ["/og.png"]
  }
};

export const viewport: Viewport = {
  themeColor: "#d6d7d3",
  colorScheme: "light dark"
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  url: "https://www.ashutoshysingh.com",
  sameAs: [profile.github, profile.linkedin],
  address: { "@type": "PostalAddress", addressLocality: "Santa Clara", addressRegion: "CA", addressCountry: "US" },
  alumniOf: "San Jose State University",
  knowsAbout: ["Azure OpenAI", "Retrieval-augmented generation", "Multi-agent systems", "Azure AI Search", ".NET", "Python", "React"]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${hanken.variable} ${martian.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        {children}
        <DeferredPalette />
        <Toaster />
        <AnchorFix />
      </body>
    </html>
  );
}
