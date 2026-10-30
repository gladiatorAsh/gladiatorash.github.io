import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { LearnHeader } from "@/components/learn-path";
import { learnPaths } from "@/lib/learn";
import { profile } from "@/lib/portfolio";

const description =
  "Study paths I put together for building production AI agents: MCP, MCP Apps and Skills, context engineering, A2A, evaluation, observability and security.";

export const metadata: Metadata = {
  title: `Learning paths | ${profile.name}`,
  description,
  alternates: { canonical: "/learn/" },
  openGraph: { title: "Learning paths", description, url: "https://www.ashutoshysingh.com/learn/", type: "website" }
};

export default function LearnIndex() {
  const weeks = learnPaths.reduce((n, p) => n + (parseInt(p.length, 10) || 0), 0);
  return (
    <>
      <LearnHeader crumb="Learn" back={{ href: "/", label: profile.name }} />
      <main id="main" className="mx-auto max-w-5xl px-4 pb-20 pt-28 md:px-10">
        <p className="mono m-0 text-graphite">
          Study notes · {learnPaths.length} paths · about {weeks} weeks in all
        </p>
        <h1 className="chapter-title mb-6 mt-3 !max-w-[20ch]">Learning paths</h1>
        <p className="measure m-0 text-[1.15rem] text-graphite">
          Courses I put together for building agents that hold up in production. Each one sequences the best free and paid material I could
          find, with labs, checkpoints and a capstone. They run roughly in this order: protocol first, then building, then operating.
        </p>

        <ol className="mt-14 list-none p-0">
          {learnPaths.map((p, i) => (
            <li key={p.slug} className="border-t border-rule last:border-b">
              <a href={`/learn/${p.slug}/`} className="group grid gap-x-8 gap-y-2 py-8 sm:grid-cols-[3rem_1fr_auto]">
                <span className="mono pt-1 text-graphite">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-[clamp(1.4rem,2.6vw,1.9rem)] font-[450] leading-[1.1] tracking-[-0.03em] group-hover:text-signal">
                    {p.title}
                  </span>
                  <span className="measure mt-2 block text-graphite">{p.summary}</span>
                </span>
                <span className="mono inline-flex items-center gap-2 self-start pt-1 text-graphite group-hover:text-ink">
                  {p.length}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </span>
              </a>
            </li>
          ))}
        </ol>

        <footer className="mt-20 border-t border-rule pt-8 text-graphite">
          <p className="mono m-0">
            Reviewed October 2026 ·{" "}
            <a className="link" href="/">
              {profile.name}
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}
