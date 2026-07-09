"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { timeline } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

export function CareerTimeline() {
  const [open, setOpen] = useState(0);

  return (
    <div className="relative">
      <div className="absolute left-[0.88rem] top-3 h-[calc(100%-1.5rem)] w-px bg-white/10" />
      <div className="space-y-4">
        {timeline.map((item, index) => {
          const active = open === index;
          return (
            <article key={`${item.company}-${item.role}`} className="relative pl-10">
              <div className={cn("absolute left-0 top-4 h-7 w-7 rounded-full border bg-background", active ? "border-azure shadow-[0_0_24px_rgba(0,120,212,0.38)]" : "border-white/15")} />
              <button
                className="focus-ring w-full rounded-lg border border-white/10 bg-card/72 p-5 text-left transition hover:border-azure/40"
                onClick={() => setOpen(active ? -1 : index)}
              >
                <span className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <span>
                    <span className="block text-lg font-semibold text-white">{item.role}</span>
                    <span className="mt-1 block text-sm text-azure">{item.company} · {item.context}</span>
                  </span>
                  <span className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
                    {item.duration}
                    <ChevronDown className={cn("h-4 w-4 transition", active && "rotate-180 text-azure")} />
                  </span>
                </span>
                <div className={cn("grid transition-all duration-300", active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                  <div className="overflow-hidden">
                    <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                      {item.achievements.map((achievement) => (
                        <li key={achievement} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-azure" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 rounded-md border border-white/10 bg-white/[0.03] p-4">
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Architecture</p>
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
                </div>
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
