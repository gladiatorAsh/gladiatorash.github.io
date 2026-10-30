import type { LearnPath, Link, Module, Resource } from "./types";

const DOCS = "https://modelcontextprotocol.io/docs/2026-07-28";
const SPEC = "https://modelcontextprotocol.io/specification/2026-07-28";
const HF = "https://huggingface.co/learn/mcp-course";
const FLOW = "https://github.com/flow-engineer/flow";


const resources: Resource[] = [
  { label: "Official MCP docs", href: "https://modelcontextprotocol.io/docs/", role: "Source of truth", use: "Concepts, the current spec (2026-07-28), SDKs, security, Inspector" },
  { label: "Hugging Face MCP Course", href: `${HF}/en/unit0/introduction`, role: "Guided hands-on", use: "Units 1–3 with quizzes, projects and two free certificates" },
  { label: "Mastering MCP (Educative)", href: "https://www.educative.io/courses/advanced-model-context-protocol", role: "Subscription course", use: "About 7 h on multi-server MCP, RAG servers, authorization and debugging" },
  { label: "Flow Framework", href: FLOW, role: "Real-world codebase", use: "How a production framework exposes tools as an MCP server, CLI and plugin" }
];

const modules: Module[] = [
  {
    id: "fundamentals",
    week: "Week 1",
    title: "Fundamentals and architecture",
    lead: "Explain hosts, clients and servers, the three server primitives, and how JSON-RPC messages flow between them.",
    blocks: [
      {
        heading: "Read (official docs, ~1.5 h)",
        ordered: true,
        items: [
          { label: "What is MCP?", href: `${DOCS}/getting-started/intro.md`, note: "the USB-C-for-AI framing and who supports it" },
          { label: "Architecture overview", href: `${DOCS}/learn/architecture.md`, note: "host, client, server; data layer vs transport layer" },
          { label: "Understanding MCP servers", href: `${DOCS}/learn/server-concepts.md`, note: "tools (model-controlled), resources (app-controlled), prompts (user-controlled)" },
          { label: "Understanding MCP clients", href: `${DOCS}/learn/client-concepts.md`, note: "elicitation and what clients offer back" },
          { label: "Versioning", href: `${DOCS}/learn/versioning.md`, note: "date-based versions, and why they matter for SDK choice" }
        ]
      },
      {
        heading: "Do (HF Unit 1, ~2 h)",
        items: [
          { label: "Key Concepts", href: `${HF}/en/unit1/key-concepts` },
          { label: "Architectural Components", href: `${HF}/en/unit1/architectural-components`, note: "then Quiz 1" },
          { label: "The Communication Protocol", href: `${HF}/en/unit1/communication-protocol` },
          { label: "Capabilities", href: `${HF}/en/unit1/capabilities` },
          { label: "MCP SDK", href: `${HF}/en/unit1/sdk`, note: "then Quiz 2" },
          { label: "MCP Clients", href: `${HF}/en/unit1/mcp-clients` },
          { label: "Gradio MCP Integration", href: `${HF}/en/unit1/gradio-mcp` },
          { label: "Claim the Fundamentals certificate", href: `${HF}/en/unit1/certificate` }
        ]
      },
      {
        heading: "Optional (Educative, ~2 h)",
        items: [{ label: "MCP Fundamentals for Building AI Agents", href: "https://www.educative.io/courses/model-context-protocol", note: "a faster second pass on host, client and server roles" }]
      }
    ],
    notes: [
      {
        label: "Lab",
        text: "Open the MCP Inspector against any example server. List tools, call one, read a resource, and watch the raw JSON-RPC traffic."
      }
    ],
    checkpoint: "Explain in two minutes the M×N integration problem and why tools, resources and prompts have different controllers."
  },
  {
    id: "first-server",
    week: "Week 2",
    title: "Build your first server and client",
    lead: "Ship a working stdio server with the current SDK, connect it to a host, then write a client that drives it.",
    blocks: [
      {
        heading: "Build the server (~2 h)",
        items: [
          { label: "Build an MCP server", href: `${DOCS}/develop/build-server.md`, note: "a weather server with get_alerts and get_forecast" },
          "Python SDK 2.0.0+ uses the MCPServer class; older tutorials, including the HF course, use FastMCP. Same idea, older API.",
          "Try the C# tab too: ModelContextProtocol on NuGet with [McpServerTool] attributes. C# is a Tier 1 SDK.",
          "The rule that bites everyone: on stdio, never write to stdout. Log to stderr.",
          "Any MCP host works for testing, including VS Code."
        ]
      },
      {
        heading: "Build the client (~1.5 h)",
        items: [
          { label: "Build an MCP client", href: `${DOCS}/develop/build-client.md` },
          { label: "Client Best Practices", href: `${DOCS}/develop/clients/client-best-practices.md`, note: "patterns for hosts juggling many servers" }
        ]
      },
      {
        heading: "Verify against both protocol eras",
        items: [
          "Run the Inspector CLI once with --protocol-era modern and once with --protocol-era legacy; both must list your tools.",
          { label: "Inspector CLI", href: `${DOCS}/tools/inspector/cli.md` },
          { label: "Protocol eras", href: `${DOCS}/tools/inspector/protocol-eras.md` }
        ]
      }
    ],
    notes: [{ label: "Stretch", text: "Add one resource (a static config file) and one prompt (a reusable “summarize alerts” template), so you have used all three primitives." }],
    checkpoint: "Your server passes tools/list in both eras and you can read the JSON-RPC for one tools/call round trip."
  },
  {
    id: "end-to-end",
    week: "Week 3",
    title: "End-to-end MCP application",
    lead: "Build and deploy a sentiment-analysis MCP server with Gradio, then reach it from two different clients.",
    blocks: [
      {
        heading: "Do (HF Unit 2, ~3 h)",
        ordered: true,
        items: [
          { label: "Unit 2 introduction", href: `${HF}/en/unit2/introduction`, note: "Python 3.10+, Node 18+ and a free HF account" },
          { label: "Gradio server", href: `${HF}/en/unit2/gradio-server`, note: "mcp_server=True turns a typed Python function into an MCP tool; deploy it to a free HF Space" },
          { label: "Gradio as a client", href: `${HF}/en/unit2/gradio-client`, note: "a smolagents MCPClient wrapped in a UI" },
          { label: "Tiny Agents", href: `${HF}/unit2/tiny-agents`, note: "a JSON-configured agent in JS or Python that uses your deployed server" }
        ]
      }
    ],
    notes: [
      { label: "Watch for", text: "The course connects over /gradio_api/mcp/sse and bridges with mcp-remote. HTTP+SSE is now a deprecated transport; finish the unit and revisit it in week 5." },
      { label: "Why it's worth it", text: "Seeing one server serve two unrelated clients is the core MCP promise made concrete, and HF Spaces host it for free." }
    ],
    checkpoint: "Your Space URL works from both a Tiny Agent and the Inspector. Units 2 and 3 together earn the HF certificate of completion."
  },
  {
    id: "workflow-servers",
    week: "Week 4",
    title: "Advanced workflow servers",
    lead: "Build a PR-workflow server that uses tools, resources and prompts together, then a webhook-driven agent that acts on its own.",
    blocks: [
      {
        heading: "Unit 3: custom workflow servers (~3 h)",
        ordered: true,
        items: [
          { label: "Unit 3 introduction", href: `${HF}/unit3/introduction`, note: "tools that pick the right PR template from changed files" },
          { label: "GitHub Actions integration", href: `${HF}/unit3/github-actions-integration`, note: "a webhook receiver, CI-status tools and four MCP prompts" },
          "Team notifications (Slack) that combine all three primitives.",
          { label: "Solution walkthrough", href: `${HF}/unit3/build-mcp-server-solution-walkthrough` }
        ]
      },
      {
        heading: "Unit 3.1: PR agent on the Hub (~2 h)",
        items: [
          { label: "Unit 3.1", href: `${HF}/unit3_1/introduction`, note: "a FastMCP server wired to a FastAPI webhook listener that opens tagging PRs" },
          { label: "Setting up the project", href: `${HF}/unit3_1/setting-up-the-project` }
        ]
      }
    ],
    notes: [
      { label: "The pattern", text: "An HTTP service receives an event, an agent calls MCP tools, a side effect lands. The same shape works with any event source." },
      { label: "Do the exercises", text: "The custom workflow prompt and event filtering exercises are where prompts click." }
    ],
    checkpoint: "Explain when you would make something a prompt rather than a tool, with one example from your own server."
  },
  {
    id: "production",
    week: "Week 5",
    title: "Production MCP: current spec, transports, auth, security",
    lead: "Close the gap between what the HF course teaches and the 2026-07-28 spec, then cover what a remote server needs in front of real users.",
    table: {
      head: ["Topic", "What the HF course shows", "Current spec (2026-07-28)"],
      rows: [
        ["Handshake", "initialize, then initialized", "Stateless: version and client capabilities ride in each request's _meta; servers must implement server/discover"],
        ["Sessions", "Mcp-Session-Id header", "Removed; cross-call state uses server-minted handles passed as tool arguments"],
        ["Remote transport", "HTTP+SSE (/mcp/sse)", "Streamable HTTP; HTTP+SSE is deprecated"],
        ["Server asking the client", "sampling, elicitation and roots requests", "Multi Round-Trip Requests: server returns input_required, client retries with answers"],
        ["Change notifications", "GET stream, resources/subscribe", "One subscriptions/listen POST stream"],
        ["Roots, Sampling, Logging", "Core features", "Deprecated (SEP-2577): use tool params, direct LLM calls, stderr or OpenTelemetry"],
        ["Long-running work", "Experimental tasks in core", "io.modelcontextprotocol/tasks extension with polling"],
        ["Results", "No type tag", "Required resultType, plus ttlMs and cacheScope on list results"]
      ],
      source: { label: "2026-07-28 changelog", href: `${SPEC}/changelog.md` }
    },
    blocks: [
      {
        heading: "Read (~3 h)",
        items: [
          { label: "Spec: Architecture", href: `${SPEC}/architecture/index.md` },
          { label: "Streamable HTTP", href: `${SPEC}/basic/transports/streamable-http.md` },
          { label: "Multi Round-Trip Requests", href: `${SPEC}/basic/patterns/mrtr.md` },
          { label: "Tools", href: `${SPEC}/server/tools.md` },
          { label: "Deprecated Features", href: `${SPEC}/deprecated.md` },
          { label: "Understanding Authorization", href: `${DOCS}/tutorials/security/authorization.md`, note: "OAuth 2.1" },
          { label: "Enterprise-Managed Authorization", href: "https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization.md", note: "IdP-centred access control" },
          { label: "Security Best Practices", href: `${DOCS}/tutorials/security/security_best_practices.md`, note: "tool poisoning, confused deputy, token passthrough" },
          { label: "Local Server Security", href: `${DOCS}/tutorials/security/local-server-security.md` },
          { label: "Extensions overview", href: "https://modelcontextprotocol.io/extensions/overview.md", note: "Apps, Tasks, Skills" },
          { label: "MCP Registry quickstart", href: "https://modelcontextprotocol.io/registry/quickstart.md" },
          { label: "Mastering MCP (Educative)", href: "https://www.educative.io/courses/advanced-model-context-protocol", note: "the multi-server and authorization modules; check them against the current spec" }
        ]
      }
    ],
    notes: [
      {
        label: "Lab",
        text: "Port your week-3 server to Streamable HTTP with the current SDK, put it behind OAuth, and pass the Inspector in the modern era."
      }
    ],
    checkpoint: "Explain why removing sessions makes MCP servers easier to scale behind a load balancer."
  },
  {
    id: "flow",
    week: "Week 6",
    title: "MCP inside Flow Framework",
    lead: "Flow turns the same zod-typed tools written for a chat agent into an MCP server, a CLI and native plugins. Trace that path and find a first contribution.",
    table: {
      head: ["MCP concept", "How Flow does it", "Where to look"],
      rows: [
        ["Server + transport", "mcpServer({ name, version, tools, dir }) serves Streamable HTTP at /mcp on the official SDK", "mcp/src"],
        ["Tool metadata", "title, output, status and hints become MCP annotations (readOnly, destructive, idempotent, openWorld)", "mcp/src"],
        ["Instructions", "Agent skills ship as server instructions plus a read_skill tool", "mcp/src, coding-agents/"],
        ["Authorization", "Host OAuth against your own issuer; signIn per tool; 401 triggers the host's sign-in", "coding-agents/auth-skill.md"],
        ["Consuming servers", "mcpTools({ name, url }) imports another server's tools, pinned in mcp.lock.json", "mcp/src"],
        ["CLI over MCP", "Stricli CLI where every tool is a command with --json, --dry-run, --yes", "cli/src"],
        ["Plugins", "flow plugin emits Claude Code and Agent Plugins 1.0.0 packages", "README"],
        ["Observability", "tool.start / tool.end events and OTLP traces per tool call", "README"]
      ],
      source: { label: "Flow README", href: FLOW }
    },
    blocks: [
      {
        heading: "Lab (~3 h)",
        ordered: true,
        items: [
          { label: "Read AGENTS.md first", href: `${FLOW}/blob/main/AGENTS.md`, note: "then npm ci, npm run new -- my-agent, npm start" },
          "Expose the café example's tools with mcpServer and connect the Inspector in both protocol eras.",
          "Point any MCP host at it and call get_menu.",
          "Generate the CLI with npx flow cli --server <url> -h and run npx flow check.",
          "Follow one tool from its tool({...}) definition to the tools/list JSON the Inspector shows."
        ]
      },
      {
        heading: "Contribution hunt",
        items: [
          "Does the server answer server/discover and return resultType and ttlMs/cacheScope per 2026-07-28, or only the legacy handshake?",
          "Are tools/list results in deterministic order, as the spec now recommends for client caching?",
          "Do the mcp/ tests cover both protocol eras?"
        ]
      }
    ],
    checkpoint: "A draft issue or PR on Flow's mcp/ or cli/ package, grounded in a spec section you can cite."
  }
];

