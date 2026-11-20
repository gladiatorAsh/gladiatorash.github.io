import type { Plan } from "./types";

// 16-week plan from a TOEFL 80 starting point. Weeks are relative: skipping one just shifts the rest.
export const planA: Plan = {
  storageKey: "ielts-plan",
  crumb: "Study · IELTS General Training",
  kicker: "16 weeks · at her own pace · Canada Express Entry",
  title: "IELTS General Training study plan",
  intro:
    "From TOEFL 80 to CLB 9. About 1–2 hours a day, built around the two sections that need the most work (Reading and Listening). Weeks aren't tied to dates: if a week gets skipped, pick up where you left off.",
  targetClb: "CLB 9",
  targets: {
    Listening: { band: "8.0", raw: "≈ 35/40" },
    Reading: { band: "7.0", raw: "≈ 34/40" },
    Writing: { band: "7.0" },
    Speaking: { band: "7.0" }
  },
  baselineTitle: "Starting point: TOEFL iBT, 2023",
  baseline: [
    {
      skill: "Reading",
      scores: [{ label: "1st", value: 10 }, { label: "2nd", value: 18 }],
      read: "Weakest section. General Training reading needs more correct answers than Academic for the same band.",
      priority: "High"
    },
    {
      skill: "Listening",
      scores: [{ label: "1st", value: 12 }, { label: "2nd", value: 20 }],
      read: "Needs the highest IELTS band (8.0). British and Australian accents are new.",
      priority: "High"
    },
    {
      skill: "Writing",
      scores: [{ label: "1st", value: 19 }, { label: "2nd", value: 19 }],
      read: "Flat across both tests. Practice alone didn't move it, so every piece needs feedback.",
      priority: "Medium"
    },
    {
      skill: "Speaking",
      scores: [{ label: "1st", value: 22 }, { label: "2nd", value: 23 }],
      read: "Strongest. A live examiner rewards natural, extended answers.",
      priority: "Low"
    }
  ],
  baselineNote: [
    "The total went from 63 to 80 in two weeks between the two tests, so focused prep works for her.",
    "The scores are a few years old and TOEFL doesn't map neatly onto IELTS, so week 1 is a fresh IELTS diagnostic. Adjust the hours once real bands are in."
  ],
  phases: [
    { id: "P0", name: "Diagnostic", weeks: "Week 1", hours: "1 test + review", goal: "Get real IELTS bands for each skill and learn the format." },
    { id: "P1", name: "Foundation", weeks: "Weeks 2–5", hours: "1–1.5 hr/day", goal: "Daily reading and listening habit, one question type at a time, letter formats." },
    { id: "P2", name: "Build", weeks: "Weeks 6–11", hours: "1.5–2 hr/day", goal: "Timed sections, 4 marked writing pieces a week, full mocks every few weeks." },
    { id: "P3", name: "Mock & polish", weeks: "Weeks 12–15", hours: "2 hr/day", goal: "Two full timed mocks a week. Fix whatever loses marks." },
    { id: "T", name: "Test", weeks: "Week 16", hours: "Light", goal: "Taper, logistics, sit the exam." },
    { id: "B", name: "Buffer", weeks: "If needed", hours: "4–8 weeks", goal: "Retake any skill below target before the move." }
  ],
  timelineNote: "Book the test in week 11 for about 5 weeks out. If weeks slip, move the booking with them.",
  weeks: [
    {
      n: 1, phase: "P0", theme: "Find the starting line",
      tasks: {
        Listening: "Full timed practice test (30 min). Note which part loses most marks.",
        Reading: "Full timed practice test (60 min). Mark each wrong answer by question type.",
        Writing: "One letter (20 min) + one essay (40 min) under time. Get them band-scored.",
        Speaking: "Record a full mock: Part 1, a cue card, Part 3. Listen back once."
      },
      milestone: "Baseline bands written into the tracker"
    },
    {
      n: 2, phase: "P1", theme: "Everyday texts & forms",
      tasks: {
        Listening: "Part 1 (forms, bookings): numbers, dates, spelling names. 2 parts/day.",
        Reading: "Section 1 short texts. Intro to True / False / Not Given.",
        Writing: "Letter types: learn formal, semi-formal and informal openings and closings. Write 1 formal letter.",
        Speaking: "Part 1 topics: home, work, hometown, daily routine. Answer + reason + example."
      }
    },
    {
      n: 3, phase: "P1", theme: "Workplace English",
      tasks: {
        Listening: "Part 2 (one speaker): maps and plans, multiple choice.",
        Reading: "Section 2 workplace texts. Matching information.",
        Writing: "1 semi-formal letter. Learn the 4-paragraph essay structure.",
        Speaking: "Part 2 technique: 1-min keyword notes, talk for the full 2 minutes."
      }
    },
    {
      n: 4, phase: "P1", theme: "First essay",
      tasks: {
        Listening: "Part 3 (discussion): multiple choice with distractors.",
        Reading: "Sentence and summary completion. Respect the word limits.",
        Writing: "First Task 2 opinion essay, then rewrite it from feedback.",
        Speaking: "Part 3: give opinions, compare past and present, speculate."
      }
    },
    {
      n: 5, phase: "P1", theme: "Review week",
      tasks: {
        Listening: "Timed Listening test. Replay misses with the transcript.",
        Reading: "Timed Reading test. Update the error log.",
        Writing: "Light week: re-read feedback, learn 10 linking phrases.",
        Speaking: "BBC 6 Minute English, then shadow the speakers for 5 minutes."
      },
      milestone: "Mini-mock (Listening + Reading)"
    },
    {
      n: 6, phase: "P2", theme: "The hard passage",
      tasks: {
        Listening: "Part 4 lecture: note completion. Read questions ahead.",
        Reading: "Section 3 long passage. Matching headings.",
        Writing: "1 informal letter + 1 discussion essay (both views + opinion).",
        Speaking: "Fluency drill: talk 2 minutes nonstop on a random topic."
      }
    },
    {
      n: 7, phase: "P2", theme: "Timing",
      tasks: {
        Listening: "Distractor hunt: find where speakers correct themselves.",
        Reading: "Strict 20 / 20 / 20 minute split. Guess, don't leave blanks.",
        Writing: "Advantages / disadvantages essay + 1 complaint letter.",
        Speaking: "Topic vocabulary: work, technology, environment, travel."
      }
    },
    {
      n: 8, phase: "P2", theme: "Full mock #1",
      tasks: {
        Listening: "Full mock in test order: Listening → Reading → Writing.",
        Reading: "Spend a full session reviewing mock mistakes by type.",
        Writing: "Problem / solution essay. Compare its band with week 1.",
        Speaking: "Full 14-minute mock with Ashutosh as examiner."
      },
      milestone: "Full mock #1 scored"
    },
    {
      n: 9, phase: "P2", theme: "Attack the weakest type",
      tasks: {
        Listening: "Australian and British accent practice (Parts 3 and 4).",
        Reading: "Drill whatever question type the error log flags most.",
        Writing: "Two-part question essay + 1 request letter.",
        Speaking: "Record and fix fillers (“umm”, “like”) and long pauses."
      }
    },
    {
      n: 10, phase: "P2", theme: "Grammar range",
      tasks: {
        Listening: "Part 4 at speed: 2 lectures/day.",
        Reading: "Section 3 only: 3 passages this week.",
        Writing: "Rewrite week: redo the two weakest essays using complex sentences and conditionals.",
        Speaking: "Use one conditional and one comparison in every Part 3 answer."
      }
    },
    {
      n: 11, phase: "P2", theme: "Full mock #2 + book the test",
      tasks: {
        Listening: "Full mock #2 in test order.",
        Reading: "If Reading is still below 6.0, try a free CELPIP practice test.",
        Writing: "Timed pair (letter + essay) in 60 minutes total.",
        Speaking: "Mock with a new person (tutor, friend) for unfamiliar questions."
      },
      milestone: "Book IELTS General Training for about 5 weeks out"
    },
    {
      n: 12, phase: "P3", theme: "Exam conditions",
      tasks: {
        Listening: "2 full Cambridge GT tests on two different days.",
        Reading: "2 full Cambridge GT tests on two different days.",
        Writing: "2 timed pairs. Mark against the band descriptors.",
        Speaking: "2 full mocks. Track the band for each criterion."
      }
    },
    {
      n: 13, phase: "P3", theme: "Computer format",
      tasks: {
        Listening: "Computer-delivered practice: typing answers, on-screen notes.",
        Reading: "Computer-delivered practice: highlight tool, no paper.",
        Writing: "Type both tasks with word count. Hit 170 / 270 words.",
        Speaking: "Cue cards from recent test reports (IELTS Liz, E2)."
      }
    },
    {
      n: 14, phase: "P3", theme: "Fix the leaks",
      tasks: {
        Listening: "1 full mock + redo every part she scored lowest on.",
        Reading: "1 full mock + error-log drills only.",
        Writing: "Write 2 essays on new question types she hasn't tried.",
        Speaking: "Mock with Ashutosh, scored on all 4 criteria."
      }
    },
    {
      n: 15, phase: "P3", theme: "Final mocks",
      tasks: {
        Listening: "2 final full mocks. Target 35+/40.",
        Reading: "2 final full mocks. Target 34+/40.",
        Writing: "2 final timed pairs. Keep only proven templates.",
        Speaking: "Last full mock. Then stop polishing and just talk."
      },
      milestone: "Every skill at or near target"
    },
    {
      n: 16, phase: "T", theme: "Taper & test",
      tasks: {
        Listening: "20 min/day of light practice only.",
        Reading: "One relaxed section mid-week. No new strategies.",
        Writing: "Re-read letter openings and closings and the essay structure.",
        Speaking: "Speak English all week. Sleep well the night before."
      },
      milestone: "Test day 🎯"
    }
  ],
  dailyTemplate: [
    { day: "Mon", main: "Reading: one timed section + error log", short: "Speaking Part 1, recorded" },
    { day: "Tue", main: "Listening: two parts + transcript check", short: "Vocabulary review (10 words)" },
    { day: "Wed", main: "Writing Task 1: one letter (20 min) + review", short: "English podcast or news" },
    { day: "Thu", main: "Reading: one timed section + error log", short: "Speaking Part 2 cue card" },
    { day: "Fri", main: "Writing Task 2: one essay (40 min) + review", short: "Listening dictation (10 min)" },
    { day: "Sat", main: "Listening: full test (30 min)", short: "Speaking Part 3 with Ashutosh" },
    { day: "Sun", main: "Rest (weeks 6–11: extra letter + essay)", short: "Update the tracker" }
  ],
  dailyNote: "Main block 45–60 min · short block 20–30 min. In weeks 12–15, two days become full mocks (Listening → Reading → Writing).",
  skillCards: [
    {
      skill: "Reading",
      format: ["60 minutes, 40 questions", "Section 1: short everyday texts (ads, notices)", "Section 2: workplace texts (job ads, policies)", "Section 3: one long passage", "No extra time to copy answers"],
      strategies: [
        "About 20 minutes per section. The third is hardest, so don't overspend early.",
        "Skim the passage for 2 minutes, then scan for keywords and their synonyms.",
        "Answers to most question types appear in passage order.",
        "True/False/Not Given: “Not Given” means the text doesn't say. Don't use outside knowledge.",
        "Matching headings: read the first and last sentence of each paragraph first."
      ],
      daily: ["One timed section", "Error log: question type + reason missed", "15–20 min of English news (Indian Express → BBC)"],
      traps: ["Going over the word limit", "Spelling mistakes (they cost the mark)", "Leaving blanks: always guess"]
    },
    {
      skill: "Listening",
      format: ["About 30 minutes, 4 parts, 40 questions", "Part 1: everyday conversation", "Part 2: everyday talk (one speaker)", "Part 3: academic discussion", "Part 4: lecture. Each recording plays once"],
      strategies: [
        "Read the questions in the pause before each part. Predict the answer type (number, name, noun).",
        "Follow the question order. If she misses one, let it go and catch the next.",
        "Speakers often correct themselves: “Tuesday… no, Wednesday.” The last one counts.",
        "Write answers exactly as heard, singular vs plural included."
      ],
      daily: ["Two parts + replay misses with the transcript", "10 min dictation: write a 30-sec clip word for word", "BBC 6 Minute English on walks"],
      traps: ["Losing her place after a missed answer", "Mixed-up numbers (15 vs 50)", "Names spelled out letter by letter"]
    },
    {
      skill: "Writing",
      format: ["Task 1: letter, 150+ words, about 20 min", "Task 2: essay, 250+ words, about 40 min", "Task 2 is worth twice as much as Task 1", "Marked on task response, coherence, vocabulary, grammar"],
      strategies: [
        "Letter: cover all 3 bullet points and match the tone to the reader.",
        "Essay: intro (rephrase + position) → 2 body paragraphs (one idea + example each) → conclusion.",
        "Protect the 40 minutes for Task 2. Many people do it first.",
        "Spend 5 minutes planning and 3 minutes checking for errors."
      ],
      daily: ["Weeks 2–5: 1 letter + 1 essay a week", "Weeks 6–11: 2 + 2 a week, all marked", "Rewrite the weakest piece every week"],
      traps: ["Writing under the word count (penalised)", "Memorised paragraphs (examiners spot them)", "Wrong tone in letters"]
    },
    {
      skill: "Speaking",
      format: ["11–14 minutes, face to face with an examiner", "Part 1: questions about herself (4–5 min)", "Part 2: cue card, 1 min prep, up to 2 min talk", "Part 3: deeper discussion (4–5 min)"],
      strategies: [
        "Extend every answer: answer + reason + example.",
        "Part 2: jot 4–5 keywords, not sentences. Keep talking until stopped.",
        "Fluency beats fancy words. Self-correcting is fine.",
        "It's fine to ask the examiner to repeat a question."
      ],
      daily: ["Record one answer and listen back", "30 min of English-only talk at home", "Weekly Part 3 mock with Ashutosh"],
      traps: ["One-line answers", "Long silences while searching for a word", "Memorised answers that sound scripted"]
    }
  ],
  alternatives: [
    {
      title: "Plan B: CELPIP General",
      body: "Also accepted for Canada. Fully computer-based, Canadian English, one sitting of about 3 hours, offered in the US. If Reading is still below 6.0 in week 11, try a free CELPIP practice test before booking."
    },
    {
      title: "Plan C: PTE Core",
      body: "The newest accepted English test. Computer-scored, results in a few days. Worth a look if speaking to a live examiner turns out to be stressful."
    }
  ]
};
