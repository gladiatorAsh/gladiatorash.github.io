/**
 * Hero diagram: how a request moves through the agent systems on this page.
 * Pure SVG, server-rendered. It draws itself once on load (CSS, see .system-map in globals.css),
 * then a single pulse follows one request through retrieval to the model. Reduced motion shows it static.
 */
const agents = [
  { id: "ocr", label: "ocr", note: "Reads scans and PDFs into text" },
  { id: "classify", label: "classify", note: "Decides what a document or question is" },
  { id: "extract", label: "extract", note: "Pulls fields into a strict schema" },
  { id: "retrieve", label: "retrieve", note: "Hybrid vector + keyword search" },
  { id: "rerank", label: "rerank", note: "Orders evidence by relevance" },
  { id: "tools", label: "tools", note: "Typed tool calls over MCP" },
  { id: "verify", label: "verify", note: "Checks output against rules and schema" },
  { id: "summarize", label: "summarize", note: "Writes the answer people read" }
];

const X0 = 78;
const STEP = 57;
const RACK_W = 30;
const retrieveX = X0 + 3 * STEP + RACK_W / 2;

// One request: user -> router -> orchestrator -> retrieve -> bus -> model.
const route = `path("M 22 24 H 80 V 48 M 80 68 V 84 M ${retrieveX} 102 V 182 V 206 H 480 V 226")`;

export function SystemMap() {
  return (
    <figure className="m-0">
      <svg
        className="system-map"
        viewBox="0 0 560 312"
        role="img"
        aria-labelledby="map-title map-desc"
      >
        <title id="map-title">How my agent systems are wired</title>
        <desc id="map-desc">
          A request reaches a router and an orchestrator, which hands work to eight specialist agents: OCR, classify, extract,
          retrieve, rerank, tools, verify and summarize. They share a bus to three stores and a language model.
        </desc>

        {/* request -> router -> orchestrator */}
        <g className="node">
          <title>Request: a question, a document or a scheduled job</title>
          <circle className="stroke draw" pathLength={1} cx="22" cy="24" r="10" style={{ "--d": 0 } as React.CSSProperties} />
          <text className="fade" x="38" y="16" style={{ "--d": 0 } as React.CSSProperties}>request</text>
        </g>
        <path className="stroke draw" pathLength={1} d="M 32 24 H 80 V 48" style={{ "--d": 1 } as React.CSSProperties} />
        <g className="node">
          <title>Router: picks the cheapest path that can do the job</title>
          <rect className="stroke draw" pathLength={1} x="70" y="48" width="20" height="20" style={{ "--d": 2 } as React.CSSProperties} />
          <text className="fade" x="98" y="62" style={{ "--d": 2 } as React.CSSProperties}>router</text>
        </g>
        <path className="stroke draw" pathLength={1} d="M 80 68 V 84" style={{ "--d": 3 } as React.CSSProperties} />
        <g className="node">
          <title>Orchestrator: plans steps, enforces limits and approvals</title>
          <rect className="stroke draw" pathLength={1} x="70" y="84" width="470" height="18" style={{ "--d": 3 } as React.CSSProperties} />
          <text className="fade" x="80" y="96" style={{ "--d": 3 } as React.CSSProperties}>orchestrator</text>
        </g>

        {/* specialist agents */}
        {agents.map((agent, i) => {
          const x = X0 + i * STEP;
          const cx = x + RACK_W / 2;
          return (
            <g key={agent.id} className="node">
              <title>{`${agent.label}: ${agent.note}`}</title>
              <path className="stroke draw" pathLength={1} d={`M ${cx} 102 V 120`} style={{ "--d": 4 + i * 0.5 } as React.CSSProperties} />
              <rect
                className="stroke draw"
                pathLength={1}
                x={x}
                y="120"
                width={RACK_W}
                height="62"
                style={{ "--d": 4 + i * 0.5 } as React.CSSProperties}
              />
              <path className="stroke draw" pathLength={1} d={`M ${cx} 182 V 202`} style={{ "--d": 5 + i * 0.5 } as React.CSSProperties} />
              <text
                className="fade agent-label"
                x={cx}
                y="151"
                textAnchor="middle"
                dominantBaseline="central"
                transform={`rotate(-90 ${cx} 151)`}
                style={{ "--d": 6 + i } as React.CSSProperties}
              >
                {agent.label}
              </text>
            </g>
          );
        })}

        {/* shared bus */}
        <rect className="stroke draw" pathLength={1} x="70" y="202" width="470" height="8" style={{ "--d": 9 } as React.CSSProperties} />

        {/* stores and model */}
        {[
          { x: 300, label: "search", note: "Azure AI Search: hybrid index" },
          { x: 342, label: "state", note: "Cosmos DB and Redis: memory and cache" },
          { x: 384, label: "files", note: "Blob storage: source documents" }
        ].map((store, i) => (
          <g key={store.label} className="node">
            <title>{store.note}</title>
            <path className="stroke draw" pathLength={1} d={`M ${store.x + 11} 210 V 232`} style={{ "--d": 10 + i } as React.CSSProperties} />
            <rect className="stroke draw" pathLength={1} x={store.x} y="232" width="22" height="72" style={{ "--d": 10 + i } as React.CSSProperties} />
            <text className="fade" x={store.x + 11} y="268" textAnchor="middle" dominantBaseline="central" transform={`rotate(-90 ${store.x + 11} 268)`} style={{ "--d": 12 } as React.CSSProperties}>
              {store.label}
            </text>
          </g>
        ))}
        <g className="node">
          <title>Language model: Azure OpenAI at work, free-tier models at home</title>
          <path className="stroke draw" pathLength={1} d="M 480 210 V 226" style={{ "--d": 12 } as React.CSSProperties} />
          <circle className="stroke draw" pathLength={1} cx="480" cy="265" r="39" style={{ "--d": 13 } as React.CSSProperties} />
          <text className="fade" x="480" y="268" textAnchor="middle" style={{ "--d": 14 } as React.CSSProperties}>model</text>
        </g>

        <circle className="pulse" r="3.2" style={{ "--route": route } as React.CSSProperties} />
      </svg>
      {/* On small screens the diagram's labels are too small to read, so the same path is spelled out. */}
      <figcaption className="mt-5 sm:hidden">
        <ol className="flow list-none p-0">
          {["request", "router", "orchestrator", "8 specialist agents", "search, state, files", "model"].map((s) => (
            <li key={s}>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
