import { ChevronDown } from "lucide-react";
import { timeline } from "@/lib/portfolio";

/**
 * Server-rendered accordion built on native <details>/<summary>:
 * zero client JavaScript, keyboard + screen-reader support for free, and the shared
 * `name` attribute keeps only one role open at a time in modern browsers.
 */
export function CareerTimeline() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute left-[0.88rem] top-3 h-[calc(100%-1.5rem)] w-px bg-white/10" />
      <div className="space-y-4">
        {timeline.map((item, index) => (
          <details
            key={`${item.company}-${item.role}`}
            name="career-timeline"
            open={index === 0}
            className="group relative pl-10"
          >
            <span
              aria-hidden="true"
              className="absolute left-0 top-4 h-7 w-7 rounded-full border border-white/15 bg-background transition group-open:border-azure group-open:shadow-[0_0_24px_rgba(0,120,212,0.38)]"
            />
            <summary className="focus-ring flex w-full cursor-pointer list-none flex-col gap-3 rounded-lg border border-white/10 bg-card/72 p-5 text-left transition hover:border-azure/40 group-open:rounded-b-none group-open:border-b-transparent sm:flex-row sm:items-start sm:justify-between [&::-webkit-details-marker]:hidden">
              <span>
                <span className="block text-lg font-semibold text-white">{item.role}</span>
                <span className="mt-1 block text-sm text-azure-light">
                  {item.company} · {item.context}
                </span>
              </span>
              <span className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-slate-400">
                {item.duration}
                <ChevronDown aria-hidden="true" className="h-4 w-4 transition group-open:rotate-180 group-open:text-azure-light" />
              </span>
            </summary>
            <div className="rounded-b-lg border border-t-0 border-white/10 bg-card/72 px-5 pb-5">
              <ul className="space-y-3 text-sm leading-6 text-slate-300">
                {item.achievements.map((achievement) => (
                  <li key={achievement} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-azure" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-md border border-white/10 bg-white/[0.03] p-4">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">Architecture</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.architecture}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.stack.map((tech) => (
                    <span key={tech} className="rounded-md border border-azure/20 bg-azure/10 px-2.5 py-1 font-mono text-xs text-slate-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
