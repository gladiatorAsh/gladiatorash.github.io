import type { LearnPath } from "./types";

const DASH0 = "https://dash0.com/knowledge/opentelemetry-genai-semantic-conventions-explained";
const OTEL = "https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans";
const FOUNDRY_CONCEPT = "https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept";
const FOUNDRY_SETUP = "https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-agent-setup";
const VSCODE = "https://code.visualstudio.com/docs/agents/guides/monitoring-agents";
const FLOW = "https://github.com/flow-engineer/flow";

export const agentObservability: LearnPath = {
  slug: "agent-observability",
  title: "Agent Observability",
  kicker: "Study notes · two weeks · 3–4 h a week",
  length: "2 weeks",
  summary: "Trace model calls, tool calls, tokens and cost across a multi-agent system with OpenTelemetry's GenAI conventions.",
  description:
    "A two-week course on observing AI agents with OpenTelemetry GenAI semantic conventions, Azure AI Foundry tracing and Application Insights.",
  intro:
    "When an agent misbehaves in production, the trace is the only witness. This path covers the shared vocabulary for agent telemetry, then wires it into Azure so every run can be replayed.",
  resources: [
    { label: "OpenTelemetry GenAI conventions, explained", href: DASH0, role: "Mental model", use: "Agent and tool spans, gen_ai.* attributes, token and agent metrics, current status" },
    { label: "Foundry agent tracing", href: FOUNDRY_CONCEPT, role: "Enterprise platform", use: "OTel traces for Foundry agents, stored in Application Insights" },
    { label: "VS Code: monitor agents with OpenTelemetry", href: VSCODE, role: "Local lab", use: "Export Copilot agent telemetry to the Aspire dashboard or Jaeger on your laptop" }
  ],
  resourceNotes: [
    { label: "The conventions are still in Development.", text: "Names can change between releases, and in June 2026 they moved to a new semantic-conventions-genai repository. Pin your instrumentation version." },
    { label: "No Educative pick here.", text: "I didn't find an Educative course that teaches agent tracing in depth; the free material above is better." }
  ],
  modules: [
    {
      id: "conventions",
      week: "Week 1",
      title: "The GenAI telemetry vocabulary",
      lead: "Learn the span shapes, attributes and metrics that every agent framework is converging on.",
      table: {
        head: ["Signal", "Name", "What it captures"],
        rows: [
          ["Span", "invoke_agent", "One agent run; nested for sub-agents and agent-to-agent calls"],
          ["Span", "execute_tool", "One tool call, including calls made over MCP"],
          ["Span", "chat / embeddings / retrieval", "Model inference and retrieval steps"],
          ["Span", "invoke_workflow, plan", "Multi-agent workflows and planning phases"],
          ["Metric", "gen_ai.client.token.usage", "Tokens by type, operation and model; the basis for cost"],
          ["Metric", "gen_ai.invoke_agent.tool_calls", "Tool calls per run; compare with inference calls to spot loops"]
        ],
        source: { label: "Dash0 explainer", href: DASH0 }
      },
      blocks: [
        {
          heading: "Read (~2 h)",
          ordered: true,
          items: [
            { label: "OpenTelemetry GenAI semantic conventions explained", href: DASH0 },
            { label: "OTel GenAI agent spans", href: OTEL, note: "now a pointer to the new repository; check it for the latest names" },
            { label: "Foundry agent tracing concepts", href: FOUNDRY_CONCEPT, note: "includes the multi-agent conventions Microsoft and Cisco Outshift contributed" }
          ]
        }
      ],
      notes: [
        { label: "Privacy default", text: "Prompt and response text are opt-in events, not span attributes, because they often hold personal data. Keep secrets out of tool arguments." }
      ],
      checkpoint: "Sketch the trace tree for a supervisor agent that calls two sub-agents, one of which calls an MCP tool."
    },
    {
      id: "wire-it",
      week: "Week 2",
      title: "Wire it up locally and on Azure",
      lead: "See traces on your laptop first, then send the same signals to Application Insights through Foundry.",
      blocks: [
        {
          heading: "Do (~4 h)",
          ordered: true,
          items: [
            { label: "Monitor agents with OpenTelemetry (VS Code)", href: VSCODE, note: "run the Aspire dashboard or Jaeger and watch real agent spans arrive" },
            { label: "Set up tracing in Foundry", href: FOUNDRY_SETUP, note: "connect Application Insights and instrument your framework" },
            { label: "Flow Framework events and traces", href: `${FLOW}#state-restarts-and-hosting`, note: "every turn, model call, tool and schedule is an event; OTLP traces optional" },
            "Build one dashboard: runs per hour, p95 latency per tool, tokens and cost per agent, and tool calls per run."
          ]
        }
      ],
      notes: [{ label: "Pair with evals", text: "Traces feed evals. Sample production traces into the regression set from the Agent Evaluation path." }],
      checkpoint: "From one bad answer in production, you can open its trace and name the step that went wrong in under five minutes."
    }
  ],
  capstone: {
    lead: "Instrument one real agent end to end. Done when every line holds:",
    items: [
      "Every run produces an invoke_agent span with nested execute_tool spans",
      "Token usage and cost per agent are on a dashboard",
      "Prompt content capture is off by default and redaction is in place",
      "An alert fires when tool calls per run spike, a sign of looping",
      "Traces land in Application Insights for the Azure deployment",
      "I can link any eval failure to its trace"
    ]
  },
  references: [
    { label: "Dash0: GenAI semantic conventions explained", href: DASH0 },
    { label: "OpenTelemetry GenAI agent spans", href: OTEL },
    { label: "Foundry: trace agents (concepts)", href: FOUNDRY_CONCEPT },
    { label: "Foundry: set up tracing", href: FOUNDRY_SETUP },
    { label: "VS Code: monitor agent usage with OpenTelemetry", href: VSCODE }
  ],
  reviewed: "Last reviewed October 2026."
};
