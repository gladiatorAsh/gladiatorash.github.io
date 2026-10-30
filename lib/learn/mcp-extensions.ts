import type { LearnPath } from "./types";

const EXT = "https://modelcontextprotocol.io/extensions";
const APPS_REPO = "https://github.com/modelcontextprotocol/ext-apps";
const SKILLS_SEP = "https://modelcontextprotocol.io/seps/2640-skills-extension";

export const mcpExtensions: LearnPath = {
  slug: "mcp-extensions",
  title: "MCP Apps and Skills",
  kicker: "Study notes · one week · 4–5 h",
  length: "1 week",
  summary: "The newest MCP extensions: interactive UIs served by MCP servers, and Agent Skills served over MCP.",
  description:
    "A one-week course on the MCP Apps and Skills extensions: ui:// resources rendered in hosts, skill:// resources, and the Tasks extension.",
  intro:
    "Core MCP gives an agent tools and data. Extensions add more: MCP Apps lets a server send a small interactive UI into the chat, and the Skills extension serves packaged know-how the agent loads when needed. Do the MCP path first.",
  resources: [
    { label: "MCP Apps (ext-apps)", href: APPS_REPO, role: "Spec and SDK", use: "@modelcontextprotocol/ext-apps packages, examples and a reference host" },
    { label: "SEP-1865: MCP Apps", href: "https://modelcontextprotocol.io/seps/1865-mcp-apps-interactive-user-interfaces-for-mcp", role: "Design record", use: "Why UIs are resources and how hosts sandbox them" },
    { label: "SEP-2640: Skills extension", href: SKILLS_SEP, role: "Design record", use: "How skills ride on MCP resources under skill:// with skills/list and skills/get" }
  ],
  modules: [
    {
      id: "apps",
      week: "Days 1–3",
      title: "MCP Apps: UIs from MCP servers",
      lead: "Return a chart or form from a tool call that the host renders inline, in a sandbox.",
      blocks: [
        {
          heading: "How it works",
          ordered: true,
          items: [
            "A tool declares a ui:// resource that holds its HTML.",
            "The model calls the tool.",
            "The host fetches the resource and renders it in a sandboxed iframe.",
            "The host passes tool data to the UI, and the UI can call other tools back through the host."
          ]
        },
        {
          heading: "Do (~2.5 h)",
          items: [
            { label: "MCP Apps overview", href: `${EXT}/apps/overview.md` },
            { label: "Build an MCP App", href: `${EXT}/apps/build.md` },
            { label: "ext-apps examples", href: `${APPS_REPO}/tree/main/examples`, note: "start from a React or vanilla template and run it in basic-host" },
            "Add a small results table UI to the server you built in the MCP path, and test it in a host that supports Apps."
          ]
        }
      ],
      checkpoint: "One of your tools returns a UI that renders inline and calls a second tool when you click a button."
    },
    {
      id: "skills-tasks",
      week: "Days 4–5",
      title: "Skills and Tasks over MCP",
      lead: "Serve Agent Skills from an MCP server, and handle long-running work with the Tasks extension.",
      blocks: [
        {
          heading: "Do (~2 h)",
          items: [
            { label: "Skills extension overview", href: `${EXT}/skills/overview.md` },
            { label: "SEP-2640", href: SKILLS_SEP, note: "skill files exposed as skill:// resources; the format itself follows the Agent Skills spec" },
            { label: "Agent Skills specification", href: "https://agentskills.io/specification", note: "SKILL.md frontmatter and progressive disclosure" },
            { label: "Tasks extension", href: `${EXT}/tasks/overview.md`, note: "polling-based long-running operations, moved out of core in 2026-07-28" },
            { label: "Extension support matrix", href: `${EXT}/client-matrix.md`, note: "which hosts implement what" }
          ]
        }
      ],
      notes: [{ label: "Real example", text: "Flow Framework already serves agent skills through its MCP server with a read_skill tool; compare its approach with SEP-2640." }],
      checkpoint: "A host lists a skill from your server with skills/list and loads its SKILL.md only when a task needs it."
    }
  ],
  capstone: {
    lead: "Extend your MCP-path server with both extensions. Done when every line holds:",
    items: [
      "One tool returns an MCP App UI that works in at least one host",
      "The UI calls back to a server tool through the host",
      "The server serves at least one skill under skill://",
      "A long-running tool uses the Tasks extension instead of blocking",
      "I checked the support matrix and documented which hosts work"
    ]
  },
  references: [
    { label: "MCP extensions overview", href: `${EXT}/overview.md` },
    { label: "ext-apps on GitHub", href: APPS_REPO },
    { label: "SEP-1865: MCP Apps", href: "https://modelcontextprotocol.io/seps/1865-mcp-apps-interactive-user-interfaces-for-mcp" },
    { label: "SEP-2640: Skills extension", href: SKILLS_SEP },
    { label: "Agent Skills specification", href: "https://agentskills.io/specification" }
  ],
  reviewed: "Last reviewed October 2026."
};
