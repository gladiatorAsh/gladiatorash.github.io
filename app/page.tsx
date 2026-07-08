import Link from "next/link";
import { ArrowUpRight, Download, Github, Linkedin, Mail, MapPin, Terminal } from "lucide-react";
import { ArchitectureGallery } from "@/components/architecture-gallery";
import { CareerTimeline } from "@/components/career-timeline";
import { Reveal } from "@/components/reveal";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  certifications,
  education,
  metrics,
  navItems,
  profile,
  projects,
  skillGroups,
  technicalSections
} from "@/lib/portfolio";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main>
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[21rem] flex-col justify-between border-r border-white/10 bg-background/72 px-10 py-10 backdrop-blur-xl lg:flex">
        <div>
          <Link href="#home" className="focus-ring inline-block rounded-md">
            <p className="text-2xl font-bold text-white">{profile.name}</p>
            <p className="mt-2 text-sm text-azure">{profile.title}</p>
          </Link>
          <nav className="mt-16 space-y-1" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group flex items-center gap-4 rounded-md py-3 text-sm text-slate-400 transition hover:text-white"
              >
                <span className="h-px w-8 bg-slate-700 transition group-hover:w-14 group-hover:bg-azure" />
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="space-y-5">
          <p className="max-w-56 text-sm leading-6 text-slate-500">
            Enterprise AI systems, retrieval architecture, and full-stack delivery for production teams.
          </p>
          <Socials />
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-background/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
          <a href="#home" className="font-semibold text-white">{profile.name}</a>
          <div className="flex gap-1">
            {navItems.slice(1, 5).map((item) => (
              <a key={item.href} href={item.href} className="rounded-md px-2 py-1 text-xs text-slate-300">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      <section id="home" className="section-shell flex items-center">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <p className="font-mono text-sm uppercase tracking-[0.28em] text-azure">Lead Azure AI Engineer</p>
            <h1 className="mt-5 max-w-5xl text-5xl font-bold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              {profile.name}
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-300">
              Building enterprise AI systems using Azure OpenAI, RAG, .NET, React and Python.
            </p>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400">{profile.summary}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a className={cn(buttonVariants({ variant: "default" }))} href="/assets/files/Resume.pdf">
                <Download className="h-4 w-4" />
                Resume
              </a>
              <a className={cn(buttonVariants({ variant: "secondary" }))} href={profile.github} target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a className={cn(buttonVariants({ variant: "secondary" }))} href="#projects">
                <Terminal className="h-4 w-4" />
                Projects
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.12} className="mt-16 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <Card key={metric.label} className="p-5 transition hover:-translate-y-1 hover:border-azure/45">
                <p className="text-3xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{metric.label}</p>
              </Card>
            ))}
          </Reveal>
        </div>
      </section>

      <Section id="resume" eyebrow="Career Timeline" title="Production AI leadership across cloud, applications, and enterprise workflows.">
        <CareerTimeline />
      </Section>

      <Section id="projects" eyebrow="Projects" title="Case studies built around real enterprise problems.">
        <div className="grid gap-5">
          {projects.map((project, index) => (
            <Reveal key={project.title} delay={index * 0.03}>
              <Card className="group overflow-hidden transition hover:-translate-y-1 hover:border-azure/45">
                <div className="grid gap-0 xl:grid-cols-[0.9fr_1.1fr]">
                  <CardHeader className="border-b border-white/10 xl:border-b-0 xl:border-r">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-azure">{project.period}</p>
                    <CardTitle className="text-2xl">{project.title}</CardTitle>
                    <p className="text-sm leading-6 text-slate-400">{project.problem}</p>
                    {project.github ? (
                      <a className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-azure" href={project.github} target="_blank" rel="noreferrer">
                        GitHub <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : null}
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <CaseBlock label="Solution" value={project.solution} />
                      <CaseBlock label="Architecture" value={project.architecture} />
                      <CaseList label="Challenges" values={project.challenges} />
                      <CaseList label="Lessons Learned" values={project.lessons} />
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span key={tech} className="rounded-md bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {project.screenshots.map((shot) => (
                        <div key={shot} className="flex aspect-[16/9] items-center justify-center rounded-md border border-white/10 bg-background/70 text-center font-mono text-xs text-slate-500">
                          {shot}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="architecture" eyebrow="Architecture Gallery" title="Clickable systems with the tradeoffs exposed.">
        <ArchitectureGallery />
      </Section>

      <Section id="technical" eyebrow="Technical Knowledge Base" title="Field notes for AI architecture, retrieval, agents, and performance.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {technicalSections.map((section) => {
            const Icon = section.icon;
            return (
              <Reveal key={section.title}>
                <Card className="h-full p-5 transition hover:-translate-y-1 hover:border-azure/45">
                  <Icon className="h-5 w-5 text-azure" />
                  <h3 className="mt-5 text-lg font-semibold text-white">{section.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{section.description}</p>
                  <pre className="mt-5 overflow-hidden rounded-md border border-white/10 bg-background/82 p-3 font-mono text-xs leading-5 text-slate-500">
{`type Note = {
  diagrams: true
  code: "supported"
}`}
                  </pre>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section id="skills" eyebrow="Skills" title="A senior toolkit for AI products that need to survive production.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(skillGroups).map(([group, skills]) => (
            <Card key={group} className="p-5">
              <h3 className="text-lg font-semibold text-white">{group}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-sm text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="certifications" eyebrow="Certifications" title="Microsoft-oriented cloud and AI credentials.">
        <div className="grid gap-4 md:grid-cols-2">
          {certifications.map((certification) => (
            <Card key={certification} className="flex items-center justify-between p-5">
              <span className="font-semibold text-white">{certification}</span>
              <span className="rounded-md border border-azure/30 bg-azure/10 px-2 py-1 font-mono text-xs text-azure">Microsoft</span>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="contact" eyebrow="Contact" title="Let’s build practical AI systems with clean architecture and measurable outcomes.">
        <Card className="p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-lg leading-8 text-slate-300">
                I’m based in {profile.location} and focused on enterprise AI, RAG, agentic workflows, Azure architecture, and full-stack delivery.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a className={cn(buttonVariants({ variant: "default" }))} href={`mailto:${profile.email}`}>
                  <Mail className="h-4 w-4" />
                  Email
                </a>
                <a className={cn(buttonVariants({ variant: "secondary" }))} href={profile.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-background/72 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Education</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                {education.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="h-4 w-4 text-azure" />
                {profile.location}
              </div>
            </div>
          </div>
        </Card>
      </Section>

      <footer className="border-t border-white/10 px-5 py-8 lg:pl-[25rem] lg:pr-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {profile.name}. Built with Next.js, Azure-blue restraint, and production-minded taste.</p>
          <Socials />
        </div>
      </footer>
    </main>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="section-shell">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="mb-10">
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-azure">{eyebrow}</p>
          <h2 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl">{title}</h2>
        </Reveal>
        {children}
      </div>
    </section>
  );
}

function CaseBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{value}</p>
    </div>
  );
}

function CaseList({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-300">
        {values.map((value) => (
          <li key={value} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-azure" />
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Socials() {
  return (
    <div className="flex gap-2">
      <a className={cn(buttonVariants({ variant: "ghost", size: "icon" }))} href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
        <Github className="h-4 w-4" />
      </a>
      <a className={cn(buttonVariants({ variant: "ghost", size: "icon" }))} href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
        <Linkedin className="h-4 w-4" />
      </a>
      <a className={cn(buttonVariants({ variant: "ghost", size: "icon" }))} href={`mailto:${profile.email}`} aria-label="Email">
        <Mail className="h-4 w-4" />
      </a>
    </div>
  );
}
