import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { profile } from "@/lib/portfolio";
import type { LearnPath, Link } from "@/lib/learn/types";

export function LearnHeader({ crumb, back }: { crumb: string; back: { href: string; label: string } }) {
  return (
    <>
      {/* The home page pads anchors for its pinned citadel; these pages only have the 3.5rem bar. */}
      <style>{"html{scroll-padding-top:5rem}"}</style>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-rule bg-paper/92 backdrop-blur-md">
        <div className="flex h-14 items-center gap-4 px-4 md:px-10">
          <a href={back.href} className="inline-flex shrink-0 items-center gap-2 text-[0.95rem] font-medium tracking-[-0.01em]">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {back.label}
          </a>
          <p className="mono m-0 hidden flex-1 truncate text-graphite md:block">{crumb}</p>
          <span className="flex-1 md:hidden" />
          <ThemeToggle className="!h-9 !w-9 !rounded-none" />
        </div>
      </header>
    </>
  );
}

function Ext({ link }: { link: Link }) {
  const external = link.href.startsWith("http");
  return (
    <>
      <a className="link" href={link.href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {link.label}
      </a>
      {link.note ? <span className="text-graphite">: {link.note}</span> : null}
    </>
  );
}

function Item({ item }: { item: string | Link }) {
  return <li className="pl-1">{typeof item === "string" ? item : <Ext link={item} />}</li>;
}

function Table({ head, rows, minWidth }: { head: string[]; rows: (React.ReactNode | string)[][]; minWidth: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-[0.93rem]" style={{ minWidth }}>
        <thead>
          <tr className="mono text-graphite">
            {head.map((h) => (
              <th key={h} className="border-b border-rule py-2 pr-4 font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="align-top">
              {row.map((cell, c) => (
                <td key={c} className={`border-b border-rule py-3 pr-4 ${c === 0 ? "font-medium" : "text-graphite"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LearnPathPage({ path }: { path: LearnPath }) {
  return (
    <>
      <LearnHeader crumb={`Learn / ${path.title}`} back={{ href: "/learn/", label: "All learning paths" }} />

      <main id="main" className="mx-auto max-w-5xl px-4 pb-20 pt-28 md:px-10">
        <p className="mono m-0 text-graphite">{path.kicker}</p>
        <h1 className="chapter-title mb-6 mt-3 !max-w-[20ch]">{path.title}</h1>
        <p className="measure m-0 text-[1.15rem] text-graphite">{path.intro}</p>

        <nav aria-label="Modules" className="mt-10 flex flex-wrap gap-2">
          {path.modules.map((m, i) => (
            <a key={m.id} className="key-btn" href={`#${m.id}`}>
              <span>{m.title.split(":")[0]}</span>
              <span className="key" aria-hidden="true">
                {i + 1}
              </span>
            </a>
          ))}
          <a className="key-btn" href="#capstone">
            <span>Capstone</span>
          </a>
        </nav>

        <section className="mt-16 border-t border-rule pt-10" aria-labelledby="how-title">
          <h2 id="how-title" className="m-0 text-2xl font-medium tracking-[-0.025em]">
            The core material
          </h2>
          <div className="mt-6">
            <Table
              head={["Resource", "Role", "Use it for"]}
              minWidth="34rem"
              rows={path.resources.map((r) => [
                <a key={r.href} className="link" href={r.href} target="_blank" rel="noreferrer">
                  {r.label}
                </a>,
                r.role,
                r.use
              ])}
            />
          </div>
          {path.resourceNotes?.length ? (
            <ul className="measure mt-6 list-disc space-y-3 pl-5">
              {path.resourceNotes.map((n) => (
                <li key={n.label}>
                  <strong className="font-medium">{n.label}</strong> {n.text}
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        {path.modules.map((m, i) => (
          <section key={m.id} id={m.id} className="mt-16 border-t border-rule pt-10" aria-labelledby={`${m.id}-title`}>
            <p className="mono m-0 text-graphite">
              {String(i + 1).padStart(2, "0")} / {m.week}
            </p>
            <h2 id={`${m.id}-title`} className="m-0 mt-2 text-[clamp(1.6rem,3vw,2.3rem)] font-[450] leading-[1.05] tracking-[-0.035em]">
              {m.title}
            </h2>
            <p className="measure mt-4 text-graphite">{m.lead}</p>

            {m.table ? (
              <div className="mt-6">
                <Table head={m.table.head} rows={m.table.rows} minWidth="36rem" />
                {m.table.source ? (
                  <p className="mono mt-2 text-graphite">
                    Source: <Ext link={m.table.source} />
                  </p>
                ) : null}
              </div>
            ) : null}

            {m.blocks.map((b) => {
              const List = b.ordered ? "ol" : "ul";
              return (
                <div key={b.heading} className="mt-8">
                  <h3 className="m-0 text-lg font-medium tracking-[-0.02em]">{b.heading}</h3>
                  <List className={`measure mt-3 space-y-2 pl-5 ${b.ordered ? "list-decimal" : "list-disc"}`}>
                    {b.items.map((item, k) => (
                      <Item key={k} item={item} />
                    ))}
                  </List>
                </div>
              );
            })}

            {m.notes?.map((n) => (
              <p key={n.label} className="measure mt-6">
                <strong className="font-medium">{n.label}:</strong> {n.text}
              </p>
            ))}

            <p className="measure mt-8 border-l-2 border-signal pl-4">
              <span className="mono block text-graphite">Checkpoint</span>
              {m.checkpoint}
            </p>
          </section>
        ))}

        <section id="capstone" className="mt-16 border-t border-rule pt-10" aria-labelledby="capstone-title">
          <h2 id="capstone-title" className="m-0 text-[clamp(1.6rem,3vw,2.3rem)] font-[450] tracking-[-0.035em]">
            Capstone
          </h2>
          <p className="measure mt-4 text-graphite">{path.capstone.lead}</p>
          <ul className="measure mt-4 list-none space-y-2 p-0">
            {path.capstone.items.map((c) => (
              <li key={c} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.45rem] h-3 w-3 shrink-0 border border-ink" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 border-t border-rule pt-10" aria-labelledby="refs-title">
          <h2 id="refs-title" className="m-0 text-2xl font-medium tracking-[-0.025em]">
            Reference links
          </h2>
          <ul className="measure mt-4 list-disc space-y-2 pl-5">
            {path.references.map((r) => (
              <Item key={r.href} item={r} />
            ))}
          </ul>
        </section>

        <footer className="mt-20 border-t border-rule pt-8 text-graphite">
          <p className="mono m-0">
            {path.reviewed} ·{" "}
            <a className="link" href="/learn/">
              All learning paths
            </a>{" "}
            ·{" "}
            <a className="link" href="/">
              {profile.name}
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}
