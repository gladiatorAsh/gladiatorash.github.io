import type { Metadata } from "next";
import { IeltsPlanView } from "@/components/ielts-plan";
import { planB } from "@/lib/ielts/plan-b";

// Unlisted: not in the sitemap or nav, and kept out of search results.
export const metadata: Metadata = {
  title: "IELTS General Training refresher",
  description: "A 6-week IELTS General Training refresher for Canada Express Entry.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: "/study/ielts-gt-refresh/" }
};

export default function Page() {
  return <IeltsPlanView plan={planB} />;
}
