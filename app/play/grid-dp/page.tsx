import type { Metadata } from "next";
import { LearnHeader } from "@/components/learn-path";
import { profile } from "@/lib/portfolio";

const description =
  "Grid Path DP Trainer. Fill the dynamic-programming table for grid path problems (Unique Paths II, Minimum Path Sum, max coins) cell by cell, with rocks, traps and live Python.";

export const metadata: Metadata = {
  title: `Grid Path DP Trainer | ${profile.name}`,
  description,
  alternates: { canonical: "/play/grid-dp/" },
  openGraph: {
    title: "Grid Path DP Trainer",
    description,
    url: "https://www.ashutoshysingh.com/play/grid-dp/",
    type: "website"
  }
};

export default function GridDpPage() {
  return (
    <>
      <LearnHeader crumb="Arcade · Grid Path DP Trainer" back={{ href: "/", label: profile.name }} />
      <main id="main" className="fixed inset-x-0 bottom-0 top-14">
        <h1 className="sr-only">Grid Path DP Trainer</h1>
        {/* Self-contained page in public/games so it can also be opened on its own. */}
        <iframe src="/games/grid-dp.html" title="Grid Path DP Trainer" className="block h-full w-full border-0" />
      </main>
    </>
  );
}
