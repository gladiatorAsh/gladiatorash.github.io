import type { Metadata } from "next";
import { LearnHeader } from "@/components/learn-path";
import { MoonGolf } from "@/components/moon-golf";
import { profile } from "@/lib/portfolio";

const description = "Moon Golf: nine holes of one-sixth-gravity golf in the browser. A new course every day, the same for everyone.";

export const metadata: Metadata = {
  title: `Moon Golf | ${profile.name}`,
  description,
  alternates: { canonical: "/play/" },
  openGraph: { title: "Moon Golf", description, url: "https://www.ashutoshysingh.com/play/", type: "website" }
};

export default function PlayPage() {
  return (
    <>
      <LearnHeader crumb="Arcade · Moon Golf" back={{ href: "/", label: profile.name }} />
      <main id="main" className="fixed inset-x-0 bottom-0 top-14">
        <h1 className="sr-only">Moon Golf</h1>
        <MoonGolf />
      </main>
    </>
  );
}
