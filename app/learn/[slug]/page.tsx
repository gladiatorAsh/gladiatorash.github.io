import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LearnPathPage } from "@/components/learn-path";
import { getLearnPath, learnPaths } from "@/lib/learn";
import { profile } from "@/lib/portfolio";

export const dynamicParams = false;

export function generateStaticParams() {
  return learnPaths.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const path = getLearnPath((await params).slug);
  if (!path) return {};
  const url = `/learn/${path.slug}/`;
  return {
    title: `${path.title} | ${profile.name}`,
    description: path.description,
    alternates: { canonical: url },
    openGraph: { title: path.title, description: path.description, url: `https://www.ashutoshysingh.com${url}`, type: "article" }
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const path = getLearnPath((await params).slug);
  if (!path) notFound();
  return <LearnPathPage path={path} />;
}
