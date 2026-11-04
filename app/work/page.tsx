import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { LearnHeader } from "@/components/learn-path";
import { caseStudies } from "@/lib/work";
import { profile } from "@/lib/portfolio";

const description = "Long-form case studies of production AI systems I led: the problem, the architecture, the decisions and what broke.";

export const metadata: Metadata = {
  title: `Case studies | ${profile.name}`,
  description,
  alternates: { canonical: "/work/" },
  openGraph: { title: "Case studies", description, url: "https://www.ashutoshysingh.com/work/", type: "website" }
};

export default function WorkIndex() {
  return (
    <>
      <LearnHeader crumb="Work" back={{ href: "/", label: profile.name }} />
      <main id="main" className="mx-auto max-w-5xl px-4 pb-20 pt-28 md:px-10">
        <p className="mono m-0 text-graphite">Case studies · {caseStudies.length} production systems</p>
        <h1 className="chapter-title mb-6 mt-3 !max-w-[20ch]">Case studies</h1>
        <p className="measure m-0 text-[1.15rem] text-graphite">
          The longer story behind the systems on my portfolio: what the problem was, how the system works, the decisions and their
          tradeoffs, and what broke along the way.
        </p>

        <ol className="mt-14 list-none p-0">
          {caseStudies.map((c, i) => (
            <li key={c.slug} className="border-t border-rule last:border-b">
              <a href={`/work/${c.slug}/`} className="group grid gap-x-8 gap-y-2 py-8 sm:grid-cols-[3rem_1fr_auto]">
                <span className="mono pt-1 text-graphite">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-[clamp(1.4rem,2.6vw,1.9rem)] font-[450] leading-[1.1] tracking-[-0.03em] group-hover:text-signal">
                    {c.title}
                  </span>
                  <span className="measure mt-2 block text-graphite">{c.summary}</span>
                </span>
                <span className="mono inline-flex items-center gap-2 self-start pt-1 text-graphite group-hover:text-ink">
                  {c.period}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </span>
              </a>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
