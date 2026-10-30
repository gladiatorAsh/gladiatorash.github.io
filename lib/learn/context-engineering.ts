import type { LearnPath } from "./types";

const ANTHROPIC = "https://anthropic.com/engineering/effective-context-engineering-for-ai-agents";
const HF = "https://huggingface.co/learn/context-course";
const DLAI = "https://www.deeplearning.ai/courses/context-engineering";

export const contextEngineering: LearnPath = {
  slug: "context-engineering",
  title: "Context Engineering",
  kicker: "Study notes · three weeks · 2–3 h a week",
  length: "3 weeks",
  summary: "Decide what goes into the model's window and when: skills, sub-agents, compaction, memory and just-in-time retrieval.",
  description:
    "A three-week course on context engineering for AI agents: attention budgets, context rot, compaction, sub-agents, skills, hooks and retrieval.",
  intro:
    "Long-running agents fail when their context fills with noise. This path starts from one essay that names the problems, then works through a hands-on course that builds the fixes into real coding agents.",
  resources: [
    { label: "Effective context engineering for AI agents", href: ANTHROPIC, role: "Mental model", use: "Context rot, the attention budget, compaction, note-taking, sub-agents, just-in-time retrieval (Anthropic, Sept 2025)" },
    { label: "Hugging Face Context Course", href: `${HF}/unit0/introduction`, role: "Guided hands-on", use: "Skills, MCP, plugins, sub-agents and hooks, about 2–3 h a unit, with free certificates" },
    { label: "Context Engineering (DeepLearning.AI with Chroma)", href: DLAI, role: "Retrieval depth", use: "A long series; pick the retrieval and memory lessons rather than doing it all" }
  ],
  resourceNotes: [
    { label: "Skip what you've covered.", text: "Unit 2 of the HF course is MCP. If you've done the MCP path, skim it." }
  ],
  modules: [
    {
      id: "principles",
      week: "Week 1",
      title: "Principles and skills",
      lead: "Learn why more context can make an agent worse, then package know-how as skills that load only when needed.",
      blocks: [
        {
          heading: "Read (~1 h)",
          items: [{ label: "Effective context engineering for AI agents", href: ANTHROPIC }]
        },
        {
          heading: "Do (~2 h)",
          items: [
            { label: "Context Course Unit 0: onboarding", href: `${HF}/unit0/introduction`, note: "needs a code agent such as Claude Code, Codex or OpenCode" },
            "Context Course Unit 1: Agent Skills. Write a SKILL.md for one workflow you repeat at work."
          ]
        }
      ],
      table: {
        head: ["Technique", "What it does", "When to reach for it"],
        rows: [
          ["Compaction", "Summarize the history and restart with the summary", "Long conversations near the window limit"],
          ["Clearing tool results", "Drop old, bulky tool output", "Tool-heavy loops"],
          ["Structured notes", "Write progress to memory outside the window", "Multi-hour or multi-session tasks"],
          ["Sub-agents", "Do focused work in a clean window; return a short summary", "Broad research or parallel subtasks"],
          ["Just-in-time retrieval", "Keep references; load content with tools when needed", "Large corpora and codebases"]
        ],
        source: { label: "Anthropic, Effective context engineering", href: ANTHROPIC }
      },
      checkpoint: "For one agent you run, name its biggest source of wasted tokens and which technique above you'd apply."
    },
    {
      id: "orchestration",
      week: "Week 2",
      title: "Plugins, sub-agents and hooks",
      lead: "Bundle context for reuse, split work across clean windows, and observe or block steps in the agent loop.",
      blocks: [
        {
          heading: "Do (~3 h)",
          ordered: true,
          items: [
            "Context Course Unit 3: Plugins. Bundle your skill and an MCP server together.",
            "Context Course Unit 4: Sub-agents. Measure tokens in the lead agent with and without one.",
            "Context Course Unit 5: Hooks. Add a hook that blocks a risky command and one that logs every tool call."
          ]
        }
      ],
      checkpoint: "You can show token counts for one task before and after adding a sub-agent, and explain the difference."
    },
    {
      id: "retrieval-memory",
      week: "Week 3",
      title: "Retrieval, memory and a harness from scratch",
      lead: "Go below the tools: build a minimal agent loop and decide what it retrieves and remembers.",
      blocks: [
        {
          heading: "Do (~3 h)",
          ordered: true,
          items: [
            "Context Course Unit 6 (bonus): Nano Harness. Build a minimal agent loop yourself.",
            { label: "Context Engineering (DeepLearning.AI)", href: DLAI, note: "choose the retrieval and memory lessons" },
            "Add compaction and a notes file to your harness, then run it on a task that outlasts one window."
          ]
        }
      ],
      checkpoint: "Your harness finishes a task that needs more than one context window without losing track of its goal."
    }
  ],
  capstone: {
    lead: "Tune one real agent's context. Done when every line holds:",
    items: [
      "At least one workflow is a skill that loads on demand, not a standing prompt",
      "Bulky tool output is cleared or summarized after use",
      "Long tasks keep notes outside the window and survive compaction",
      "One sub-agent handles a focused subtask in its own window",
      "I've measured tokens per task before and after, and quality held or improved",
      "HF Context Fundamentals certificate earned"
    ]
  },
  references: [
    { label: "Anthropic: Effective context engineering for AI agents", href: ANTHROPIC },
    { label: "Hugging Face Context Course", href: `${HF}/unit0/introduction` },
    { label: "Context Course on GitHub", href: "https://github.com/huggingface/context-course" },
    { label: "DeepLearning.AI: Context Engineering", href: DLAI }
  ],
  reviewed: "Last reviewed October 2026."
};
