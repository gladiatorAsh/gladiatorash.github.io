import { ArrowUpRight } from "lucide-react";
import { ArchitectureGallery } from "@/components/architecture-gallery";
import { CareerTimeline } from "@/components/career-timeline";
import { Citadel, SceneDirector } from "@/components/citadel";
import { CopyEmailButton } from "@/components/copy-email-button";
import { ReadingToggle, TopBar } from "@/components/top-bar";
import { agentAnchor, projectAnchor } from "@/lib/citadel";
import {
  agenticProjects,
  certifications,
  education,
  navItems,
  profile,
  projects,
  skillGroups,
  testimonials
} from "@/lib/portfolio";

const total = navItems.length;

export default function Home() {
  return (
    <>
      <TopBar />
      <div className="lg:grid lg:grid-cols-[minmax(0,46rem)_minmax(0,1fr)]">
        {/* The citadel stays in view while the page scrolls past it. */}
        <div className="sticky top-14 z-20 h-[38svh] border-b border-rule bg-paper lg:order-2 lg:h-[calc(100svh-3.5rem)] lg:border-b-0 lg:border-l">
          <Citadel />
        </div>

        <main id="main" className="min-w-0 lg:order-1">
          <Hero />

          <Chapter id="agents" title="New: agents I build">
            <p className="measure text-graphite">
              Personal systems from this year. I design them and build them with AI coding agents doing much of the typing, and they
              run every day on free infrastructure. They live in the workshop quarter, east of the keep. Read them in{" "}
              <em className="not-italic text-ink">plain English</em> or <em className="not-italic text-ink">technical</em> with keys 1 and 2.
            </p>
            <div className="mt-10">
              {agenticProjects.map((project, i) => (
                <AgentProject key={project.title} project={project} index={i} />
              ))}
            </div>
          </Chapter>

          <Chapter id="projects" title="Engineered by hand">
            <p className="measure text-graphite">
              Production systems I designed and wrote with my teams, from 2012 to today: the architecture, the code and the late-night
              fixes were ours. They make up the old town, west of the keep.
            </p>
            <div className="mt-10">
              {projects.map((project) => (
                <CaseStudy key={project.title} project={project} />
              ))}
            </div>
          </Chapter>

          <Chapter id="resume" title="Where I've worked">
            <p className="measure mb-8 text-graphite">Each employer is a tower on the wall, oldest beside the gate.</p>
            <CareerTimeline />
          </Chapter>

          <Chapter id="architecture" title="Systems, with the tradeoffs shown">
            <p className="measure mb-8 text-graphite">
              Pick a system, then a stage, to see why each part was chosen, what it costs and how it is secured.
            </p>
            <ArchitectureGallery />
          </Chapter>

          <Chapter id="testimonials" title="What colleagues say">
            <ul className="list-none p-0">
              {testimonials.map((t) => (
                <li key={t.name} className="border-t border-rule py-7">
                  <blockquote className="m-0">
                    <p className="measure m-0 text-[1.02rem] leading-[1.65]">{t.quote}</p>
                    <footer className="mt-4">
                      <p className="m-0 font-medium">{t.name}</p>
                      <p className="mono m-0 text-graphite">{t.title}</p>
                    </footer>
                  </blockquote>
                </li>
              ))}
            </ul>
          </Chapter>

          <Chapter id="skills" title="Tools I use">
            <dl className="m-0">
              {Object.entries(skillGroups).map(([group, skills]) => (
                <div key={group} className="grid grid-cols-[7rem_1fr] gap-4 border-t border-rule py-5">
                  <dt className="font-medium">{group}</dt>
                  <dd className="m-0 text-graphite">{skills.join(", ")}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <div>
                <h3 className="m-0 text-xl font-medium tracking-[-0.02em]">Certifications</h3>
                <ul className="mt-4 list-none space-y-2 p-0 text-graphite">
                  {certifications.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="m-0 text-xl font-medium tracking-[-0.02em]">Education</h3>
                <ul className="mt-4 list-none space-y-2 p-0 text-graphite">
                  {education.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-12 text-graphite">
              Keeping up: I read new research through{" "}
              <a className="link" href="/papers/">
                Paper Desk
              </a>
              , one of the agents above.
            </p>
          </Chapter>

          <Chapter id="contact" title="Let's build AI that holds up in production">
            <p className="measure text-graphite">
              I'm in {profile.location}, working on enterprise AI: retrieval, agent workflows, Azure architecture and the full-stack apps
              around them. The quickest way to reach me is email.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-8 inline-block break-all text-[clamp(1.3rem,3.4vw,2.2rem)] tracking-[-0.03em] underline decoration-rule decoration-1 underline-offset-[0.18em] hover:decoration-ink"
            >
              {profile.email}
            </a>
            <div className="mt-8 flex flex-wrap gap-3">
              <CopyEmailButton email={profile.email} variant="button" className="key-btn !h-auto !rounded-none !bg-transparent !shadow-none" />
              <a className="key-btn" href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <a className="key-btn" href={profile.github} target="_blank" rel="noreferrer">
                GitHub <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <a className="key-btn" href="/assets/files/Resume.pdf" download="Ashutosh-Singh-Resume.pdf">
                Download resume
              </a>
            </div>
          </Chapter>

          <footer className="border-t border-rule px-4 py-8 text-graphite md:px-10">
            <p className="mono m-0">© {new Date().getFullYear()} {profile.name}. Static site, rebuilt daily with the latest papers.</p>
          </footer>
        </main>
      </div>
      <SceneDirector />
    </>
  );
}

function Hero() {
  return (
    <section id="home" data-scene="home" className="px-4 pb-14 pt-10 md:px-10 lg:pt-16">
      <div className="border-t border-ink pt-3">
        <h1 className="wordmark m-0">
          Ashutosh
          <br />
          Singh
        </h1>
        <p className="mono mt-4 text-graphite">Applied AI engineer. Retrieval, agents and the platforms around them.</p>
      </div>
      <p className="measure mt-10 text-[1.08rem] leading-[1.6]">
        I design AI systems that do real work: read documents, find the right evidence, call tools and know when to ask a person.
        Fifteen years of shipping software, most of it written by hand, the last several building AI for enterprise teams on Azure.
      </p>
      <p className="measure mt-4 text-graphite">
        The citadel beside this text is a map of the site. The keep in the middle is me; the camera moves to each building as you read.
      </p>
      <dl className="mt-8 grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-4">
        {[
          { v: "70K+", l: "documents a month through one agent pipeline" },
          { v: "2K+", l: "people using a RAG copilot" },
          { v: "20", l: "engineers led across delivery teams" },
          { v: "15+", l: "years building cloud software" }
        ].map((m) => (
          <div key={m.l} className="flex flex-col-reverse justify-end bg-paper p-3">
            <dt className="mono mt-1 text-graphite">{m.l}</dt>
            <dd className="m-0 text-2xl tracking-[-0.03em]">{m.v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-5">
        <div>
          <p className="mono mb-2 mt-0 text-graphite">Read this site in</p>
          <ReadingToggle />
        </div>
        <div className="flex flex-wrap gap-3">
          <a className="key-btn" href="#agents">
            New agents
          </a>
          <a className="key-btn" href="#projects">
            Hand-built work
          </a>
        </div>
      </div>
    </section>
  );
}

function Chapter({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const n = navItems.findIndex((item) => item.href === `#${id}`) + 1;
  return (
    <section id={id} data-scene={id} className="chapter px-4 md:px-10" aria-labelledby={`${id}-title`}>
      <p className="mono m-0 text-graphite">
        {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
      <h2 id={`${id}-title`} className="chapter-title mb-8 mt-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

function AgentProject({ project, index }: { project: (typeof agenticProjects)[number]; index: number }) {
  const anchor = agentAnchor(project.title);
  return (
    <article id={anchor} data-scene={anchor} className="border-t border-rule py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="m-0 text-2xl font-medium tracking-[-0.025em]">
          <span className="mono mr-3 align-middle text-graphite">2.{index + 1}</span>
          {project.title}
        </h3>
        <p className="mono m-0 text-graphite">
          {project.where}, {project.period}
        </p>
      </div>
      <p className="mt-5 max-w-[26ch] text-[clamp(1.4rem,2.4vw,1.9rem)] leading-[1.1] tracking-[-0.03em]">{project.headline}</p>
      <div className="read-plain measure mt-5 flex flex-col gap-4">
        {project.plain.map((t) => (
          <p key={t} className="m-0">
            {t}
          </p>
        ))}
      </div>
      <div className="read-technical measure mt-5 flex flex-col gap-4">
        {project.technical.map((t) => (
          <p key={t} className="m-0">
            {t}
          </p>
        ))}
      </div>
      <ol className="flow mt-7 list-none p-0" aria-label={`${project.title} flow`}>
        {project.flow.map((step) => (
          <li key={step}>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <ul className="read-technical mt-4 flex list-none flex-wrap gap-1.5 p-0" aria-label="Stack">
        {project.stack.map((s) => (
          <li key={s} className="tag">
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
        <dl className="m-0 flex gap-8">
          {project.proof.map((p) => (
            <div key={p.label} className="flex flex-col-reverse">
              <dt className="mono text-graphite">{p.label}</dt>
              <dd className="m-0 text-lg tracking-[-0.02em]">{p.value}</dd>
            </div>
          ))}
        </dl>
        <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-1 p-0">
          {project.links.map((l) => (
            <li key={l.href}>
              <a className="link inline-flex items-center gap-1" href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                {l.label}
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/** The original case-study write-ups, shown in full. */
function CaseStudy({ project }: { project: (typeof projects)[number] }) {
  const anchor = projectAnchor(project.title);
  return (
    <article id={anchor} data-scene={anchor} className="border-t border-rule py-10">
      <p className="mono m-0 text-graphite">{project.period}</p>
      <h3 className="mb-0 mt-1 text-2xl font-medium tracking-[-0.025em]">{project.title}</h3>
      <p className="measure mb-0 mt-3">{project.problem}</p>
      <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <Field label="Solution" value={project.solution} />
        <Field label="Architecture" value={project.architecture} />
        <ListField label="Challenges" values={project.challenges} />
        <ListField label="Lessons learned" values={project.lessons} />
      </div>
      <ul className="mt-6 flex list-none flex-wrap gap-1.5 p-0" aria-label="Stack">
        {project.stack.map((s) => (
          <li key={s} className="tag">
            {s}
          </li>
        ))}
      </ul>
      {project.github ? (
        <a className="link mt-5 inline-flex items-center gap-1" href={project.github} target="_blank" rel="noreferrer">
          Source on GitHub <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
        </a>
      ) : null}
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mono m-0 text-graphite">{label}</p>
      <p className="m-0 mt-1.5 text-[0.95rem] leading-[1.55]">{value}</p>
    </div>
  );
}

function ListField({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <p className="mono m-0 text-graphite">{label}</p>
      <ul className="m-0 mt-1.5 list-none space-y-1.5 p-0 text-[0.95rem] leading-[1.55]">
        {values.map((v) => (
          <li key={v} className="grid grid-cols-[0.9rem_1fr]">
            <span aria-hidden="true" className="mt-[0.75em] h-px w-2 bg-ink" />
            <span>{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
