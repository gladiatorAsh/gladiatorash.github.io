import type { Metadata } from "next";
import { LearnHeader } from "@/components/learn-path";
import { ScoreTracker, WeekPlan } from "@/components/ielts-plan";
import {
  baseline,
  clbTable,
  dailyTemplate,
  phases,
  rawToBand,
  resources,
  skillCards,
  skills,
  targets,
  testDayChecklist
} from "@/lib/ielts-plan";

// Unlisted: not in the sitemap or nav, and kept out of search results.
export const metadata: Metadata = {
  title: "IELTS General Training study plan",
  description: "A 16-week IELTS General Training plan for Canada Express Entry.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: "/study/ielts-gt/" }
};

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
  ["weeks", "16 weeks"],
  ["daily", "Daily routine"],
  ["skills", "Skills"],
  ["scores", "Raw scores"],
  ["resources", "Resources"],
  ["testday", "Test day"],
  ["tracker", "Tracker"]
];

export default function IeltsPlanPage() {
  return (
    <>
      <LearnHeader crumb="Study · IELTS General Training" back={{ href: "/", label: "Home" }} />
      <main id="main" className="mx-auto max-w-6xl px-4 pb-24 pt-28 md:px-10">
        {/* Hero */}
        <p className="mono m-0 text-graphite">16 weeks · Nov 23, 2026 → mid-March 2027 · Canada Express Entry</p>
        <h1 className="chapter-title mb-6 mt-3 !max-w-[18ch]">IELTS General Training study plan</h1>
        <p className="measure m-0 text-[1.15rem] text-graphite">
          From TOEFL 80 to CLB 9. About 1–2 hours a day, built around the two sections that need the most work (Reading and Listening),
          with a test booked for March and a buffer for a retake before the mid-2027 move.
        </p>

        <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-2">
          {nav.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="mono border border-rule px-3 py-1.5 text-graphite hover:border-ink hover:text-ink">
              {label}
            </a>
          ))}
        </nav>

        {/* Target cards */}
        <Section id="target" kicker="01 · The goal" title="Target: CLB 9 in every skill">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((s) => (
              <div key={s} className="border border-rule bg-paper-2 p-5">
                <p className="mono m-0 text-graphite">{s}</p>
                <p className="m-0 mt-2 text-[3rem] font-[450] leading-none tracking-[-0.04em] text-signal">{targets[s].band}</p>
                <p className="mono m-0 mt-3 text-graphite">{targets[s].raw ? `${targets[s].raw} correct` : "examiner-marked"}</p>
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
                  <tr key={r.clb} className={r.clb === "CLB 9" ? "text-signal" : ""}>
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
        <Section id="start" kicker="02 · Where she is" title="Starting point: TOEFL iBT, 2023">
          <div className="grid gap-4 md:grid-cols-2">
            {baseline.map((b) => (
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
                  <span className="text-[1.4rem] text-graphite line-through decoration-1">{b.oct}</span>
                  <span className="text-[2.6rem] font-[450] leading-none tracking-[-0.04em]">{b.nov}</span>
                  <span className="mono text-graphite">/30</span>
                  <span className="mono text-signal">{b.nov - b.oct > 0 ? `+${b.nov - b.oct}` : "±0"}</span>
                </p>
                <div className="mt-3 h-1.5 w-full bg-paper" aria-hidden="true">
                  <div className="h-1.5 bg-ink" style={{ width: `${(b.nov / 30) * 100}%` }} />
                </div>
                <p className="m-0 mt-3 text-graphite">{b.read}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 border-l-2 border-signal pl-5">
            <p className="measure m-0">
              Total went from <strong>63 → 80</strong> in two weeks (Oct 28 → Nov 11, 2023), so focused prep works for her. The scores are
              three years old and TOEFL doesn&apos;t map neatly onto IELTS, so <strong>week 1 is a fresh IELTS diagnostic</strong>. Adjust the
              hours once real bands are in.
            </p>
          </div>
        </Section>

        {/* Timeline */}
        <Section id="timeline" kicker="03 · The shape" title="Timeline">
          <ol className="relative list-none border-l border-rule p-0 pl-8 md:grid md:grid-cols-6 md:border-l-0 md:border-t md:pl-0 md:pt-8">
            {phases.map((p) => (
              <li key={p.id} className="relative pb-10 md:pb-0 md:pr-5">
                <span
                  aria-hidden="true"
                  className={`absolute -left-[2.35rem] top-1 h-3 w-3 rounded-full md:-top-[2.4rem] md:left-0 ${p.id === "T" ? "bg-signal" : "bg-ink"}`}
                />
                <p className="mono m-0 text-graphite">{p.dates}</p>
                <h3 className={`m-0 mt-1 text-[1.25rem] font-[500] tracking-[-0.02em] ${p.id === "T" ? "text-signal" : ""}`}>{p.name}</h3>
                <p className="mono m-0 mt-1 text-graphite">{p.hours}</p>
                <p className="m-0 mt-2 text-[0.95rem] text-graphite">{p.goal}</p>
              </li>
            ))}
          </ol>
          <p className="mono mt-6 text-graphite">Weeks 1–5 can be done from Mumbai. Book the test in week 11 (early Feb).</p>
        </Section>

        {/* Week cards */}
        <Section id="weeks" kicker="04 · The plan" title="Week by week">
          <WeekPlan />
        </Section>

        {/* Daily template */}
        <Section id="daily" kicker="05 · Every week" title="Daily routine">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {dailyTemplate.map((d) => (
              <div key={d.day} className={`border border-rule p-4 ${d.day === "Sun" ? "" : "bg-paper-2"}`}>
                <p className="mono m-0 text-signal">{d.day}</p>
                <p className="m-0 mt-2 text-[0.95rem] font-medium">{d.main}</p>
                <p className="m-0 mt-2 border-t border-rule pt-2 text-[0.9rem] text-graphite">+ {d.short}</p>
              </div>
            ))}
          </div>
          <p className="mono mt-4 text-graphite">
            Main block 45–60 min · short block 20–30 min. In weeks 12–15, two weekdays become full mocks (Listening → Reading → Writing).
          </p>
        </Section>

        {/* Skill cards */}
        <Section id="skills" kicker="06 · How to score" title="Skill by skill">
          <div className="grid gap-6 lg:grid-cols-2">
            {skillCards.map((c) => (
              <article key={c.skill} className="border border-rule bg-paper-2 p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="m-0 text-[1.6rem] font-[450] tracking-[-0.03em]">{c.skill}</h3>
                  <span className="mono text-signal">Target {targets[c.skill].band}</span>
                </div>
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
                    <tr key={r.band} className={r.band === "8.0" || r.band === "7.0" ? "text-signal" : ""}>
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
                Note how strict General Training Reading is: a 7.0 needs about 34 of 40 right, and 8.0 in Listening needs about 35.
                That&apos;s why both get the most time in the plan.
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
            <div className="border border-rule p-5">
              <p className="mono m-0 text-signal">Plan B: CELPIP General</p>
              <p className="m-0 mt-2 text-graphite">
                Also accepted for Canada. Fully computer-based, Canadian English, one sitting of about 3 hours, offered in the US. If Reading
                is still below 6.0 in week 11, try a free CELPIP practice test before booking.
              </p>
            </div>
            <div className="border border-rule p-5">
              <p className="mono m-0 text-signal">Plan C: PTE Core</p>
              <p className="m-0 mt-2 text-graphite">
                The newest accepted English test. Computer-scored, results in a few days. Worth a look if IELTS speaking with a live examiner
                turns out to be stressful.
              </p>
            </div>
          </div>
        </Section>

        {/* Tracker */}
        <Section id="tracker" kicker="10 · Progress" title="Score tracker">
          <ScoreTracker />
        </Section>

        <footer className="mt-24 border-t border-rule pt-8 text-graphite">
          <p className="mono m-0">
            Plan written November 2026. Before booking, check the current IELTS-to-CLB table and accepted tests on IRCC&apos;s &ldquo;Express
            Entry: Language test results&rdquo; page (canada.ca).
          </p>
        </footer>
      </main>
    </>
  );
}
