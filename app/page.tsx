import { ArrowUpRight, Plus } from "lucide-react";
import { ArchitectureGallery } from "@/components/architecture-gallery";
import { CareerTimeline } from "@/components/career-timeline";
import { CopyEmailButton } from "@/components/copy-email-button";
import { SystemMap } from "@/components/system-map";
import { ReadingToggle, TopBar } from "@/components/top-bar";
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
      <main id="main">
        <Hero />

        <Chapter id="agents" title="Agents I've built">
          <p className="measure text-graphite">
            Two run in production for enterprise teams. Three are my own, built on free infrastructure and running every day.
            Switch between <em className="not-italic text-ink">plain English</em> and <em className="not-italic text-ink">technical</em> with the
            buttons at the top, or keys 1 and 2.
          </p>
          <div className="mt-12">
            {agenticProjects.map((project, i) => (
              <AgentProject key={project.title} project={project} index={i} />
            ))}
          </div>
        </Chapter>

        <Chapter id="resume" title="Where I've worked">
          <CareerTimeline />
        </Chapter>

        <Chapter id="projects" title="Earlier projects">
          <p className="measure text-graphite">Client systems from before the agent work, newest first. Open a row for the details.</p>
          <ProjectIndex />
        </Chapter>

        <Chapter id="architecture" title="Systems, with the tradeoffs shown">
          <p className="measure mb-10 text-graphite">
            Pick a system, then a stage, to see why each part was chosen, what it costs and how it is secured.
          </p>
          <ArchitectureGallery />
        </Chapter>

        <Chapter id="testimonials" title="What colleagues say">
          <ul className="grid gap-x-12 md:grid-cols-2">
            {testimonials.map((t) => (
              <li key={t.name} className="border-t border-rule py-7">
                <blockquote className="m-0">
                  <p className="measure text-[1.02rem] leading-[1.65]">{t.quote}</p>
                  <footer className="mt-4">
                    <p className="font-medium">{t.name}</p>
                    <p className="mono text-graphite">{t.title}</p>
                  </footer>
                </blockquote>
              </li>
            ))}
          </ul>
        </Chapter>

        <Chapter id="skills" title="Tools I use">
          <dl className="grid gap-x-12 md:grid-cols-2">
            {Object.entries(skillGroups).map(([group, skills]) => (
              <div key={group} className="grid grid-cols-[7rem_1fr] gap-4 border-t border-rule py-5">
                <dt className="font-medium">{group}</dt>
                <dd className="m-0 text-graphite">{skills.join(", ")}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-14 grid gap-12 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-medium tracking-[-0.02em]">Certifications</h3>
              <ul className="mt-4 space-y-2 text-graphite">
                {certifications.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-[-0.02em]">Education</h3>
              <ul className="mt-4 space-y-2 text-graphite">
                {education.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-14 text-graphite">
            Keeping up: I read new research through{" "}
            <a className="link" href="/papers/">
              Paper Desk
            </a>
            , the reading agent above.
          </p>
        </Chapter>

        <Chapter id="contact" title="Let's build AI that holds up in production">
          <p className="measure text-graphite">
            I'm in {profile.location}, working on enterprise AI: retrieval, agent workflows, Azure architecture and the full-stack apps
            around them. The quickest way to reach me is email.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-8 inline-block break-all text-[clamp(1.4rem,4vw,2.6rem)] font-normal tracking-[-0.03em] underline decoration-rule decoration-1 underline-offset-[0.18em] hover:decoration-ink"
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
      </main>

      <footer className="border-t border-rule">
        <div className="frame flex flex-col gap-2 py-8 text-graphite sm:flex-row sm:justify-between">
          <p className="mono">© {new Date().getFullYear()} {profile.name}</p>
          <p className="mono">Static site, rebuilt daily with the latest papers</p>
        </div>
      </footer>
    </>
  );
}

function Hero() {
  return (
    <section id="home" className="pb-16 pt-24 md:pt-28">
      <div className="frame">
        <div className="border-t border-ink pt-3">
          <h1 className="wordmark m-0">
            Ashutosh
            <br />
            Singh
          </h1>
          <p className="mono mt-4 text-graphite">Applied AI engineer. Retrieval, agents and the platforms around them.</p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-8">
            <p className="text-[1.08rem] leading-[1.6]">
              I design agent systems that do real work: read documents, find the right evidence, call tools and know when to ask a person.
              Fifteen years of shipping software, the last several building AI for enterprise teams on Azure.
            </p>
            <dl className="grid grid-cols-2 gap-px border border-rule bg-rule">
              {[
                { v: "70K+", l: "documents a month through one agent pipeline" },
                { v: "2K+", l: "people using a RAG copilot daily" },
                { v: "20", l: "engineers led across delivery teams" },
                { v: "15+", l: "years building cloud software" }
              ].map((m) => (
                <div key={m.l} className="flex flex-col-reverse justify-end bg-paper p-3">
                  <dt className="mono mt-1 text-graphite">{m.l}</dt>
                  <dd className="m-0 text-2xl tracking-[-0.03em]">{m.v}</dd>
                </div>
              ))}
            </dl>
            <div>
              <p className="mono mb-2 text-graphite">Read this site in</p>
              <ReadingToggle />
            </div>
            <div className="flex flex-wrap gap-3">
              <a className="key-btn" href="#agents">
                See the agents
              </a>
              <a className="key-btn" href="/assets/files/Resume.pdf" download="Ashutosh-Singh-Resume.pdf">
                Resume
              </a>
            </div>
          </div>
          <SystemMap />
        </div>
      </div>
    </section>
  );
}

function Chapter({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const n = navItems.findIndex((item) => item.href === `#${id}`) + 1;
  return (
    <section id={id} className="chapter" aria-labelledby={`${id}-title`}>
      <div className="frame">
        <p className="mono text-graphite">
          {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h2 id={`${id}-title`} className="chapter-title mt-3 mb-8">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function AgentProject({ project, index }: { project: (typeof agenticProjects)[number]; index: number }) {
  return (
    <article className="grid gap-8 border-t border-rule py-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
      <div>
        <p className="mono text-graphite">2.{index + 1}</p>
        <h3 className="mt-1 text-2xl font-medium tracking-[-0.025em]">{project.title}</h3>
        <p className="mono mt-1 text-graphite">
          {project.where}, {project.period}
        </p>
        <dl className="mt-6 flex flex-col gap-3">
          {project.proof.map((p) => (
            <div key={p.label} className="flex flex-col-reverse">
              <dt className="mono text-graphite">{p.label}</dt>
              <dd className="m-0 text-lg tracking-[-0.02em]">{p.value}</dd>
            </div>
          ))}
        </dl>
        {project.links.length ? (
          <ul className="mt-6 space-y-1.5">
            {project.links.map((l) => (
              <li key={l.href}>
                <a className="link inline-flex items-center gap-1" href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                  {l.label}
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mono mt-6 text-graphite">Internal system, no public code</p>
        )}
      </div>
      <div className="min-w-0">
        <p className="max-w-[24ch] text-[clamp(1.5rem,2.8vw,2.2rem)] leading-[1.08] tracking-[-0.03em]">{project.headline}</p>
        <div className="read-plain measure mt-6 flex flex-col gap-4">
          {project.plain.map((t) => (
            <p key={t} className="m-0">{t}</p>
          ))}
        </div>
        <div className="read-technical measure mt-6 flex flex-col gap-4">
          {project.technical.map((t) => (
            <p key={t} className="m-0">{t}</p>
          ))}
        </div>
        <ol className="flow mt-8 list-none p-0" aria-label={`${project.title} flow`}>
          {project.flow.map((step) => (
            <li key={step}>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <ul className="read-technical mt-5 flex list-none flex-wrap gap-1.5 p-0" aria-label="Stack">
          {project.stack.map((s) => (
            <li key={s} className="tag">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function ProjectIndex() {
  return (
    <div className="mt-10 border-b border-rule">
      {projects.map((project) => (
        <details key={project.title} className="group border-t border-rule">
          <summary className="row-summary grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-4 md:grid-cols-[minmax(0,1fr)_14rem_auto]">
            <span className="text-lg tracking-[-0.015em] group-hover:underline group-hover:decoration-rule group-hover:underline-offset-4">
              {project.title}
            </span>
            <span className="mono col-start-1 row-start-2 text-graphite md:col-start-2 md:row-start-1">{project.period}</span>
            <Plus aria-hidden="true" className="row-toggle row-span-2 h-4 w-4 self-center text-graphite md:row-span-1" />
          </summary>
          <div className="grid gap-6 pb-8 pt-2 md:grid-cols-2 md:gap-12">
            <div className="read-plain measure flex flex-col gap-3 md:col-span-2">
              <p className="m-0">{project.problem}</p>
              <p className="m-0 text-graphite">{project.solution}</p>
            </div>
            <div className="read-technical flex flex-col gap-4">
              <Field label="Architecture" value={project.architecture} />
              <Field label="Challenges" value={project.challenges.join(". ") + "."} />
            </div>
            <div className="read-technical flex flex-col gap-4">
              <Field label="Lessons" value={project.lessons.join(". ") + "."} />
              <ul className="flex list-none flex-wrap gap-1.5 p-0">
                {project.stack.map((s) => (
                  <li key={s} className="tag">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            {project.github ? (
              <a className="link inline-flex items-center gap-1 md:col-span-2" href={project.github} target="_blank" rel="noreferrer">
                Source on GitHub <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mono m-0 text-graphite">{label}</p>
      <p className="m-0 mt-1">{value}</p>
    </div>
  );
}
