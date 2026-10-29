import { Plus } from "lucide-react";
import { timeline } from "@/lib/portfolio";

/**
 * Server-rendered accordion on native <details>: no client JavaScript, keyboard and screen-reader
 * support for free. The shared `name` keeps one role open at a time in modern browsers.
 */
export function CareerTimeline() {
  return (
    <div className="border-b border-rule">
      {timeline.map((item, index) => (
        <details key={`${item.company}-${item.role}`} name="career-timeline" open={index === 0} className="group border-t border-rule">
          <summary className="row-summary grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-5 md:grid-cols-[12rem_minmax(0,1fr)_auto]">
            <span className="mono text-graphite md:pt-1">{item.duration}</span>
            <span className="col-start-1 md:col-start-2">
              <span className="block text-xl tracking-[-0.02em]">{item.role}</span>
              <span className="block">{item.company}</span>
              <span className="block text-graphite">{item.context}</span>
            </span>
            <Plus aria-hidden="true" className="row-toggle col-start-2 row-span-2 row-start-1 h-4 w-4 self-center text-graphite md:col-start-3 md:row-span-1" />
          </summary>
          <div className="grid gap-8 pb-8 md:grid-cols-[12rem_minmax(0,1fr)]">
            <div className="hidden md:block" />
            <div>
              <ul className="measure list-none space-y-3 p-0">
                {item.achievements.map((achievement) => (
                  <li key={achievement} className="grid grid-cols-[1rem_1fr]">
                    <span aria-hidden="true" className="mt-[0.8em] h-px w-2 bg-ink" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
              <p className="read-technical measure mt-6 text-graphite">{item.architecture}</p>
              <ul className="mt-5 flex list-none flex-wrap gap-1.5 p-0" aria-label="Stack">
                {item.stack.map((tech) => (
                  <li key={tech} className="tag">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
