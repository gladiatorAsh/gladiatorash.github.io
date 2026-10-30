import type { LearnPath } from "./types";

const ANTHROPIC_EVALS = "https://anthropic.com/engineering/demystifying-evals-for-ai-agents";
const DLAI = "https://learn.deeplearning.ai/courses/evaluating-ai-agents";
const FOUNDRY = "https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/agent-evaluators";
const FLOW = "https://github.com/flow-engineer/flow";

export const agentEvals: LearnPath = {
  slug: "agent-evals",
  title: "Agent Evaluation",
  kicker: "Study notes · three weeks · 3–4 h a week",
  length: "3 weeks",
  summary: "Test whether an agent picked the right tools, took a sensible path and finished the job, not just whether the last answer read well.",
  description:
    "A three-week course on evaluating AI agents: tasks, trials and graders, trajectory and tool-call evals, LLM-as-judge, and running evals on Azure AI Foundry and in CI.",
  intro:
    "Agents fail in the middle: a wrong tool, a bad argument, a loop. This path teaches evals that look at the whole run, then puts them on a platform and in CI so they gate releases.",
  resources: [
    { label: "Demystifying evals for AI agents", href: ANTHROPIC_EVALS, role: "Mental model", use: "Tasks, trials, graders, pass@k vs pass^k, capability vs regression suites (Anthropic, Jan 2026)" },
    { label: "Evaluating AI Agents", href: DLAI, role: "Guided hands-on", use: "About 2.5 h of notebooks with Arize: tracing, router and skill evals, trajectory evals, judge tuning" },
    { label: "Azure AI Foundry agent evaluators", href: FOUNDRY, role: "Enterprise platform", use: "Built-in task, intent and tool-use evaluators you can run on Azure" },
    { label: "LLM Evaluation (Educative)", href: "https://www.educative.io/courses/llm-evaluation", role: "Subscription course", use: "About 2 h on error analysis, pass/fail grading, agent workflows and evals in CI" }
  ],
  resourceNotes: [
    { label: "Read the transcripts.", text: "Every resource here says the same thing in different words: a score without the trace behind it hides whether the agent or the grader is wrong." }
  ],
  modules: [
    {
      id: "foundations",
      week: "Week 1",
      title: "How agent evals differ",
      lead: "Learn the vocabulary and the shape of a good eval suite before writing a single grader.",
      blocks: [
        {
          heading: "Read (~1.5 h)",
          ordered: true,
          items: [
            { label: "Demystifying evals for AI agents", href: ANTHROPIC_EVALS, note: "tasks and trials, code vs model vs human graders, why you read transcripts" },
            { label: "Agent trajectory evaluations (Arize)", href: "https://arize.com/docs/ax/evaluate/agent-trajectory-evaluations", note: "scoring the sequence of steps, not only the result" }
          ]
        },
        {
          heading: "Do (~2 h)",
          items: [
            { label: "Evaluating AI Agents, lessons 1–6", href: DLAI, note: "decompose an agent, build it, then trace every step" },
            { label: "LLM Evaluation (Educative)", href: "https://www.educative.io/courses/llm-evaluation", note: "the error-analysis and pass/fail modules" }
          ]
        }
      ],
      table: {
        head: ["Concept", "What it means", "Why it matters"],
        rows: [
          ["Task", "One test case: inputs plus success criteria", "The unit you count and track"],
          ["Trial", "One attempt at a task", "Agents vary run to run, so run several"],
          ["pass@k", "At least one of k trials succeeds", "Fine when one success is enough"],
          ["pass^k", "All k trials succeed", "The bar for customer-facing agents"],
          ["Capability eval", "What the agent can do; starts low", "Shows where to improve"],
          ["Regression eval", "What it must keep doing; near 100%", "Gates every release"]
        ],
        source: { label: "Anthropic, Demystifying evals for AI agents", href: ANTHROPIC_EVALS }
      },
      checkpoint: "Explain when you would report pass^k instead of pass@k, with an example from an agent you have built."
    },
    {
      id: "trajectory",
      week: "Week 2",
      title: "Tool-call, trajectory and judge evals",
      lead: "Grade the parts an agent can get wrong: routing, tool choice, arguments, use of results, and the path as a whole.",
      blocks: [
        {
          heading: "Do (~3 h)",
          ordered: true,
          items: [
            { label: "Evaluating AI Agents, lessons 7–13", href: DLAI, note: "router and skill evals, trajectory evals, structured experiments, improving the LLM judge" },
            "Write three graders for one of your agents: a code check on tool arguments, a trajectory check against an expected tool sequence, and an LLM judge for the final answer.",
            "Hand-label 20 runs and measure how often your judge agrees with you before trusting it."
          ]
        }
      ],
      notes: [{ label: "Rule of thumb", text: "Use code graders wherever the answer is checkable; save model graders for open-ended output, and calibrate them against human labels." }],
      checkpoint: "Your judge agrees with your hand labels on at least 80% of runs, and you can show one failure it caught that a final-answer check missed."
    },
    {
      id: "platform",
      week: "Week 3",
      title: "Evals on Azure AI Foundry and in CI",
      lead: "Run built-in agent evaluators on Azure, then make a regression suite block a bad release.",
      table: {
        head: ["Foundry evaluator", "What it checks"],
        rows: [
          ["Task Completion", "Did the agent deliver what the user asked for"],
          ["Task Adherence", "Did its actions follow the system message and policy"],
          ["Intent Resolution", "Did it identify and address the real intent"],
          ["Tool Selection", "Right tools, no unnecessary ones"],
          ["Tool Input Accuracy", "Correct parameters on every call"],
          ["Tool Output Utilization", "Did it use tool results correctly"],
          ["Task Navigation Efficiency", "Was the tool sequence efficient against ground truth"]
        ],
        source: { label: "Foundry agent evaluators", href: FOUNDRY }
      },
      blocks: [
        {
          heading: "Do (~3 h)",
          ordered: true,
          items: [
            { label: "Agent evaluators reference", href: FOUNDRY, note: "several are marked preview; check status before relying on one" },
            { label: "Evaluating AI Agents, lesson 14", href: DLAI, note: "monitoring agents after launch" },
            { label: "Flow Framework testing", href: `${FLOW}#testing`, note: "scenario files where a model plays the user, another plays the tools, and a judge grades the run" },
            { label: "LLMOps: Building Production-Ready LLM Systems (Educative)", href: "https://www.educative.io/courses/llmops/3jjQgnPpqZQ", note: "golden datasets and LLM-as-judge in a production pipeline" }
          ]
        }
      ],
      checkpoint: "A CI job runs your regression suite on every pull request and fails the build when pass^3 drops."
    }
  ],
  capstone: {
    lead: "Ship an eval suite for one real agent you own. Done when every line holds:",
    items: [
      "At least 30 tasks, split into a capability set and a regression set",
      "Each task runs at least 3 trials, and I report pass@k and pass^k",
      "Code graders for every checkable step; a calibrated judge for the rest",
      "At least one trajectory check against an expected tool sequence",
      "The regression set runs in CI and blocks merges",
      "I have read 20 failing transcripts and fixed either the agent or the grader"
    ]
  },
  references: [
    { label: "Demystifying evals for AI agents", href: ANTHROPIC_EVALS },
    { label: "Evaluating AI Agents (DeepLearning.AI with Arize)", href: DLAI },
    { label: "Foundry agent evaluators", href: FOUNDRY },
    { label: "Foundry built-in evaluators", href: "https://learn.microsoft.com/en-us/Azure/foundry/concepts/built-in-evaluators" },
    { label: "Arize: agent trajectory evaluations", href: "https://arize.com/docs/ax/evaluate/agent-trajectory-evaluations" },
    { label: "Flow Framework: testing", href: `${FLOW}#testing` }
  ],
  reviewed: "Last reviewed October 2026."
};
