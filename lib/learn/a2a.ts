import type { LearnPath } from "./types";

const A2A = "https://a2a-protocol.org/latest";
const DLAI = "https://www.deeplearning.ai/courses/a2a-the-agent2agent-protocol";

export const a2a: LearnPath = {
  slug: "a2a",
  title: "Agent-to-Agent (A2A)",
  kicker: "Study notes · two weeks · 3–4 h a week",
  length: "2 weeks",
  summary: "MCP connects an agent to its tools; A2A connects agents to each other. Learn the protocol and when to use which.",
  description:
    "A two-week course on the Agent2Agent (A2A) protocol v1.0: agent cards, tasks, streaming, and how A2A and MCP fit together in multi-agent systems.",
  intro:
    "A2A is the open protocol, now under the Linux Foundation, for agents built by different teams to discover each other and hand off work. This path pairs the spec with a hands-on course, then adds multi-agent design.",
  resources: [
    { label: "A2A documentation", href: `${A2A}/topics/what-is-a2a/`, role: "Source of truth", use: "Concepts, agent discovery, task lifecycle, enterprise features and the v1.0 spec" },
    { label: "A2A: The Agent2Agent Protocol", href: DLAI, role: "Guided hands-on", use: "About 1.5 h with Google Cloud and IBM: A2A servers and clients across ADK, LangGraph, Microsoft Agent Framework and BeeAI" },
    { label: "Agentic System Design Crash Course (Educative)", href: "https://www.educative.io/courses/agentic-system-design-crash-course", role: "Subscription course", use: "About 4 h on orchestration patterns, multi-agent case studies and autonomy vs safety trade-offs" }
  ],
  modules: [
    {
      id: "concepts",
      week: "Week 1",
      title: "Protocol concepts and A2A vs MCP",
      lead: "Understand agent cards, tasks and messages, and where A2A ends and MCP begins.",
      table: {
        head: ["", "MCP", "A2A"],
        rows: [
          ["Connects", "One agent to its tools and data", "Separate agents to each other"],
          ["Counterpart", "Mostly stateless, well-defined tools", "Autonomous agents with state and multi-turn dialogue"],
          ["Discovery", "server/discover, tools/list", "Agent card at /.well-known/agent-card.json"],
          ["Typical use", "Inside an agent", "Across teams or organizations"]
        ],
        source: { label: "A2A and MCP", href: `${A2A}/topics/a2a-and-mcp/` }
      },
      blocks: [
        {
          heading: "Read (~2 h)",
          ordered: true,
          items: [
            { label: "What is A2A?", href: `${A2A}/topics/what-is-a2a/` },
            { label: "A2A and MCP", href: `${A2A}/topics/a2a-and-mcp/`, note: "the auto-repair-shop example makes the split concrete" },
            { label: "Core concepts", href: `${A2A}/topics/key-concepts/` },
            { label: "Life of a task", href: `${A2A}/topics/life-of-a-task/` },
            { label: "Agent discovery", href: `${A2A}/topics/agent-discovery/`, note: "agent cards and the well-known path" }
          ]
        }
      ],
      checkpoint: "Given a system you work on, mark each boundary as MCP, A2A or a plain function call, and defend one choice."
    },
    {
      id: "build",
      week: "Week 2",
      title: "Build a small agent network",
      lead: "Wrap an agent as an A2A server, call it from another framework, and add the enterprise pieces.",
      blocks: [
        {
          heading: "Do (~4 h)",
          ordered: true,
          items: [
            { label: "A2A: The Agent2Agent Protocol", href: DLAI, note: "do the A2A server, client and Microsoft Agent Framework client lessons first" },
            { label: "A2A Python tutorials", href: `${A2A}/tutorials/` },
            { label: "Enterprise features", href: `${A2A}/topics/enterprise-ready/`, note: "auth, tracing and security between agents" },
            { label: "Agentic System Design Crash Course (Educative)", href: "https://www.educative.io/courses/agentic-system-design-crash-course", note: "the orchestration-pattern and multi-agent modules" }
          ]
        }
      ],
      notes: [{ label: "Watch for", text: "Inter-agent messages are untrusted input. The Agent Security path covers why (OWASP ASI07, insecure inter-agent communication)." }],
      checkpoint: "Two agents in different frameworks complete one task over A2A, and their spans join into one trace."
    }
  ],
  capstone: {
    lead: "Build a two-agent system where each agent uses MCP for its own tools and A2A to work together. Done when every line holds:",
    items: [
      "Each agent publishes an agent card at the well-known path",
      "A task moves through its lifecycle states and streams progress",
      "The calling agent authenticates to the remote agent",
      "Each agent's own tools are reached over MCP, not A2A",
      "A short write-up explains why each boundary uses the protocol it does"
    ]
  },
  references: [
    { label: "A2A specification", href: `${A2A}/specification/` },
    { label: "A2A and MCP", href: `${A2A}/topics/a2a-and-mcp/` },
    { label: "A2A on GitHub", href: "https://github.com/a2aproject" },
    { label: "DeepLearning.AI: A2A course", href: DLAI },
    { label: "Educative: Agentic System Design (full, 28 h)", href: "https://www.educative.io/courses/agentic-system-design", note: "the long version of the crash course, if the design side hooks you" }
  ],
  reviewed: "Last reviewed October 2026 against A2A v1.0."
};
