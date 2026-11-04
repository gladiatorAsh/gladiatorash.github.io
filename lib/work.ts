// Long-form case studies for /work/<slug>/. Keep every claim to what was actually built;
// add measured numbers (latency, cost, accuracy) to `results` only when they are known.

export type Stage = { name: string; detail: string };
export type Decision = { choice: string; why: string; tradeoff: string };
export type Incident = { what: string; fix: string };

export type WorkCaseStudy = {
  slug: string;
  /** Title of the matching entry in `projects` (lib/portfolio.ts), for the "Read the case study" link. */
  project: string;
  title: string;
  kicker: string;
  summary: string;
  description: string;
  role: string;
  period: string;
  proof: { value: string; label: string }[];
  problem: string[];
  owned: string[];
  stages: Stage[];
  decisions: Decision[];
  incidents: Incident[];
  results: string[];
  lessons: string[];
  stack: string[];
};

export const caseStudies: WorkCaseStudy[] = [
  {
    slug: "crystal",
    project: "Crystal RAG + Copilot Platform",
    title: "Crystal: an enterprise RAG and copilot platform",
    kicker: "Case study · 2024 to present · enterprise client",
    summary: "Grounded, permission-aware answers inside Teams, CRM and Office for 2K+ active users.",
    description:
      "How I led Crystal, a retrieval-augmented copilot platform on Azure: hybrid search, reranking, security trimming, grounded citations and the feedback loop that keeps it honest.",
    role: "Technical lead and architect. I led the team that designed, built and runs the platform.",
    period: "2024 to present",
    proof: [
      { value: "2K+", label: "active users" },
      { value: "4", label: "front ends: Teams, CRM, Office, web" },
      { value: "1", label: "shared retrieval platform behind all of them" }
    ],
    problem: [
      "Knowledge workers were answering the same questions by digging through documents spread across several systems. They needed answers in the tools they already worked in, with a source they could check.",
      "Two constraints shaped everything. Answers had to respect who was asking, so nobody could see content they couldn't already open. And retrieval had to be fast enough to feel like part of Teams or CRM, not a separate search tool."
    ],
    owned: [
      "The platform architecture, from ingestion through retrieval, orchestration and the API tier",
      "Retrieval design: hybrid search, reranking and permission trimming",
      "Delivery of the Teams, CRM, Office and React experiences on top of one shared back end",
      "Design reviews, technical direction and mentoring for the engineering team"
    ],
    stages: [
      { name: "Ingest", detail: "Content is pulled from the source systems with its metadata and access control lists, then normalized so every chunk keeps a link back to the original document." },
      { name: "Enrich and chunk", detail: "Documents are cleaned, split and embedded. Chunking quality turned out to decide retrieval quality more than any later step." },
      { name: "Index", detail: "Azure AI Search stores the text, vectors and permission fields together, so a single query can filter by identity." },
      { name: "Retrieve", detail: "Hybrid retrieval runs vector and BM25 keyword search together, trimmed to what the caller is allowed to see." },
      { name: "Rerank", detail: "Semantic ranking and a cross-encoder reorder candidates, so the model gets fewer and better passages." },
      { name: "Generate", detail: "Azure OpenAI answers only from the retrieved passages, returns structured output and cites each source." },
      { name: "Learn", detail: "Feedback and telemetry from every front end flow back into one view of answer quality." }
    ],
    decisions: [
      {
        choice: "Hybrid retrieval (vector plus BM25), not vectors alone",
        why: "Enterprise questions are full of product names, IDs and acronyms that embeddings blur together. Keyword search catches the exact terms and vectors catch the meaning.",
        tradeoff: "Two ranking signals to tune, and a fusion step to keep stable as content changes."
      },
      {
        choice: "Rerank before generation",
        why: "Semantic and cross-encoder reranking let the model read a short list of strong passages instead of a long list of possible ones. That improves grounding and keeps prompts small.",
        tradeoff: "An extra step on every query, so reranking depth is capped to stay inside the latency budget."
      },
      {
        choice: "Enforce permissions at the index, not in the prompt",
        why: "Security trimming is applied as a filter inside the search query, so content a user can't open never reaches the model at all. A prompt is never the access control.",
        tradeoff: "ACLs have to be kept in sync with the source systems, and permission changes need a re-index path."
      },
      {
        choice: "One retrieval platform behind several front ends",
        why: "Teams, CRM, Office and the web app all call the same API, so a retrieval fix improves every surface at once and quality can be measured in one place.",
        tradeoff: "The shared API needs careful versioning, because every client depends on it."
      },
      {
        choice: "Cache by identity and freshness",
        why: "Caching cuts repeat cost and latency, but a cached answer must never cross a permission boundary or outlive the content it came from.",
        tradeoff: "Lower hit rates than a naive global cache, which is the right price for correctness."
      }
    ],
    incidents: [
      {
        what: "Permission-aware retrieval was the hardest part to get right. Answers have to match what each person can open in the source systems, and those permissions keep changing.",
        fix: "Permissions became indexed fields filtered inside every query, with a re-index path for ACL changes. Access is decided before generation, never by the model."
      },
      {
        what: "Prompt drift. As prompts, models and content changed, answer quality could slip without anyone noticing.",
        fix: "Feedback and telemetry are watched continuously, so a regression shows up as data rather than as a complaint."
      },
      {
        what: "Citation quality. A citation that points to roughly the right document isn't enough for users to trust an answer.",
        fix: "Every chunk keeps a link to its source, and the model has to answer from the retrieved passages and cite them in structured output."
      },
      {
        what: "Feedback was scattered across four front ends and several data sources, so nobody had a full picture of quality.",
        fix: "Feedback and telemetry from every surface go into one view, which made analytics part of the product loop instead of an afterthought."
      }
    ],
    results: [
      "In production serving 2K+ active users across Teams, CRM, Office and a React web app",
      "Answers are grounded with citations and trimmed to each user's permissions",
      "One shared retrieval platform, so improvements reach every surface at once"
    ],
    lessons: [
      "Retrieval quality beats prompt cleverness. Most bad answers trace back to the wrong passages, not the wrong wording.",
      "Caching has to be scoped by identity and freshness, or it becomes a data leak.",
      "Analytics belong inside the copilot product loop, not in a report someone reads later."
    ],
    stack: ["Azure OpenAI", "Azure AI Search", "Azure AI Foundry", "Python", "Teams", "Office", "Dynamics CRM", "React"]
  },
  {
    slug: "agentassist",
    project: "Agent Assist - Document Intelligence Platform",
    title: "Agent Assist: a multi-agent document intelligence pipeline",
    kicker: "Case study · 2025 to present · enterprise client",
    summary: "OCR, classification, translation, extraction and validation for 70K+ documents a month, with people reviewing only what needs them.",
    description:
      "How I designed Agent Assist, a multi-agent document pipeline on Azure that processes 70K+ documents a month: routing, confidence thresholds, human review and the deployment problems we hit on the way.",
    role: "Architect and technical lead. I designed the system and led the team that built and deploys it.",
    period: "2025 to present",
    proof: [
      { value: "70K+", label: "documents processed per month" },
      { value: "7", label: "pipeline stages, from intake to CRM hand-off" },
      { value: "Private", label: "VNet-restricted networking with Managed Identity" }
    ],
    problem: [
      "Support agents were receiving a high volume of documents in many formats and languages, and they handled each one by hand: read it, work out what it is, pull out the details, then key them into CRM.",
      "The goal was to do that work automatically and reliably, then send people only the documents that genuinely needed a human, without letting OCR and LLM costs grow in step with volume."
    ],
    owned: [
      "The end-to-end architecture: intake, agents, review queues and the CRM hand-off",
      "Azure infrastructure and networking, including Managed Identity and private VNet access",
      "Release safety: canary rollouts on Azure Container Apps and the deployment pipeline",
      "Migrating the model layer from Chat Completions to the Responses API"
    ],
    stages: [
      { name: "Intake", detail: "Documents arrive from the CRM workflow and are stored with their case context. Logic Apps and Functions start the pipeline." },
      { name: "OCR and parse", detail: "Azure Document Intelligence, Content Understanding and a dedicated parser service turn scans and native files into structured text." },
      { name: "Classify", detail: "A lightweight classifier identifies document type, language and priority, and decides the route before any expensive model runs." },
      { name: "Translate", detail: "Non-English documents are translated so the downstream agents work from one language." },
      { name: "Extract and summarize", detail: "Extraction agents pull the fields each document type needs, and a summary is written for the agent handling the case." },
      { name: "Validate", detail: "Outputs are checked against a validation contract. Anything below the confidence threshold goes to a human review queue instead of straight through." },
      { name: "Hand off and index", detail: "Results go back to Dynamics CRM, and embeddings are indexed in Azure AI Search so the content can be retrieved later." }
    ],
    decisions: [
      {
        choice: "Route first, then spend",
        why: "Cheap classification and confidence thresholds decide what happens before expensive OCR or LLM calls. Easy documents take a short path, and only hard ones pay for the full pipeline.",
        tradeoff: "Thresholds need tuning per document type, and a wrong route costs a review."
      },
      {
        choice: "Durable Functions for the long-running flow",
        why: "Processing one document is a multi-step job that can take a while and fail partway. Durable orchestration keeps state between steps, so retries resume rather than starting over.",
        tradeoff: "Orchestrator code has to be deterministic, which takes some discipline from the team."
      },
      {
        choice: "Explicit validation contracts between agents",
        why: "Each agent hands off structured output with a defined shape. Validation checks that contract, which makes failures visible and gives human review a clear reason for each escalation.",
        tradeoff: "More up-front schema work for every new document type."
      },
      {
        choice: "Move to the Responses API with the Files API",
        why: "Documents can be passed to the model as files instead of being stuffed into prompts as text, and the Responses API is where new Azure OpenAI capabilities are landing.",
        tradeoff: "A migration across working code paths, done while the system stayed in production."
      },
      {
        choice: "Canary releases with Container Apps revisions",
        why: "Revision-based traffic splitting sends a small share of documents to a new version first, so a bad release is caught on a fraction of traffic and rolled back by shifting weight.",
        tradeoff: "Two versions run side by side during a rollout, so both have to handle the same inputs."
      },
      {
        choice: "Private networking and Managed Identity throughout",
        why: "These are customer documents. Services talk over a VNet-restricted network and authenticate with Managed Identity, so there are no keys in config to leak.",
        tradeoff: "Harder local debugging and more networking setup for every new service."
      }
    ],
    incidents: [
      {
        what: "Python Function App deployments to pre-production failed during the Oryx remote build and ZipDeploy steps, even though the same code ran fine locally.",
        fix: "We worked through the build and packaging path until deploys were repeatable, instead of patching individual releases by hand."
      },
      {
        what: "When Azure Content Understanding went GA, calls that worked against the preview API started returning errors.",
        fix: "The integration was reworked against the GA contract, and the provider was kept behind its own stage so a change like this stays contained."
      },
      {
        what: "The document parser on App Service had to handle large, slow documents alongside quick ones without one blocking the other.",
        fix: "The parser runs under Gunicorn with Uvicorn workers, so several async worker processes share the load."
      },
      {
        what: "Latency and cost both grow with every step in a multi-step pipeline.",
        fix: "Routing and confidence thresholds keep expensive models off documents that don't need them, and asynchronous processing keeps large files off the fast path."
      }
    ],
    results: [
      "Processing 70K+ documents a month in production",
      "Agents get structured fields and a summary in CRM instead of reading every document by hand",
      "Low-confidence documents are routed to people with the reason attached, and the rest go straight through",
      "Releases go out as canaries and can be rolled back by shifting traffic"
    ],
    lessons: [
      "Treat evaluation as product infrastructure, not a one-time test before launch.",
      "Use routing and confidence thresholds before invoking expensive models.",
      "Design agent workflows around clear validation contracts, so every failure has a name."
    ],
    stack: [
      "Azure AI Foundry",
      "Azure OpenAI (Responses API)",
      "Document Intelligence",
      "Content Understanding",
      "Azure AI Search",
      "Durable Functions",
      "Logic Apps",
      "Container Apps",
      "App Service",
      "Cosmos DB",
      "Redis",
      "Python",
      ".NET 8",
      "Dynamics CRM"
    ]
  }
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
export const caseStudyFor = (projectTitle: string) => caseStudies.find((c) => c.project === projectTitle);