const capstoneItems = [
  "I can draw host → client → server and say what each primitive's controller is",
  "My server passes the Inspector in both modern and legacy eras",
  "It has at least one tool, one resource and one prompt",
  "It runs over Streamable HTTP, not HTTP+SSE, and uses no deprecated features",
  "It requires OAuth for any non-read-only tool, and its tool annotations are honest",
  "I have reviewed it against the Security Best Practices page",
  "HF Fundamentals certificate (Unit 1) and completion certificate (Units 2–3) earned",
  "One issue or PR opened on Flow's MCP or CLI package"
];

const references: Link[] = [
  { label: "MCP docs index (llms.txt)", href: "https://modelcontextprotocol.io/llms.txt", note: "every docs and spec page in one list" },
  { label: "Specification 2026-07-28", href: `${SPEC}/index.md`, note: "the authoritative protocol" },
  { label: "Schema reference", href: `${SPEC}/schema.md`, note: "exact message shapes" },
  { label: "Official SDKs", href: `${DOCS}/sdk.md`, note: "TypeScript, Python, C#, Go, Rust and Ruby are Tier 1" },
  { label: "MCP Inspector", href: `${DOCS}/tools/inspector.md`, note: "test and debug any server" },
  { label: "Debugging guide", href: `${DOCS}/tools/debugging.md`, note: "when a host won't see your server" },
  { label: "Example servers", href: "https://modelcontextprotocol.io/examples.md", note: "reference implementations" },
  { label: "SEP index", href: "https://modelcontextprotocol.io/seps/index.md", note: "where the protocol is heading" },
  { label: "HF MCP Course repo", href: "https://github.com/huggingface/mcp-course", note: "course source, issues and Discord" }
];


