import { LearnHeader } from "@/components/learn-path";
import { ScoreTracker, WeekPlan } from "@/components/ielts-widgets";
import { clbTable, rawToBand, resources, skills, testDayChecklist, type Plan, type Skill } from "@/lib/ielts/types";

const last = (b: Plan["baseline"][number]) => b.scores[b.scores.length - 1];

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-24 scroll-mt-20">
      <p className="mono m-0 text-graphite">{kicker}</p>
      <h2 className="m-0 mt-2 text-[clamp(1.7rem,3.4vw,2.6rem)] font-[450] leading-[1.05] tracking-[-0.035em]">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

const nav = [
  ["target", "Target"],
  ["start", "Starting point"],
  ["timeline", "Timeline"],
  ["weeks", "Weeks"],
  ["daily", "Daily routine"],
  ["skills", "Skills"],
  ["scores", "Raw scores"],
  ["resources", "Resources"],
  ["testday", "Test day"],
  ["tracker", "Tracker"]
];

export function IeltsPlanView({ plan }: { plan: Plan }) {
  const targetBands = Object.fromEntries(skills.map((s) => [s, plan.targets[s].band])) as Record<Skill, string>;
  return (
    <>
      <LearnHeader crumb={plan.crumb} back={{ href: "/", label: "Home" }} />
      <main id="main" className="mx-auto max-w-6xl px-4 pb-24 pt-28 md:px-10">
        {/* Hero */}
        <p className="mono m-0 text-graphite">{plan.kicker}</p>
        <h1 className="chapter-title mb-6 mt-3 !max-w-[18ch]">{plan.title}</h1>
        <p className="measure m-0 text-[1.15rem] text-graphite">{plan.intro}</p>

        <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-2">
          {nav.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="mono border border-rule px-3 py-1.5 text-graphite hover:border-ink hover:text-ink">
              {label}
            </a>
          ))}
        </nav>

        {/* Target cards */}
        <Section id="target" kicker="01 · The goal" title={`Target: ${plan.targetClb} in every skill`}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((s) => (
              <div key={s} className="border border-rule bg-paper-2 p-5">
                <p className="mono m-0 text-graphite">{s}</p>
                <p className="m-0 mt-2 text-[3rem] font-[450] leading-none tracking-[-0.04em] text-signal">{plan.targets[s].band}</p>
                <p className="mono m-0 mt-3 text-graphite">{plan.targets[s].raw ? `${plan.targets[s].raw} correct` : "examiner-marked"}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="border border-rule p-5">
              <p className="mono m-0 text-signal">Right test</p>
              <p className="m-0 mt-2">
                <strong>IELTS General Training</strong> only. Academic and the One Skill Retake aren&apos;t accepted for Express Entry.
              </p>
            </div>
            <div className="border border-rule p-5">
              <p className="mono m-0 text-signal">Scored per skill</p>
              <p className="m-0 mt-2">Canada converts each skill to a CLB level separately. The overall band doesn&apos;t count.</p>
            </div>
            <div className="border border-rule p-5">
              <p className="mono m-0 text-signal">Valid 2 years</p>
              <p className="m-0 mt-2">From the test date. It must still be valid when the PR application is filed.</p>
            </div>
          </div>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <thead>
                <tr className="mono text-graphite">
                  {["Level", "Listening", "Reading", "Writing", "Speaking", ""].map((h) => (
                    <th key={h} className="border-b border-rule py-2 pr-4 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clbTable.map((r) => (
                  <tr key={r.clb} className={r.clb === plan.targetClb ? "text-signal" : ""}>
                    <td className="border-b border-rule py-3 pr-4 font-medium">{r.clb}</td>
                    <td className="border-b border-rule py-3 pr-4">{r.L}</td>
                    <td className="border-b border-rule py-3 pr-4">{r.R}</td>
                    <td className="border-b border-rule py-3 pr-4">{r.W}</td>
                    <td className="border-b border-rule py-3 pr-4">{r.S}</td>
                    <td className="border-b border-rule py-3 pr-4 text-graphite">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Baseline */}
        <Section id="start" kicker="02 · Where things stand" title={plan.baselineTitle}>
          <div className="grid gap-4 md:grid-cols-2">
            {plan.baseline.map((b) => (
              <div key={b.skill} className="border border-rule bg-paper-2 p-5">
                <div className="flex items-center justify-between">
                  <p className="mono m-0 text-graphite">{b.skill}</p>
                  <span
                    className={`mono border px-2 py-0.5 ${b.priority === "High" ? "border-signal text-signal" : "border-rule text-graphite"}`}
                  >
                    {b.priority} priority
                  </span>
                </div>
                <p className="m-0 mt-3 flex items-baseline gap-3">
                  {b.scores.slice(0, -1).map((sc) => (
                    <span key={sc.label} className="text-[1.4rem] text-graphite line-through decoration-1">
                      {sc.value}
                    </span>
                  ))}
                  <span className="text-[2.6rem] font-[450] leading-none tracking-[-0.04em]">{last(b).value}</span>
                  <span className="mono text-graphite">/30</span>
                  {b.scores.length > 1 ? (
                    <span className="mono text-signal">
                      {last(b).value - b.scores[0].value > 0 ? `+${last(b).value - b.scores[0].value}` : "±0"}
                    </span>
                  ) : null}
                </p>
                <div className="mt-3 h-1.5 w-full bg-paper" aria-hidden="true">
                  <div className="h-1.5 bg-ink" style={{ width: `${(last(b).value / 30) * 100}%` }} />
                </div>
                <p className="m-0 mt-3 text-graphite">{b.read}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3 border-l-2 border-signal pl-5">
            {plan.baselineNote.map((t) => (
              <p key={t} className="measure m-0">
                {t}
              </p>
            ))}
          </div>
        </Section>

        {/* Timeline */}
        <Section id="timeline" kicker="03 · The shape" title="Timeline">
          <ol style={{ ["--n" as string]: plan.phases.length }} className="relative list-none border-l border-rule p-0 pl-8 md:grid md:grid-cols-[repeat(var(--n),minmax(0,1fr))] md:border-l-0 md:border-t md:pl-0 md:pt-8">
            {plan.phases.map((p) => (
              <li key={p.id} className="relative pb-10 md:pb-0 md:pr-5">
                <span
                  aria-hidden="true"
                  className={`absolute -left-[2.35rem] top-1 h-3 w-3 rounded-full md:-top-[2.4rem] md:left-0 ${p.id === "T" ? "bg-signal" : "bg-ink"}`}
                />
                <p className="mono m-0 text-graphite">{p.weeks}</p>
                <h3 className={`m-0 mt-1 text-[1.25rem] font-[500] tracking-[-0.02em] ${p.id === "T" ? "text-signal" : ""}`}>{p.name}</h3>
                <p className="mono m-0 mt-1 text-graphite">{p.hours}</p>
                <p className="m-0 mt-2 text-[0.95rem] text-graphite">{p.goal}</p>
              </li>
            ))}
          </ol>
          <p className="mono mt-6 text-graphite">{plan.timelineNote}</p>
        </Section>

        {/* Week cards */}
        <Section id="weeks" kicker="04 · The plan" title="Week by week">
          <WeekPlan weeks={plan.weeks} phases={plan.phases} storageKey={plan.storageKey} />
        </Section>

        {/* Daily template */}
        <Section id="daily" kicker="05 · Every week" title="Daily routine">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {plan.dailyTemplate.map((d) => (
              <div key={d.day} className={`border border-rule p-4 ${d.day === "Sun" ? "" : "bg-paper-2"}`}>
                <p className="mono m-0 text-signal">{d.day}</p>
                <p className="m-0 mt-2 text-[0.95rem] font-medium">{d.main}</p>
                <p className="m-0 mt-2 border-t border-rule pt-2 text-[0.9rem] text-graphite">+ {d.short}</p>
              </div>
            ))}
          </div>
          <p className="mono mt-4 text-graphite">
            {plan.dailyNote}
          </p>
        </Section>

        {/* Skill cards */}
        <Section id="skills" kicker="06 · How to score" title="Skill by skill">
          <div className="grid gap-6 lg:grid-cols-2">
            {plan.skillCards.map((c) => (
              <article key={c.skill} className="border border-rule bg-paper-2 p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="m-0 text-[1.6rem] font-[450] tracking-[-0.03em]">{c.skill}</h3>
                  <span className="mono text-signal">Target {plan.targets[c.skill].band}</span>
                </div>
                {c.vsToefl ? (
                  <p className="m-0 mt-4 border-l-2 border-signal pl-3 text-[0.95rem]">
                    <span className="mono text-signal">vs TOEFL · </span>
                    {c.vsToefl}
                  </p>
                ) : null}
                <p className="mono m-0 mt-5 text-graphite">Format</p>
                <ul className="m-0 mt-2 pl-5 text-[0.95rem] text-graphite">
                  {c.format.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className="mono m-0 mt-5 text-graphite">Strategy</p>
                <ul className="m-0 mt-2 pl-5 text-[0.95rem]">
                  {c.strategies.map((f) => (
                    <li key={f} className="mt-1">
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mono m-0 text-signal">Do daily</p>
                    <ul className="m-0 mt-2 pl-5 text-[0.92rem]">
                      {c.daily.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mono m-0 text-graphite">Avoid</p>
                    <ul className="m-0 mt-2 pl-5 text-[0.92rem] text-graphite">
                      {c.traps.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* Raw scores */}
        <Section id="scores" kicker="07 · Marking practice tests" title="Raw score → band">
          <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="mono text-graphite">
                    <th className="border-b border-rule py-2 pr-4 font-normal">Band</th>
                    <th className="border-b border-rule py-2 pr-4 font-normal">Listening /40</th>
                    <th className="border-b border-rule py-2 pr-4 font-normal">GT Reading /40</th>
                  </tr>
                </thead>
                <tbody>
                  {rawToBand.map((r) => (
                    <tr key={r.band} className={r.band === plan.targets.Listening.band || r.band === plan.targets.Reading.band ? "text-signal" : ""}>
                      <td className="border-b border-rule py-2.5 pr-4 font-medium">{r.band}</td>
                      <td className="border-b border-rule py-2.5 pr-4">{r.listening}</td>
                      <td className="border-b border-rule py-2.5 pr-4">{r.reading}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-graphite">
              <p className="m-0">
                Approximate, and it shifts slightly from test to test. Use it to turn practice-test scores into bands for the tracker.
              </p>
              <p className="m-0 mt-4">
                Highlighted rows are the target bands. General Training Reading is marked strictly: Listening {plan.targets.Listening.band} needs{" "}
                {plan.targets.Listening.raw} and Reading {plan.targets.Reading.band} needs {plan.targets.Reading.raw}.
              </p>
              <p className="m-0 mt-4">
                Writing and Speaking are marked by examiners on four criteria each. Use the official band descriptors to mark them.
              </p>
            </div>
          </div>
        </Section>

        {/* Resources */}
        <Section id="resources" kicker="08 · What to use" title="Resources">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => {
              const body = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <p className="m-0 font-medium">{r.name}</p>
                    <span className={`mono shrink-0 ${r.cost === "Free" ? "text-signal" : "text-graphite"}`}>{r.cost}</span>
                  </div>
                  <p className="m-0 mt-2 text-[0.95rem] text-graphite">{r.use}</p>
                </>
              );
              return r.href ? (
                <a key={r.name} href={r.href} target="_blank" rel="noreferrer" className="block border border-rule bg-paper-2 p-5 hover:border-ink">
                  {body}
                </a>
              ) : (
                <div key={r.name} className="border border-rule bg-paper-2 p-5">
                  {body}
                </div>
              );
            })}
          </div>
        </Section>

        {/* Test day */}
        <Section id="testday" kicker="09 · Logistics" title="Booking & test day">
          <ul className="m-0 list-none space-y-3 p-0">
            {testDayChecklist.map((t) => (
              <li key={t} className="flex gap-3 border-b border-rule pb-3">
                <span className="mono text-signal">→</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {plan.alternatives.map((a) => (
              <div key={a.title} className="border border-rule p-5">
                <p className="mono m-0 text-signal">{a.title}</p>
                <p className="m-0 mt-2 text-graphite">{a.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Tracker */}
        <Section id="tracker" kicker="10 · Progress" title="Score tracker">
          <ScoreTracker storageKey={plan.storageKey} targets={targetBands} />
        </Section>

        <footer className="mt-24 border-t border-rule pt-8 text-graphite">
          <p className="mono m-0">
            Weeks are relative, not calendar dates. Before booking, check the current IELTS-to-CLB table and accepted tests on IRCC&apos;s &ldquo;Express
            Entry: Language test results&rdquo; page (canada.ca).
          </p>
        </footer>
      </main>
    </>
  );
}
