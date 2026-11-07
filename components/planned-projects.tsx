import { ArrowUpRight } from "lucide-react";
import { plannedProjects } from "@/lib/portfolio";

export function PlannedProjects() {
  return (
    <div id="planned" className="border-t border-rule pt-10">
      <p className="mono m-0 text-graphite">Planned · open source · MCP</p>
      <h3 className="m-0 mt-2 text-[clamp(1.5rem,2.8vw,2.1rem)] font-[450] leading-[1.05] tracking-[-0.035em]">Next on the bench</h3>
      <p className="measure mt-4 text-graphite">
        Three MCP projects built on the 2026-07-28 spec. They take what I learned building CAD agents at work and turn it into public,
        reusable tools. Each one is in an early build, with the code and the roadmap on GitHub.
      </p>

      <ol className="mt-8 grid list-none gap-px border border-rule bg-rule p-0 lg:grid-cols-3">
        {plannedProjects.map((p, i) => (
          <li key={p.title} className="flex flex-col bg-paper p-6">
            <div className="flex items-baseline justify-between gap-3">
              <span className="mono text-graphite">{String(i + 1).padStart(2, "0")}</span>
              <span className="mono border border-rule px-2 py-0.5 text-[0.72rem] text-graphite">{p.status}</span>
            </div>
            <h4 className="m-0 mt-4 text-[1.2rem] font-medium leading-[1.25] tracking-[-0.02em]">{p.title}</h4>
            <p className="m-0 mt-3 text-[0.96rem] leading-[1.55]">{p.goal}</p>
            <p className="m-0 mt-3 text-[0.92rem] leading-[1.5] text-graphite">
              <span className="mono text-[0.76rem]">Shows · </span>
              {p.shows}
            </p>
            <p className="m-0 mt-3 text-[0.92rem] leading-[1.5] text-graphite">
              <span className="mono text-[0.76rem]">Next · </span>
              {p.next}
            </p>
            <ul className="mt-5 flex list-none flex-wrap gap-1.5 p-0" aria-label="Stack">
              {p.stack.map((s) => (
                <li key={s} className="tag">
                  {s}
                </li>
              ))}
            </ul>
            <a className="link mt-auto inline-flex items-center gap-1 pt-6" href={p.repo} target="_blank" rel="noreferrer">
              Code and roadmap <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