export const mcp: LearnPath = {
  slug: "mcp",
  title: "MCP Learning Path",
  kicker: "Study notes · six weeks · 3–4 h a week",
  length: "6 weeks",
  summary: "Model Context Protocol from concepts to shipping and contributing to an MCP server.",
  description:
    "A six-week course for learning the Model Context Protocol: the official docs, the Hugging Face MCP Course and Flow Framework, sequenced against the 2026-07-28 spec.",
  intro:
    "A course I put together for learning the Model Context Protocol, from concepts to shipping and contributing to an MCP server. It sequences three resources against the current 2026-07-28 spec.",
  resources,
  resourceNotes: [
    { label: "Flow is a chat-agent framework first.", text: "Its MCP support lives in the mcp/ and cli/ packages, so it is the place to see MCP applied, not to learn it from zero. It comes last." },
    { label: "The HF course predates the latest spec.", text: "Do it for the hands-on, then use week 5 to catch up on what changed." }
  ],
  modules,
  capstone: {
    lead: "Build one remote MCP server that uses all three primitives, runs on the current spec, and is published somewhere real, such as a free HF Space listed in the MCP Registry. Done when every line holds:",
    items: capstoneItems
  },
  references,
  reviewed: "Last reviewed October 2026 against MCP spec 2026-07-28."
};
