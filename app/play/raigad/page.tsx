import type { Metadata } from "next";
import { LearnHeader } from "@/components/learn-path";
import { RaigadDefense } from "@/components/raigad-defense";
import { profile } from "@/lib/portfolio";

const description =
  "Raigad: Hold the Fort. A tower-defense game on a map of Raigad, the Maratha hill fort: guard the Maha Darwaja, the Wagh Darwaja and the Hirkani cliff for twelve waves.";

export const metadata: Metadata = {
  title: `Raigad: Hold the Fort | ${profile.name}`,
  description,
  alternates: { canonical: "/play/raigad/" },
  openGraph: {
    title: "Raigad: Hold the Fort",
    description,
    url: "https://www.ashutoshysingh.com/play/raigad/",
    type: "website"
  }
};

export default function RaigadPage() {
  return (
    <>
      <LearnHeader crumb="Arcade · Raigad: Hold the Fort" back={{ href: "/", label: profile.name }} />
      <main id="main" className="fixed inset-x-0 bottom-0 top-14">
        <h1 className="sr-only">Raigad: Hold the Fort</h1>
        <RaigadDefense />
      </main>
    </>
  );
}
