import {
  Bot,
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  FileSearch,
  GitBranch,
  Layers3,
  LockKeyhole,
  Network,
  Search,
  Workflow
} from "lucide-react";

export const profile = {
  name: "Ashutosh Singh",
  title: "Lead Azure AI Engineer",
  location: "Santa Clara, CA",
  email: "ashutoshsingh1989@gmail.com",
  phone: "669-261-2485",
  website: "https://ashutoshysingh.com",
  github: "https://github.com/gladiatorAsh",
  linkedin: "https://linkedin.com/in/ashutoshysingh",
  summary:
    "AI Solutions Architect with 15+ years building enterprise cloud platforms, specializing in agentic AI and document intelligence for customer-facing and agent-assist systems."
};

export const navItems = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Architecture", href: "#architecture" },
  { label: "Technical", href: "#technical" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" }
];

export const metrics = [
  { value: "15+", label: "years building cloud platforms" },
  { value: "70K+", label: "documents processed monthly" },
  { value: "5K+", label: "users reached through enterprise apps" },
  { value: "20", label: "engineers led across delivery teams" }
];

export const timeline = [
  {
    company: "Tech Mahindra",
    role: "Team Lead / Azure AI Engineer",
    duration: "Dec 2018 - Present",
    context: "Applied Materials and Microsoft",
    achievements: [
      "Led enterprise AI platforms and copilots using Azure OpenAI, Azure AI Search, and agentic frameworks for 2K+ active users.",
      "Built RAG architectures with hybrid search, chunking strategies, and re-ranking pipelines to improve answer quality and latency.",
      "Designed a multi-agent document intelligence system processing 70K+ documents per month across OCR, classification, translation, extraction, and validation.",
      "Built React, .NET, Teams extension, and copilot experiences that grew adoption from 30 users to 5,000+.",
      "Owned Azure infrastructure across App Services, Functions, Key Vault, Redis, Blob Storage, Azure AI Search, and CI/CD pipelines."
    ],
    stack: ["Azure OpenAI", "Azure AI Search", "Azure AI Foundry", ".NET", "React", "Python", "Redis", "Blob Storage"],
    architecture:
      "Event-driven Azure platform with API orchestration, retrieval pipelines, secure document processing, and telemetry-backed feedback loops."
  },
  {
    company: "Icertis",
    role: "Software Engineer Intern",
    duration: "Summer 2017",
    context: "Enterprise workflow automation",
    achievements: [
      "Designed chatbot integrations for REST services accessible from email, Microsoft Teams, and SMS.",
      "Delivered workflow automation and platform integrations across systems including Workday and ServiceNow."
    ],
    stack: ["Bots", "REST APIs", "Teams", "ServiceNow", "Workday"],
    architecture: "Conversational integration layer over enterprise workflow APIs."
  },
  {
    company: "CitiusTech",
    role: "Senior Software Engineer",
    duration: "Aug 2015 - Jul 2016",
    context: "Healthcare software platforms",
    achievements: [
      "Led architecture and exception-handling improvements that reduced exception rates by roughly 98%.",
      "Raised code quality with structured error handling and maintainable engineering practices."
    ],
    stack: [".NET", "SQL", "Enterprise Web Apps", "Exception Handling"],
    architecture: "Stabilized service and application layers with consistent error handling contracts."
  },
  {
    company: "Rolta India",
    role: "Software Engineer L2",
    duration: "Nov 2014 - Jul 2015",
    context: "Government digitization",
    achievements: [
      "Developed web applications for digitization initiatives improving claims and benefits processing."
    ],
    stack: [".NET", "MVC", "SQL", "Web Applications"],
    architecture: "Transactional web systems for secure public-sector workflows."
  },
  {
    company: "Paramatrix Technologies",
    role: "Software Engineer",
    duration: "Aug 2012 - Nov 2014",
    context: "Enterprise operations",
    achievements: [
      "Delivered applications for sales bonus calculation and employee certification monitoring.",
      "Streamlined operations through custom enterprise applications."
    ],
    stack: [".NET", "SQL", "JavaScript", "Reporting"],
    architecture: "Line-of-business applications backed by relational data models and reporting workflows."
  }
];

