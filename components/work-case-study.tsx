import { LearnHeader } from "@/components/learn-path";
import { caseStudies, type WorkCaseStudy } from "@/lib/work";

function SectionHead({ id, n, title }: { id: string; n: string; title: string }) {
  return (
    <>
      <p className="mono m-0 text-graphite">{n}</p>
      <h2 id={id} className="m-0 mt-2 text-[clamp(1.6rem,3vw,2.3rem)] font-[450] leading-[1.05] tracking-[-0.035em]">
        {title}
      </h2>
    </>
  );
}

function Dash({ children }: { children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[1.1rem_1fr]">
      <span aria-hidden="true" className="mt-[0.8em] h-px w-2.5 bg-ink" />
      <span>{children}</span>
    </li>
  );
}

const sections = [
  { id: "problem", label: "Problem" },
  { id: "architecture", label: "Architecture" },
  { id: "decisions", label: "Decisions" },
  { id: "broke", label: "What broke" },
  { id: "results", label: "Results" }
];

export function WorkCaseStudyPage({ study }: { study: WorkCaseStudy }) {
  const others = caseStudies.filter((c) => c.slug !== study.slug);
  return (
    <>
      <LearnHeader crumb={`Work / ${study.title.split(":")[0]}`} back={{ href: "/work/", label: "All case studies" }} />

      <main id="main" className="mx-auto max-w-5xl px-4 pb-20 pt-28 md:px-10">
        <p className="mono m-0 text-graphite">{study.kicker}</p>
        <h1 className="chapter-title mb-6 mt-3 !max-w-[22ch]">{study.title}</h1>
        <p className="measure m-0 text-[1.15rem] text-graphite">{study.summary}</p>

        <dl className="mt-12 grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-3">
          {study.proof.map((p) => (
            <div key={p.label} className="flex flex-col-reverse bg-paper p-5">
              <dt className="mono m-0 mt-2 text-[0.8rem] text-graphite">{p.label}</dt>
              <dd className="m-0 text-[clamp(1.8rem,3.4vw,2.6rem)] font-[450] leading-none tracking-[-0.04em]">{p.value}</dd>
            </div>
          ))}
        </dl>

        <p className="measure mt-8 text-graphite">
          <span className="text-ink">My role:</span> {study.role}
        </p>

        <nav aria-label="Sections" className="mt-8 flex flex-wrap gap-2">
          {sections.map((s, i) => (
            <a key={s.id} className="key-btn" href={`#${s.id}`}>
              <span>{s.label}</span>
              <span className="key" aria-hidden="true">
                {i + 1}
              </span>
            </a>
          ))}
        </nav>

        <section className="mt-16 border-t border-rule pt-10" aria-labelledby="problem">
          <SectionHead id="problem" n="01" title="The problem" />
          <div className="measure mt-6 flex flex-col gap-4 text-[1.05rem] leading-[1.6]">
            {study.problem.map((p) => (
              <p key={p} className="m-0">
                {p}
              </p>
            ))}
          </div>
          <h3 className="mono m-0 mt-10 font-normal text-graphite">What I owned</h3>
          <ul className="measure m-0 mt-3 list-none space-y-2 p-0">
            {study.owned.map((o) => (
              <Dash key={o}>{o}</Dash>
            ))}
          </ul>
        </section>

        <section className="mt-16 border-t border-rule pt-10" aria-labelledby="architecture">
          <SectionHead id="architecture" n="02" title="How it works" />
          <ol className="m-0 mt-8 list-none p-0">
            {study.stages.map((s, i) => (
              <li key={s.name} className="grid grid-cols-[2.5rem_1fr] gap-x-4 sm:grid-cols-[3rem_11rem_1fr]">
                <span className="relative flex flex-col items-center">
                  <span className="mono flex h-9 w-9 items-center justify-center border border-ink bg-paper text-[0.8rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {i < study.stages.length - 1 ? <span aria-hidden="true" className="w-px flex-1 bg-rule" /> : null}
                </span>
                <span className="pt-1.5 font-medium sm:pb-8">{s.name}</span>
                <span className="col-start-2 pb-8 pt-1 text-graphite sm:col-start-3 sm:pt-1.5">{s.detail}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8 border-t border-rule pt-10" aria-labelledby="decisions">
          <SectionHead id="decisions" n="03" title="Key decisions" />
          <div className="mt-8 grid gap-px border border-rule bg-rule md:grid-cols-2">
            {study.decisions.map((d) => (
              <article key={d.choice} className="bg-paper p-6">
                <h3 className="m-0 text-[1.1rem] font-medium leading-[1.3] tracking-[-0.015em]">{d.choice}</h3>
                <p className="m-0 mt-3 text-[0.95rem] leading-[1.55]">{d.why}</p>
                <p className="m-0 mt-3 text-[0.9rem] leading-[1.5] text-graphite">
                  <span className="mono text-[0.78rem]">Tradeoff · </span>
                  {d.tradeoff}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-rule pt-10" aria-labelledby="broke">
          <SectionHead id="broke" n="04" title="What broke, and what we changed" />
          <ol className="m-0 mt-8 list-none space-y-8 p-0">
            {study.incidents.map((x, i) => (
              <li key={x.what} className="grid gap-x-8 gap-y-2 md:grid-cols-2">
                <p className="m-0 leading-[1.55]">
                  <span className="mono mr-2 text-graphite">{String(i + 1).padStart(2, "0")}</span>
                  {x.what}
                </p>
                <p className="m-0 border-l border-signal pl-4 leading-[1.55] text-graphite">{x.fix}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16 border-t border-rule pt-10" aria-labelledby="results">
          <SectionHead id="results" n="05" title="Results and lessons" />
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="mono m-0 font-normal text-graphite">Where it stands</h3>
              <ul className="m-0 mt-3 list-none space-y-2 p-0">
                {study.results.map((r) => (
                  <Dash key={r}>{r}</Dash>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mono m-0 font-normal text-graphite">What I&rsquo;d tell the next team</h3>
              <ul className="m-0 mt-3 list-none space-y-2 p-0">
                {study.lessons.map((l) => (
                  <Dash key={l}>{l}</Dash>
                ))}
              </ul>
            </div>
          </div>
          <ul className="mt-10 flex list-none flex-wrap gap-1.5 p-0" aria-label="Stack">
            {study.stack.map((s) => (
              <li key={s} className="tag">
                {s}
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-20 border-t border-rule pt-8 text-graphite">
          {others.map((o) => (
            <p key={o.slug} className="m-0">
              Next case study:{" "}
              <a className="link" href={`/work/${o.slug}/`}>
                {o.title}
              </a>
            </p>
          ))}
          <p className="mono m-0 mt-4">
            Client details are left out on purpose ·{" "}
            <a className="link" href="/#projects">
              Back to the portfolio
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}
