import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ScrollProgress } from "@/components/scroll-progress";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const jetBrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Ashutosh Singh | Lead Azure AI Engineer",
  description:
    "Premium portfolio for Ashutosh Singh, Lead Azure AI Engineer building enterprise AI systems with Azure OpenAI, RAG, .NET, React, and Python.",
  metadataBase: new URL("https://www.ashutoshysingh.com"),
  openGraph: {
    title: "Ashutosh Singh | Lead Azure AI Engineer",
    description: "Enterprise AI systems, Azure OpenAI, RAG, document intelligence, and agentic workflows.",
    url: "https://www.ashutoshysingh.com",
    siteName: "Ashutosh Singh",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashutosh Singh | Lead Azure AI Engineer",
    description: "Enterprise AI systems, Azure OpenAI, RAG, document intelligence, and agentic workflows."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetBrains.variable}`}>
      <body>
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
