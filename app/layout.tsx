import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ScrollProgress } from "@/components/scroll-progress";
import { profile } from "@/lib/portfolio";

// Self-hosted variable fonts: no build-time call to Google Fonts, one file per family.
const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
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
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashutosh Singh | AI Engineer",
    description: "Enterprise AI systems, OpenAI, RAG, document intelligence, and agentic workflows."
  }
};

export const viewport: Viewport = {
  themeColor: "#0b1120",
  colorScheme: "dark"
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
    <html lang="en" className={inter.variable}>
      <body>
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-azure focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
