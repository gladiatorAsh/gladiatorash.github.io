import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkCaseStudyPage } from "@/components/work-case-study";
import { caseStudies, getCaseStudy } from "@/lib/work";
import { profile } from "@/lib/portfolio";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  const url = `/work/${study.slug}/`;
  return {
    title: `${study.title} | ${profile.name}`,
    description: study.description,
    alternates: { canonical: url },
    openGraph: { title: study.title, description: study.description, url: `https://www.ashutoshysingh.com${url}`, type: "article" }
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();
  return <WorkCaseStudyPage study={study} />;
}
