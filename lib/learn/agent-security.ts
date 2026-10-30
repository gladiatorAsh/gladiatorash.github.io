import type { LearnPath } from "./types";

const OWASP = "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications/";
const MCP_SEC = "https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices.md";
const SHIELDS = "https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/content-filter-prompt-shields";
const REDTEAM = "https://learn.microsoft.com/azure/ai-foundry/concepts/ai-red-teaming-agent";
const AGENT_ID = "https://learn.microsoft.com/entra/agent-id";

export const agentSecurity: LearnPath = {
  slug: "agent-security",
  title: "Agent Security",
  kicker: "Study notes · three weeks · 3–4 h a week",
  length: "3 weeks",
  summary: "Prompt injection through tool output, least-privilege tools, agent identity, and red-teaming agents before they ship.",
  description:
    "A three-week course on securing AI agents: the OWASP Top 10 for Agentic Applications, MCP security, Azure Prompt Shields, Entra Agent ID and the Foundry AI Red Teaming Agent.",
  intro:
    "An agent that can act can be turned. This path starts from the OWASP agentic risk list, then maps each risk to concrete Azure controls: shields on inputs and tool output, real identities for agents, and automated red-teaming.",
  resources: [
    { label: "OWASP Top 10 for Agentic Applications", href: OWASP, role: "Threat model", use: "The ten agent-specific risks, released December 2025" },
    { label: "MCP Security Best Practices", href: MCP_SEC, role: "Protocol security", use: "Confused deputy, token passthrough, tool poisoning and local server risks" },
    { label: "Prompt Shields", href: SHIELDS, role: "Azure control", use: "Detect direct and indirect prompt injection, including in agent tool responses" },
    { label: "Microsoft Entra Agent ID", href: AGENT_ID, role: "Azure control", use: "Identities, blueprints, Conditional Access and governance for agents" },
    { label: "AI Red Teaming Agent", href: REDTEAM, role: "Azure testing", use: "PyRIT-based scans with agentic risk categories and an attack success rate" }
  ],
  resourceNotes: [
    { label: "No Educative pick here.", text: "I didn't find an Educative course on agent security; the vendor and OWASP material is stronger." }
  ],
  modules: [
    {
      id: "threats",
      week: "Week 1",
      title: "The agentic threat model",
      lead: "Learn the ten risks that are specific to agents, and how MCP's own security guidance addresses several of them.",
      table: {
        head: ["ID", "Risk"],
        rows: [
          ["ASI01", "Agent goal hijack"],
          ["ASI02", "Tool misuse and exploitation"],
          ["ASI03", "Identity and privilege abuse"],
          ["ASI04", "Agentic supply chain compromise"],
          ["ASI05", "Unexpected code execution"],
          ["ASI06", "Memory and context poisoning"],
          ["ASI07", "Insecure inter-agent communication"],
          ["ASI08", "Cascading failures"],
          ["ASI09", "Human-agent trust exploitation"],
          ["ASI10", "Rogue agents"]
        ],
        source: { label: "Speakeasy, OWASP Agentic Top 10 explained", href: "https://www.speakeasy.com/blog/owasp-agentic-top-10-explained" }
      },
      blocks: [
        {
          heading: "Read (~3 h)",
          ordered: true,
          items: [
            { label: "OWASP Top 10 for Agentic Applications", href: OWASP },
            { label: "MCP Security Best Practices", href: MCP_SEC },
            { label: "MCP Local Server Security", href: "https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/local-server-security.md" }
          ]
        }
      ],
      checkpoint: "For one agent you run, rank the ten risks by exposure and name the single change that would cut the top one most."
    },
    {
      id: "controls",
      week: "Week 2",
      title: "Controls: shields, identity, least privilege",
      lead: "Put guards on what goes into the model and give each agent its own identity with only the access it needs.",
      blocks: [
        {
          heading: "Inputs and tool output (~1.5 h)",
          items: [
            { label: "Prompt Shields", href: SHIELDS, note: "user prompt attacks, document attacks, and scanning agent tool responses (preview)" },
            "Turn on document-attack detection and spotlighting for one retrieval path, and log in annotate mode before you block."
          ]
        },
        {
          heading: "Identity and access (~2 h)",
          items: [
            { label: "What are agent identities", href: "https://learn.microsoft.com/en-us/entra/agent-id/what-are-agent-identities" },
            { label: "Plan your agent identity architecture", href: "https://learn.microsoft.com/en-us/entra/agent-id/how-to-plan-agent-identity-architecture" },
            { label: "Conditional Access for agents", href: "https://learn.microsoft.com/en-us/entra/identity/conditional-access/agent-id" },
            "Split one broad tool into read and write tools, require approval on the write path, and mark each with honest MCP annotations."
          ]
        }
      ],
      notes: [{ label: "Remember", text: "A clean shield result doesn't mean the input is safe. Shields cut risk; least privilege limits the damage when one gets through." }],
      checkpoint: "Your agent runs as its own Entra identity, cannot call any write tool without approval, and flags injected text in a retrieved document."
    },
    {
      id: "red-team",
      week: "Week 3",
      title: "Red-team the agent before launch",
      lead: "Attack your own agent with automated scans, measure the success rate, fix, and re-run.",
      blocks: [
        {
          heading: "Do (~3 h)",
          ordered: true,
          items: [
            { label: "AI Red Teaming Agent concepts", href: REDTEAM, note: "agentic categories: prohibited actions, sensitive data leakage, task adherence, indirect prompt injection" },
            { label: "Run a cloud scan", href: "https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/run-ai-red-teaming-cloud", note: "agentic categories are cloud-only, in selected regions" },
            { label: "PyRIT", href: "https://github.com/microsoft/PyRIT", note: "the open-source engine underneath, for custom attacks" },
            "Run against a non-production copy with mock tools, never against live systems."
          ]
        }
      ],
      checkpoint: "You have a before-and-after attack success rate for indirect prompt injection on one agent."
    }
  ],
  capstone: {
    lead: "Harden one real agent. Done when every line holds:",
    items: [
      "A written threat model maps the agent to the OWASP agentic risks",
      "Prompt Shields scan user input and retrieved documents",
      "The agent has its own identity with least-privilege access",
      "Destructive tools need human approval and are annotated as destructive",
      "A red-team scan runs before each release and its success rate is tracked",
      "Secrets never appear in prompts, tool arguments or traces"
    ]
  },
  references: [
    { label: "OWASP Top 10 for Agentic Applications", href: OWASP },
    { label: "MCP Security Best Practices", href: MCP_SEC },
    { label: "Azure Prompt Shields", href: SHIELDS },
    { label: "Microsoft Entra Agent ID", href: AGENT_ID },
    { label: "Foundry AI Red Teaming Agent", href: REDTEAM },
    { label: "PyRIT on GitHub", href: "https://github.com/microsoft/PyRIT" }
  ],
  reviewed: "Last reviewed October 2026."
};
