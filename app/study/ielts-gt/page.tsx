import type { Metadata } from "next";
import { IeltsPlanView } from "@/components/ielts-plan";
import { planA } from "@/lib/ielts/plan-a";

// Unlisted: not in the sitemap or nav, and kept out of search results.
export const metadata: Metadata = {
  title: "IELTS General Training study plan",
  description: "A 16-week IELTS General Training plan for Canada Express Entry.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: "/study/ielts-gt/" }
};

export default function Page() {
  return <IeltsPlanView plan={planA} />;
}
