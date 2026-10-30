export type Link = { label: string; href: string; note?: string };

export type Block = { heading: string; items: (string | Link)[]; ordered?: boolean };

export type Module = {
  id: string;
  week: string;
  title: string;
  lead: string;
  blocks: Block[];
  table?: { head: string[]; rows: string[][]; source?: Link };
  notes?: { label: string; text: string }[];
  checkpoint: string;
};

export type Resource = { label: string; href: string; role: string; use: string };

export type LearnPath = {
  slug: string;
  title: string;
  /** Mono line above the title, e.g. "Study notes · two weeks". */
  kicker: string;
  /** Short length label for the index, e.g. "2 weeks". */
  length: string;
  /** One line for the index card. */
  summary: string;
  /** Meta description. */
  description: string;
  intro: string;
  resources: Resource[];
  resourceNotes?: { label: string; text: string }[];
  modules: Module[];
  capstone: { lead: string; items: string[] };
  references: Link[];
  reviewed: string;
};
