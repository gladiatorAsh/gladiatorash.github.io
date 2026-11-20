// Shared shapes and reference data for the unlisted IELTS study pages under /study/.

export type Skill = "Listening" | "Reading" | "Writing" | "Speaking";
export const skills: Skill[] = ["Listening", "Reading", "Writing", "Speaking"];

export type Phase = { id: string; name: string; weeks: string; hours: string; goal: string };

export type Week = {
  n: number;
  phase: string;
  theme: string;
  tasks: Record<Skill, string>;
  milestone?: string;
};

export type Baseline = {
  skill: Skill;
  scores: { label: string; value: number }[];
  read: string;
  priority: "High" | "Medium" | "Low";
};

export type SkillCard = {
  skill: Skill;
  vsToefl?: string;
  format: string[];
  strategies: string[];
  daily: string[];
  traps: string[];
};

export type Plan = {
  /** localStorage namespace, so the two pages keep separate progress. */
  storageKey: string;
  crumb: string;
  kicker: string;
  title: string;
  intro: string;
  targetClb: string;
  targets: Record<Skill, { band: string; raw?: string }>;
  baselineTitle: string;
  baseline: Baseline[];
  baselineNote: string[];
  phases: Phase[];
  timelineNote: string;
  weeks: Week[];
  dailyTemplate: { day: string; main: string; short: string }[];
  dailyNote: string;
  skillCards: SkillCard[];
  alternatives: { title: string; body: string }[];
};

/** IRCC IELTS General Training → CLB thresholds (Express Entry). */
export const clbTable: { clb: string; L: string; R: string; W: string; S: string; note: string }[] = [
  { clb: "CLB 10", L: "8.5", R: "8.0", W: "7.5", S: "7.5", note: "Maximum CRS language points" },
  { clb: "CLB 9", L: "8.0", R: "7.0", W: "7.0", S: "7.0", note: "The big CRS jump" },
  { clb: "CLB 8", L: "7.5", R: "6.5", W: "6.5", S: "6.5", note: "Good fallback" },
  { clb: "CLB 7", L: "6.0", R: "6.0", W: "6.0", S: "6.0", note: "Floor for Federal Skilled Worker" }
];

/** Approximate raw-score → band conversions published by test providers; they shift slightly per test. */
export const rawToBand: { band: string; listening: string; reading: string }[] = [
  { band: "9.0", listening: "39–40", reading: "40" },
  { band: "8.5", listening: "37–38", reading: "39" },
  { band: "8.0", listening: "35–36", reading: "37–38" },
  { band: "7.5", listening: "32–34", reading: "36" },
  { band: "7.0", listening: "30–31", reading: "34–35" },
  { band: "6.5", listening: "26–29", reading: "32–33" },
  { band: "6.0", listening: "23–25", reading: "30–31" },
  { band: "5.5", listening: "18–22", reading: "27–29" }
];

export const resources: { name: string; cost: "Free" | "Paid"; use: string; href?: string }[] = [
  { name: "IELTS official practice tests", cost: "Free", use: "Diagnostic and format practice", href: "https://ielts.org/" },
  { name: "British Council: Take IELTS", cost: "Free", use: "GT sample tests and computer-delivered practice", href: "https://takeielts.britishcouncil.org/" },
  { name: "IDP IELTS practice", cost: "Free", use: "More GT practice tests", href: "https://ielts.idp.com/" },
  { name: "Cambridge IELTS General Training books", cost: "Paid", use: "Real past papers. Save for the mock weeks" },
  { name: "IELTS Liz", cost: "Free", use: "Strategy lessons and band-scored model answers", href: "https://ieltsliz.com/" },
  { name: "E2 IELTS (YouTube)", cost: "Free", use: "Writing and speaking walkthroughs" },
  { name: "BBC Learning English", cost: "Free", use: "Daily listening (6 Minute English) and vocabulary", href: "https://www.bbc.co.uk/learningenglish" },
  { name: "Official band descriptors", cost: "Free", use: "Mark writing and speaking the way examiners do", href: "https://ielts.org/" },
  { name: "Claude", cost: "Free", use: "Paste an essay or letter for a band estimate and corrections" }
];

export const testDayChecklist: string[] = [
  "Booked IELTS General Training (not Academic, not UKVI, not One Skill Retake) at a test centre",
  "Name on the booking matches the passport exactly",
  "Passport packed (the same one used for the immigration application)",
  "Arrive 30+ minutes early. Only a clear water bottle goes in",
  "Paper test: pencil + eraser are provided. Computer test: practise typing answers beforehand",
  "Speaking may be the same day or within a few days. Check the confirmation email",
  "Results: computer test in a few days, paper about 2 weeks. Valid 2 years from the test date"
];
