import type { Plan } from "./types";

// 6-week refresher from a strong but old TOEFL 111. The work is format change, not English.
export const planB: Plan = {
  storageKey: "ielts-refresh",
  crumb: "Study · IELTS refresher",
  kicker: "6 weeks · about 45–60 min a day · Canada Express Entry",
  title: "IELTS General Training refresher",
  intro:
    "TOEFL 111 shows the English is there. The gap is IELTS's format: a letter-writing task, a live speaking examiner, strict spelling and word limits, and British and Australian accents. Six weeks to aim for CLB 10, which gives the maximum language points. Weeks aren't tied to dates: skip one and carry on.",
  targetClb: "CLB 10",
  targets: {
    Listening: { band: "8.5", raw: "≈ 37/40" },
    Reading: { band: "8.0", raw: "≈ 37/40" },
    Writing: { band: "7.5" },
    Speaking: { band: "7.5" }
  },
  baselineTitle: "Starting point: TOEFL iBT, 2015",
  baseline: [
    {
      skill: "Speaking",
      scores: [{ label: "2015", value: 24 }],
      read: "Lowest TOEFL score. IELTS is a live conversation with an examiner, not recorded answers, and 7.5 needs fluent, extended, natural answers.",
      priority: "High"
    },
    {
      skill: "Writing",
      scores: [{ label: "2015", value: 27 }],
      read: "Strong, but Task 1 is a letter, which TOEFL never had. Tone and covering all three bullet points decide the band.",
      priority: "Medium"
    },
    {
      skill: "Reading",
      scores: [{ label: "2015", value: 30 }],
      read: "Perfect score. The risk is format: True/False/Not Given, word limits and spelling. 8.0 allows only about 3 mistakes.",
      priority: "Low"
    },
    {
      skill: "Listening",
      scores: [{ label: "2015", value: 30 }],
      read: "Perfect score. Watch spelling, plurals and the accent shift. 8.5 allows only about 3 mistakes.",
      priority: "Low"
    }
  ],
  baselineNote: [
    "A total of 111/120 is roughly IELTS 8.0 overall. It's 11 years old, though, so week 1 is a full IELTS mock to see where things stand now.",
    "If the diagnostic already shows CLB 10 in a skill, cut that skill to one practice session a week and put the time into Speaking."
  ],
  phases: [
    { id: "P0", name: "Diagnostic", weeks: "Week 1", hours: "1 mock + review", goal: "Full timed mock. Find which skills are already at CLB 10." },
    { id: "P1", name: "Format refresh", weeks: "Weeks 2–3", hours: "45–60 min/day", goal: "Letter tones, IELTS question types, speaking parts, accents." },
    { id: "P2", name: "Mocks", weeks: "Weeks 4–5", hours: "60 min/day", goal: "Two full mocks. Fix what costs marks." },
    { id: "T", name: "Test", weeks: "Week 6", hours: "Light", goal: "Taper and sit the exam." },
    { id: "B", name: "Buffer", weeks: "If needed", hours: "2–4 weeks", goal: "Retake if any skill is below CLB 10 and the points matter." }
  ],
  timelineNote: "Book in week 3 for about 3 weeks out. Taking the same test day as your wife can make logistics simpler, but don't wait for it if you're ready sooner.",
  weeks: [
    {
      n: 1, phase: "P0", theme: "Where do I stand?",
      tasks: {
        Listening: "Full timed test. Note every mistake that was spelling or a plural.",
        Reading: "Full timed GT test (60 min). Mark each miss by question type.",
        Writing: "Timed letter + essay. Get both band-scored against the descriptors.",
        Speaking: "Record a full 14-minute mock and score it on the 4 criteria."
      },
      milestone: "Bands for each skill in the tracker"
    },
    {
      n: 2, phase: "P1", theme: "Learn the format",
      tasks: {
        Listening: "Parts 1–2: forms, maps and spelling. 1 test with British accents.",
        Reading: "True/False/Not Given and matching headings. Sections 1–2 at speed.",
        Writing: "Letter tones: one formal, one semi-formal, one informal letter.",
        Speaking: "Part 1 and Part 2 technique. Record one cue card a day."
      }
    },
    {
      n: 3, phase: "P1", theme: "Writing & speaking depth",
      tasks: {
        Listening: "Parts 3–4 with Australian accents. 1 full test.",
        Reading: "1 full test in 55 minutes, leaving 5 to check spelling.",
        Writing: "2 essays aimed at 7.5: precise vocabulary, varied grammar, clear paragraphs.",
        Speaking: "Part 3 abstract topics: answer, explain, give an example, consider the other side."
      },
      milestone: "Book IELTS General Training for about 3 weeks out"
    },
    {
      n: 4, phase: "P2", theme: "Full mock #1",
      tasks: {
        Listening: "Full mock in test order: Listening → Reading → Writing.",
        Reading: "Review the mock's misses. Drill only the types missed.",
        Writing: "2 timed pairs (letter + essay in 60 min). Typed, with word count.",
        Speaking: "Full mock with a partner or tutor who asks unseen questions."
      },
      milestone: "Mock #1 scored"
    },
    {
      n: 5, phase: "P2", theme: "Full mock #2",
      tasks: {
        Listening: "1 full test. Target 37+/40.",
        Reading: "1 full test. Target 37+/40.",
        Writing: "1 timed pair. Check against the band 8 model answers.",
        Speaking: "2 recorded mocks. Cut fillers and long pauses."
      },
      milestone: "Every skill at or near CLB 10"
    },
    {
      n: 6, phase: "T", theme: "Taper & test",
      tasks: {
        Listening: "One short practice mid-week only.",
        Reading: "One relaxed section. No new strategies.",
        Writing: "Re-read letter openings and closings.",
        Speaking: "Talk normally. Sleep well the night before."
      },
      milestone: "Test day 🎯"
    }
  ],
  dailyTemplate: [
    { day: "Mon", main: "Speaking: one cue card, recorded and reviewed", short: "Reading: one section" },
    { day: "Tue", main: "Writing: one letter (20 min)", short: "Listening: one part" },
    { day: "Wed", main: "Listening: full test (30 min)", short: "Speaking Part 1 questions" },
    { day: "Thu", main: "Writing: one essay (40 min)", short: "Reading: question-type drill" },
    { day: "Fri", main: "Speaking Part 3 with a partner", short: "Review the week's mistakes" },
    { day: "Sat", main: "Full mock or full Reading test", short: "Update the tracker" },
    { day: "Sun", main: "Rest", short: "—" }
  ],
  dailyNote: "About 45–60 minutes a day. Speaking and Writing get most of the time; Reading and Listening are mostly about format and accuracy.",
  skillCards: [
    {
      skill: "Speaking",
      vsToefl: "TOEFL had you talk to a microphone with a timer. IELTS is a 11–14 minute conversation with a person, who can ask follow-ups.",
      format: ["Part 1: everyday questions (4–5 min)", "Part 2: cue card, 1 min prep, up to 2 min talk", "Part 3: abstract discussion (4–5 min)", "Marked on fluency, vocabulary, grammar, pronunciation"],
      strategies: [
        "7.5 needs speech that flows without effort. Long pauses to find words cost the most.",
        "Part 3 is where 7.5+ is won: give a view, explain it, add an example, mention the other side.",
        "Use less common words and idioms only where they sound natural.",
        "Self-correcting is fine. Don't stop to restart sentences."
      ],
      daily: ["Record one answer a day", "Score yourself against the band 8 descriptors", "Weekly mock with a partner"],
      traps: ["Short Part 1 answers", "Sounding rehearsed", "Running out of things to say in Part 2"]
    },
    {
      skill: "Writing",
      vsToefl: "No integrated task. Task 1 is a letter (formal, semi-formal or informal). Task 2 is a TOEFL-style opinion essay with more weight on precision.",
      format: ["Task 1: letter, 150+ words, about 20 min", "Task 2: essay, 250+ words, about 40 min", "Task 2 counts twice as much", "Marked on task response, coherence, vocabulary, grammar"],
      strategies: [
        "Letters: tone must match the reader all the way through, and all 3 bullet points need covering.",
        "7.5 needs flexible vocabulary used precisely, and mostly error-free complex sentences.",
        "One clear idea per paragraph. Avoid stacked linking words (“Furthermore… Moreover…”).",
        "Leave 3 minutes to proofread for small slips."
      ],
      daily: ["2 letters + 2 essays a week in weeks 2–5", "Compare with band 8–9 model answers", "Rewrite one piece a week"],
      traps: ["Formal tone in an informal letter (or vice versa)", "Memorised phrases", "Going far over length and running out of time"]
    },
    {
      skill: "Reading",
      vsToefl: "General Training texts are easier than TOEFL's, but the marking is stricter: 8.0 needs about 37 of 40, and spelling counts.",
      format: ["60 minutes, 40 questions, 3 sections", "Everyday texts → workplace texts → one long passage", "Answers copied in during the 60 minutes"],
      strategies: [
        "True/False/Not Given: “Not Given” means the text doesn't say. Use no outside knowledge.",
        "Obey word limits exactly (“NO MORE THAN TWO WORDS”).",
        "Copy words straight from the passage to avoid spelling slips."
      ],
      daily: ["1 timed section 3 times a week", "Log every miss by type"],
      traps: ["Overthinking T/F/NG", "Word-limit errors", "Careless copying"]
    },
    {
      skill: "Listening",
      vsToefl: "Shorter recordings, more question types, mostly British and Australian accents. Answers are written while listening, and spelling counts.",
      format: ["About 30 minutes, 4 parts, 40 questions", "Everyday conversation → talk → discussion → lecture", "Each recording plays once"],
      strategies: [
        "Read ahead in the pauses and predict the answer type.",
        "Watch for corrections (“Tuesday… no, Wednesday”).",
        "Check plurals and spelling: 8.5 leaves room for only about 3 mistakes."
      ],
      daily: ["1 part 3 times a week", "BBC or Australian podcasts while commuting"],
      traps: ["Singular vs plural", "Spelling names", "Missing a question and losing your place"]
    }
  ],
  alternatives: [
    {
      title: "Alternative: CELPIP General",
      body: "Accepted for Canada too. All on computer, Canadian English, one sitting of about 3 hours. Worth considering if a live speaking examiner isn't appealing."
    },
    {
      title: "Alternative: PTE Core",
      body: "Computer-scored, with results in a few days. Some strong English speakers find it easier to hit high bands on, but it has its own question styles to learn."
    }
  ]
};