export const projects = [
  {
    title: "Agent Assist - Document Intelligence Platform",
    period: "2025 - Present",
    problem: "High-volume enterprise documents required multilingual OCR, classification, extraction, validation, and summarization without overwhelming human agents.",
    solution: "Designed a multi-agent Azure AI Foundry system that routes documents through specialized AI workers and validation checkpoints.",
    architecture: "Document ingress, OCR, language detection, classifier, extraction agents, human review queues, and analytics feedback loops.",
    stack: ["Azure AI Foundry", "Document Intelligence", "Azure OpenAI", "Functions", "Blob Storage", "Key Vault"],
    challenges: ["Latency control across multi-step pipelines", "Cost-aware OCR and LLM usage", "Reliable validation for imperfect documents"],
    lessons: ["Treat evaluation as product infrastructure", "Use routing and confidence thresholds before invoking expensive models"],
    github: null,
    screenshots: ["Pipeline view", "Validation console", "Agent trace"]
  },
  {
    title: "Crystal RAG + Copilot Platform",
    period: "2024 - Present",
    problem: "Knowledge workers needed grounded answers across Teams, CRM, and Office apps with enterprise controls and low-latency retrieval.",
    solution: "Built an Azure RAG platform with hybrid search, chunking strategies, API optimization, and retrieval tuning.",
    architecture: "Content ingestion, enrichment, Azure AI Search, re-ranking, prompt orchestration, secure API tier, and Teams/Office frontends.",
    stack: ["Azure OpenAI", "Azure AI Search", "React", ".NET", "Redis", "Teams Toolkit"],
    challenges: ["Permission-aware retrieval", "Prompt drift", "Grounded citation quality"],
    lessons: ["Retrieval quality beats prompt cleverness", "Caching should be scoped by identity and freshness requirements"],
    github: null,
    screenshots: ["Copilot response", "Search diagnostics", "Feedback dashboard"]
  },
  {
    title: "Unified Action Tracker",
    period: "Enterprise platform rebuild",
    problem: "Large teams were using fragmented ADO workflows that slowed visibility, ownership, and reporting.",
    solution: "Led a greenfield React and .NET multi-tenant platform replacing the workflow with a dedicated user experience.",
    architecture: "React application, .NET API, optimized data model, migration tooling, Redis-backed low-latency paths, and dashboards.",
    stack: ["React", ".NET", "SQL", "Redis", "Azure App Service", "CI/CD"],
    challenges: ["Migrating 10K+ records with zero data loss", "Global reliability expectations", "Multi-tenant data boundaries"],
    lessons: ["Migration observability is as important as the migration script", "Workflow products need strong defaults and escape hatches"],
    github: null,
    screenshots: ["Action board", "Analytics view", "Migration runbook"]
  },
  {
    title: "Multi-Region Order Processing Platform",
    period: "Cloud architecture case study",
    problem: "A customer-facing order system needed resilient, real-time order status across regions.",
    solution: "Architected a multi-region AWS application with load-balanced ECS services and centralized managed RDS.",
    architecture: "Web app, API Gateway, ECS services, IAM controls, RDS MySQL, S3 assets, CloudWatch observability, and regional routing.",
    stack: ["AWS ECS", "RDS MySQL", "API Gateway", "S3", "Lambda", "IAM", "CloudWatch"],
    challenges: ["Cross-region consistency", "Access control design", "Operational visibility"],
    lessons: ["Use managed primitives where they simplify recovery", "Model order state transitions explicitly"],
    github: null,
    screenshots: ["Regional topology", "Order status view", "CloudWatch dashboard"]
  },
  {
    title: "Distributed File Storage and Sharing",
    period: "Legacy systems project",
    problem: "Explore distributed storage, replication, leader election, and work stealing in a clustered file service.",
    solution: "Built a Java and Netty-based distributed file sharing system with command queues, work queues, replication, and client messaging.",
    architecture: "Client connection layer, server state manager, command/work handlers, leader election, data replication, and queue orchestration.",
    stack: ["Java", "Netty", "Protocol Buffers", "Redis", "Distributed Systems"],
    challenges: ["Cluster coordination", "Message routing", "Replication during topology changes"],
    lessons: ["Operational complexity grows at the edges", "Queues need first-class observability"],
    github: "https://github.com/virajnilakh/DistributedFileStorageAndSharing",
    screenshots: ["Cluster graph", "Message flow", "Replication path"]
  }
];

