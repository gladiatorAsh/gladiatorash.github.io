#!/usr/bin/env node
// Pulls the day's headlines from public RSS/Atom feeds into data/news.json.
// Runs in CI before `pnpm build` (see .github/workflows/deploy-pages.yml), so the
// daily scheduled deploy republishes /news with fresh stories. No dependencies.
//
// If every feed fails, the existing data/news.json is left untouched so the
// site still builds with the last good snapshot.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../data/news.json");
const WINDOW_HOURS = 36; // "today" across time zones: IST is 12.5h ahead of PT
const PER_SECTION = 12;
const PER_SOURCE = 4;
const TIMEOUT_MS = 25000;

const gnews = (path, region) => {
  const [hl, gl] = { US: ["en-US", "US"], IN: ["en-IN", "IN"], CA: ["en-CA", "CA"] }[region];
  return `https://news.google.com/rss${path}?hl=${hl}&gl=${gl}&ceid=${gl}:en`;
};

export const SECTIONS = [
  {
    id: "tech",
    title: "Tech",
    feeds: [
      { name: "Hacker News", url: "https://hnrss.org/frontpage?points=150" },
      { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
      { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index" },
      { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
      { name: "Google News", url: gnews("/headlines/section/topic/TECHNOLOGY", "US"), aggregator: true }
    ]
  },
  {
    id: "india",
    title: "India",
    feeds: [
      { name: "The Hindu", url: "https://www.thehindu.com/news/national/feeder/default.rss" },
      { name: "Times of India", url: "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms" },
      { name: "NDTV", url: "https://feeds.feedburner.com/ndtvnews-india-news" },
      { name: "Hindustan Times", url: "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml" },
      { name: "Google News", url: gnews("", "IN"), aggregator: true }
    ]
  },
  {
    id: "canada",
    title: "Canada",
    feeds: [
      { name: "Global News", url: "https://globalnews.ca/canada/feed/" },
      { name: "National Post", url: "https://nationalpost.com/category/news/canada/feed/" },
      { name: "Google News", url: gnews("", "CA"), aggregator: true }
    ]
  },
  {
    id: "us",
    title: "United States",
    feeds: [
      { name: "NPR", url: "https://feeds.npr.org/1001/rss.xml" },
      { name: "PBS NewsHour", url: "https://www.pbs.org/newshour/feeds/rss/headlines" },
      { name: "CBS News", url: "https://www.cbsnews.com/latest/rss/us" },
      { name: "Google News", url: gnews("", "US"), aggregator: true }
    ]
  }
];

// ---------- tiny RSS / Atom parser ----------

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", mdash: "—", ndash: "–", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“" };

function decode(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}

const clean = (s) => decode(decode(s ?? "")).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : "";
}

function atomLink(block) {
  const links = [...block.matchAll(/<link\b([^>]*)\/?>/gi)].map((m) => m[1]);
  const pick = links.find((a) => /rel=["']alternate["']/.test(a)) ?? links.find((a) => !/rel=/.test(a)) ?? links[0];
  return pick?.match(/href=["']([^"']+)["']/)?.[1] ?? "";
}

export function parseFeed(xml) {
  const isAtom = /<feed[\s>]/i.test(xml) && !/<rss[\s>]/i.test(xml);
  const blocks = [...xml.matchAll(isAtom ? /<entry[\s>][\s\S]*?<\/entry>/gi : /<item[\s>][\s\S]*?<\/item>/gi)].map((m) => m[0]);
  return blocks.map((b) => {
    const title = clean(tag(b, "title"));
    const link = decode(isAtom ? atomLink(b) : clean(tag(b, "link")) || clean(tag(b, "guid"))).trim();
    const date = tag(b, "pubDate") || tag(b, "published") || tag(b, "updated") || tag(b, "dc:date");
    const summary = clean(tag(b, "description") || tag(b, "summary") || tag(b, "content"));
    const source = clean(tag(b, "source"));
    return { title, link, published: date ? clean(date) : null, summary, source };
  });
}

// ---------- fetch + assemble ----------

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "user-agent": "ashutoshysingh.com news digest (+https://www.ashutoshysingh.com/news/)", accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

const excerpt = (s, n = 180) => (s.length > n ? s.slice(0, s.lastIndexOf(" ", n) > 80 ? s.lastIndexOf(" ", n) : n).replace(/[,;:.\s]+$/, "") + "…" : s);
const key = (t) => t.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ").filter((w) => w.length > 3).slice(0, 7).join(" ");

function safeDate(d) {
  try {
    const iso = d ? new Date(d).toISOString() : null;
    return iso;
  } catch {
    return null;
  }
}

export async function buildSection(section, now = Date.now(), fetcher = fetchText) {
  const cutoff = now - WINDOW_HOURS * 3600e3;
  const results = await Promise.allSettled(section.feeds.map((f) => fetcher(f.url)));
  const errors = [];
  const pool = [];

  results.forEach((r, i) => {
    const feed = section.feeds[i];
    if (r.status === "rejected") return errors.push(`${feed.name}: ${r.reason?.message ?? r.reason}`);
    let items;
    try {
      items = parseFeed(r.value);
    } catch (e) {
      return errors.push(`${feed.name}: parse ${e.message}`);
    }
    items.forEach((it, rank) => {
      if (!it.title || !/^https?:\/\//.test(it.link)) return;
      let { title, source } = it;
      if (feed.aggregator) {
        // Google News titles read "Headline - Publisher"
        const m = title.match(/^(.*)\s+[-–—]\s+([^-–—]{2,60})$/);
        if (m) [title, source] = [m[1], source || m[2]];
      }
      const published = safeDate(it.published);
      if (published && Date.parse(published) < cutoff) return;
      if (published && Date.parse(published) > now + 3600e3) return;
      pool.push({
        title,
        url: it.link,
        source: (feed.aggregator ? source : feed.name) || feed.name,
        published,
        summary: feed.aggregator || /hacker news/i.test(feed.name) ? "" : excerpt(it.summary),
        rank,
        primary: !feed.aggregator
      });
    });
  });

  // Publisher feeds first, then aggregator fills gaps; newest first within each, dedupe by title.
  pool.sort((a, b) => Number(b.primary) - Number(a.primary) || (Date.parse(b.published ?? 0) || 0) - (Date.parse(a.published ?? 0) || 0) || a.rank - b.rank);
  const seen = new Set();
  const perSource = new Map();
  const picked = [];
  for (const it of pool) {
    const k = key(it.title);
    if (!k || seen.has(k)) continue;
    const n = perSource.get(it.source) ?? 0;
    if (n >= PER_SOURCE) continue;
    seen.add(k);
    perSource.set(it.source, n + 1);
    picked.push(it);
    if (picked.length >= PER_SECTION) break;
  }
  picked.sort((a, b) => (Date.parse(b.published ?? 0) || 0) - (Date.parse(a.published ?? 0) || 0));
  const items = picked.map(({ rank, primary, ...rest }) => rest);
  return { id: section.id, title: section.title, items, errors };
}

async function main() {
  const now = Date.now();
  const sections = await Promise.all(SECTIONS.map((s) => buildSection(s, now)));
  for (const s of sections) {
    console.log(`${s.title}: ${s.items.length} stories${s.errors.length ? ` (failed: ${s.errors.join("; ")})` : ""}`);
  }
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  if (total === 0) {
    console.warn("::warning::No news fetched; keeping previous data/news.json");
    return;
  }
  // Keep the last good section if one region's feeds all failed today.
  let previous = null;
  try {
    previous = JSON.parse(await readFile(OUT, "utf8"));
  } catch {}
  const out = {
    generatedAt: new Date(now).toISOString(),
    sections: sections.map((s) => {
      if (s.items.length) return { id: s.id, title: s.title, items: s.items };
      const old = previous?.sections?.find((p) => p.id === s.id);
      return { id: s.id, title: s.title, items: old?.items ?? [], stale: Boolean(old?.items?.length) };
    })
  };
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(`Wrote ${total} stories to ${OUT}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.warn(`::warning::News fetch crashed (${e.message}); keeping previous data/news.json`);
  });
}
