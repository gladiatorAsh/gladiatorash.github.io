import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { LearnHeader } from "@/components/learn-path";
import { profile } from "@/lib/portfolio";

// data/news.json is refreshed by scripts/fetch-news.mjs right before each build.
// The daily scheduled deploy in .github/workflows/deploy-pages.yml keeps it current.

type Story = { title: string; url: string; source: string; published: string | null; summary: string };
type Section = { id: string; title: string; items: Story[]; stale?: boolean };
type News = { generatedAt: string | null; sections: Section[] };

function loadNews(): News {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "data/news.json"), "utf8")) as News;
  } catch {
    return { generatedAt: null, sections: [] };
  }
}

const TZ = "America/Los_Angeles";
const fmtDay = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "long", month: "long", day: "numeric", year: "numeric" });
const fmtTime = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit", timeZoneName: "short" });
const fmtShort = new Intl.DateTimeFormat("en-US", { timeZone: TZ, month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

const description = "A daily digest of headlines from tech, India, Canada and the US, pulled from public news feeds every morning.";

export const metadata: Metadata = {
  title: `Daily news | ${profile.name}`,
  description,
  alternates: { canonical: "/news/" },
  openGraph: { title: "Daily news", description, url: "https://www.ashutoshysingh.com/news/", type: "website" }
};

function StoryItem({ story }: { story: Story }) {
  return (
    <li className="border-t border-rule py-5 first:border-t-0 first:pt-0">
      <p className="mono m-0 text-[0.78rem] text-graphite">
        {story.source}
        {story.published ? (
          <>
            {" · "}
            <time dateTime={story.published}>{fmtShort.format(new Date(story.published))}</time>
          </>
        ) : null}
      </p>
      <a
        href={story.url}
        target="_blank"
        rel="noreferrer"
        className="mt-1.5 block text-[1.08rem] font-[450] leading-[1.3] tracking-[-0.015em] hover:text-signal"
      >
        {story.title}
      </a>
      {story.summary ? <p className="m-0 mt-1.5 text-[0.95rem] leading-[1.5] text-graphite">{story.summary}</p> : null}
    </li>
  );
}

export default function NewsPage() {
  const news = loadNews();
  const updated = news.generatedAt ? new Date(news.generatedAt) : null;
  const total = news.sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <>
      <LearnHeader crumb="News" back={{ href: "/", label: profile.name }} />
      <main id="main" className="mx-auto max-w-6xl px-4 pb-20 pt-28 md:px-10">
        <p className="mono m-0 text-graphite">
          {updated ? `${fmtDay.format(updated)} · updated ${fmtTime.format(updated)}` : "Waiting for the first daily update"}
        </p>
        <h1 className="chapter-title mb-6 mt-3 !max-w-[20ch]">Today&rsquo;s news</h1>
        <p className="measure m-0 text-[1.15rem] text-graphite">
          Headlines from tech, India, Canada and the US, collected each morning from public news feeds. Stories link to the original
          publisher.
        </p>

        <nav aria-label="Sections" className="mt-10 flex flex-wrap gap-2">
          {news.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="key-btn !min-h-9 text-[0.85rem]">
              {s.title}
              <span className="key" aria-hidden="true">
                {s.items.length}
              </span>
            </a>
          ))}
        </nav>

        {total === 0 ? (
          <p className="mt-14 border-t border-rule pt-8 text-graphite">No stories yet. The digest fills in after the next scheduled update.</p>
        ) : (
          <div className="mt-14 grid gap-x-14 gap-y-16 lg:grid-cols-2">
            {news.sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="min-w-0">
                <h2
                  id={`${s.id}-h`}
                  className="m-0 mb-6 flex items-baseline justify-between gap-4 border-b border-ink pb-3 text-[clamp(1.4rem,2.6vw,1.9rem)] font-[450] tracking-[-0.03em]"
                >
                  {s.title}
                  {s.stale ? <span className="mono text-[0.75rem] font-normal text-graphite">from the last update</span> : null}
                </h2>
                {s.items.length ? (
                  <ul className="m-0 list-none p-0">
                    {s.items.map((story, i) => (
                      <StoryItem key={`${i}-${story.url}`} story={story} />
                    ))}
                  </ul>
                ) : (
                  <p className="m-0 text-graphite">No stories came through for this section today.</p>
                )}
              </section>
            ))}
          </div>
        )}

        <footer className="mt-20 border-t border-rule pt-8 text-graphite">
          <p className="mono m-0">
            Updated daily · headlines belong to their publishers ·{" "}
            <a className="link" href="/">
              {profile.name}
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}