export const architectureCards = [
  {
    id: "enterprise-rag",
    title: "Enterprise RAG",
    icon: Search,
    summary: "Permission-aware retrieval with hybrid search, re-ranking, citations, and answer evaluation.",
    nodes: [
      component("Identity Gateway", "Authenticates users and maps claims to content permissions.", "Enterprise search without ACL trimming leaks data.", ["App roles", "Graph connectors"], ["Central policy point"], ["Requires careful cache scoping"], "Token validation and permission lookups must be cached carefully.", "Identity lookups can dominate latency if not batched.", "Use Entra ID, Key Vault, managed identities, and per-user audit trails."),
      component("Ingestion Pipeline", "Normalizes documents, metadata, and access control lists before indexing.", "Keeps retrieval deterministic and observable.", ["Direct indexing", "Batch ETL"], ["Repeatable enrichment"], ["Needs reprocessing strategy"], "Chunking quality determines retrieval quality.", "Batch OCR and enrichment during off-peak windows.", "Scan files, preserve lineage, and keep immutable source references."),
      component("Azure AI Search", "Provides hybrid keyword/vector retrieval and filters.", "Azure-native, scalable, and integrated with enterprise security.", ["Pinecone", "Weaviate", "Postgres pgvector"], ["Hybrid search and filters in one service"], ["Advanced vector tuning has service boundaries"], "Tune analyzers, vector dimensions, filters, and top-k by content type.", "Index replicas and vector storage drive cost.", "Apply metadata filters before answer generation."),
      component("LLM Orchestrator", "Builds prompts, invokes models, and enforces grounded response contracts.", "Separates product logic from model calls.", ["Semantic Kernel", "LangChain", "Custom orchestration"], ["Testable prompt path"], ["More components to monitor"], "Use streaming and structured outputs where possible.", "Route simple questions to cheaper models.", "Block prompt injection patterns and constrain tool access.")
    ]
  },
  {
    id: "job-assistant",
    title: "AI Job Application Assistant",
    icon: Bot,
    summary: "Agent workflow for resume tailoring, job matching, outreach drafts, and application tracking.",
    nodes: [
      component("Resume Profile", "Stores canonical experience, skills, projects, and constraints.", "Keeps generated material consistent and truthful.", ["Free-form documents", "Manual prompts"], ["Single source of truth"], ["Requires updates"], "Structured profile lookup is faster than parsing each run.", "Small document store footprint.", "Protect personal information and redact exports."),
      component("Job Parser", "Extracts requirements, seniority signals, and technology matches.", "Turns postings into comparable data.", ["Manual scoring", "Browser-only extraction"], ["Repeatable matching"], ["Posting formats vary"], "Use schema extraction with validation.", "Use lower-cost models for initial parse.", "Avoid storing unnecessary employer data."),
      component("Fit Agent", "Scores alignment and proposes resume/story adjustments.", "Helps prioritize applications with explainable signals.", ["Static keyword score"], ["Transparent recommendations"], ["Can over-index on keywords"], "Calibrate against interview outcomes.", "Batch scoring saves model calls.", "Keep human approval before external submission."),
      component("Outreach Drafts", "Creates concise LinkedIn/email drafts grounded in the profile.", "Reduces repetitive writing while preserving voice.", ["Templates only"], ["Fast personalization"], ["Needs tone review"], "Cache drafts per role and contact.", "Drafting is cheaper than deep reasoning.", "Never auto-send without approval.")
    ]
  },
  {
    id: "azure-ai-search",
    title: "Azure AI Search",
    icon: FileSearch,
    summary: "Search design for semantic ranking, vectors, metadata filters, and diagnostic feedback loops.",
    nodes: [
      component("Index Schema", "Defines fields, analyzers, filters, facets, vectors, and retrievable payload.", "Good schemas make retrieval measurable.", ["Loose JSON blobs"], ["Fast filters"], ["Schema migrations need planning"], "Keep retrievable fields lean.", "Replica and partition counts shape spend.", "Do not mark sensitive fields retrievable unless required."),
      component("Chunk Strategy", "Splits content into answer-sized units with metadata inheritance.", "Chunk boundaries decide what the model can cite.", ["Page chunks", "Fixed tokens"], ["Better answer grounding"], ["More preprocessing"], "Evaluate chunk size by domain.", "More chunks increase vector storage.", "Carry ACL and source lineage on every chunk."),
      component("Hybrid Retrieval", "Combines keyword and vector search before ranking.", "Enterprise content mixes exact terms and semantic phrasing.", ["Vector-only", "Keyword-only"], ["Higher recall"], ["More tuning"], "Tune weights by query class.", "Hybrid queries cost more than simple keyword.", "Apply filters in the search layer."),
      component("Diagnostics", "Captures query, retrieved chunks, scores, answer, and feedback.", "Makes quality work concrete.", ["Manual review"], ["Continuous improvement"], ["PII handling needed"], "Sample traces and aggregate metrics.", "Storage is modest but retention matters.", "Redact or encrypt sensitive traces.")
    ]
  },
  {
    id: "document-intelligence",
    title: "Document Intelligence",
    icon: Layers3,
    summary: "Multi-agent processing for OCR, translation, classification, extraction, validation, and review.",
    nodes: [
      component("OCR Layer", "Converts scanned and native documents into structured text.", "Reliable extraction starts with layout-aware OCR.", ["Tesseract", "Cloud Vision"], ["Strong Azure integration"], ["OCR cost at scale"], "Use async processing for large documents.", "Route native PDFs differently from scans.", "Encrypt documents and isolate storage accounts."),
      component("Classifier", "Identifies document type, language, priority, and downstream path.", "Avoids one-size-fits-all prompts.", ["Rules engine", "Manual triage"], ["Faster routing"], ["Needs confidence thresholds"], "Fallback to review on low confidence.", "Classifier calls can be lightweight.", "Keep classification labels non-sensitive where possible."),
      component("Extraction Agents", "Specialized agents extract fields, entities, summaries, and anomalies.", "Specialization improves reliability and testability.", ["Single monolithic prompt"], ["Better eval coverage"], ["More orchestration"], "Parallelize independent agents.", "Use smaller models for narrow extraction.", "Constrain schemas and validate outputs."),
      component("Human Review", "Surfaces exceptions and low-confidence results for validation.", "Keeps automation accountable.", ["Auto-approve all"], ["Risk reduction"], ["Adds workflow design"], "Prioritize review queues by business impact.", "Human review cost should be tracked.", "Audit approvals and corrections.")
    ]
  },
  {
    id: "agentic-workflow",
    title: "Agentic Workflow",
    icon: Workflow,
    summary: "Tool-using LLM systems with planning, retrieval, validation, memory, and human checkpoints.",
    nodes: [
      component("Planner", "Breaks a request into tasks and selects the next tool.", "Complex workflows need visible state.", ["Static chains", "Hard-coded workflows"], ["Adaptive behavior"], ["Can wander without limits"], "Limit steps and expose traces.", "Planning calls add overhead.", "Restrict tools by role and task."),
      component("Tool Registry", "Defines callable APIs, schemas, permissions, and failure handling.", "Agents are only as safe as their tools.", ["Inline function calls"], ["Central governance"], ["Schema upkeep"], "Validate inputs before execution.", "Cheap but critical infrastructure.", "Use least privilege and approval gates."),
      component("Verifier", "Checks outputs against policy, schema, and business rules.", "Prevents plausible but wrong completions.", ["Human-only QA"], ["Consistent quality"], ["False positives"], "Make validators deterministic where possible.", "Validators save downstream rework.", "Log validation failures without leaking secrets."),
      component("Telemetry", "Captures traces, cost, latency, model choice, and outcome quality.", "Production agents need observability.", ["Ad hoc logs"], ["Debuggable operations"], ["Retention policy needed"], "Measure p50/p95 by workflow step.", "Telemetry storage and dashboards cost money.", "Mask PII and secure trace access.")
    ]
  }
];

function component(
  name: string,
  purpose: string,
  why: string,
  alternatives: string[],
  pros: string[],
  cons: string[],
  performance: string,
  cost: string,
  security: string
) {
  return { name, purpose, why, alternatives, pros, cons, performance, cost, security };
}

export const technicalSections = [
  {
    title: "Architecture Notes",
    icon: Network,
    description: "System design tradeoffs, integration boundaries, observability, and cloud-native reliability."
  },
  {
    title: "Azure AI",
    icon: Cloud,
    description: "Azure OpenAI, Azure AI Foundry, AI Search, Document Intelligence, Functions, Key Vault, and App Services."
  },
  {
    title: "LLMs",
    icon: BrainCircuit,
    description: "Model routing, structured outputs, evaluation, token budgets, hallucination reduction, and streaming UX."
  },
  {
    title: "Prompt Engineering",
    icon: Code2,
    description: "Grounded prompts, system boundaries, rubric-based evals, and prompt versioning for enterprise workflows."
  },
  {
    title: "Semantic Search",
    icon: Search,
    description: "Hybrid retrieval, semantic ranking, query rewriting, citation scoring, and relevance diagnostics."
  },
  {
    title: "Vector Search",
    icon: Database,
    description: "Embeddings, vector dimensions, chunking, metadata filters, index lifecycle, and cost controls."
  },
  {
    title: "MCP",
    icon: GitBranch,
    description: "Tool contracts, safe context sharing, connector design, and agent interoperability."
  },
  {
    title: "Semantic Kernel",
    icon: Workflow,
    description: "Planner patterns, tool orchestration, plugins, memory, and enterprise agent workflows."
  },
  {
    title: "Performance",
    icon: LockKeyhole,
    description: "Caching, p95 latency, API optimization, concurrency, model routing, and secure telemetry."
  }
];

export const skillGroups = {
  AI: ["Azure OpenAI", "RAG", "LLM Pipelines", "Prompt Engineering", "Agentic Workflows", "Document Intelligence"],
  Cloud: ["Azure App Services", "Azure Functions", "Azure AI Search", "Key Vault", "Blob Storage", "AWS ECS", "RDS"],
  Backend: ["C#", ".NET Core", "ASP.NET MVC", "Python", "Node.js", "REST APIs", "SQL"],
  Frontend: ["React", "TypeScript", "JavaScript ES6", "Redux", "Angular", "D3.js", "HTML5"],
  DevOps: ["Docker", "CI/CD", "CloudWatch", "Postman", "Application Monitoring"],
  Databases: ["Cosmos DB", "MongoDB", "Redis", "MySQL", "SQL Server"]
};

export const certifications = [
  "Microsoft Azure AI Engineer Associate",
  "Microsoft Azure Developer Associate",
  "Microsoft Azure Fundamentals",
  "Microsoft Power Platform Fundamentals"
];

export const education = [
  "M.S. Software Engineering, San Jose State University, CA",
  "B.E. Computer Engineering, University of Mumbai, India"
];
