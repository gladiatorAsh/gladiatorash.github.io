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
    "Azure AI Engineer and Team Lead with 15+ years designing enterprise-scale AI platforms, RAG architectures, document intelligence systems, and distributed cloud applications."
};

export const navItems = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Architecture", href: "#architecture" },
  { label: "Technical", href: "#technical" },
  { label: "Testimonials", href: "#testimonials" },
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
    context: "Microsoft and Applied Materials contract programs",
    achievements: [
      "Led current Microsoft and Applied Materials contract programs spanning Azure AI, RAG, copilots, analytics, and enterprise platform modernization.",
      "Designed a multi-agent document intelligence system processing 70K+ documents per month across OCR, multilingual classification, translation, extraction, summarization, and validation.",
      "Led RAG and copilot delivery for CRM, Teams, Office, and React experiences serving 2K+ active users.",
      "Managed engineering teams of up to 20 people, running design reviews, unblocking delivery, and mentoring engineers on React, .NET, Azure, and AI patterns.",
      "Owned Azure infrastructure across App Services, Functions, Logic Apps, Key Vault, Redis, Blob Storage, Azure AI Search, Azure AI Foundry, and CI/CD pipelines."
    ],
    stack: ["Azure OpenAI", "Azure AI Search", "Azure AI Foundry", ".NET", "React", "Python", "Logic Apps", "Redis"],
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
      "Built and stabilized healthcare provider applications across billing, revenue management, OASIS review, and clinical compliance workflows.",
      "Led architecture and exception-handling improvements that reduced exception rates by roughly 98%.",
      "Improved performance and code quality in a legacy .NET MVC, AngularJS, jQuery, and SQL Server application stack."
    ],
    stack: [".NET MVC", "AngularJS", "jQuery", "SQL Server", "Enterprise Web Apps"],
    architecture: "Stabilized service and application layers with consistent error handling contracts."
  },
  {
    company: "Rolta India",
    role: "Software Engineer L2",
    duration: "Nov 2014 - Jul 2015",
    context: "Government digitization",
    achievements: [
      "Built front-end and workflow functionality for a Maharashtra Government Department of Industries portal.",
      "Helped digitize registration, document upload, certification, and approvals for small-scale industry processes.",
      "Guided team members through implementation issues across .NET MVC, Knockout, jQuery, SQL Server, and SharePoint."
    ],
    stack: [".NET MVC", "KnockoutJS", "jQuery", "SQL Server", "SharePoint"],
    architecture: "Transactional web systems for secure public-sector workflows."
  },
  {
    company: "Paramatrix Technologies",
    role: "Software Engineer",
    duration: "Aug 2012 - Nov 2014",
    context: "Enterprise operations",
    achievements: [
      "Delivered finance, trading, certification, reporting, CRM-style, and point-of-sale applications across multiple client domains.",
      "Built full-stack .NET MVC portals using LINQ, jQuery, SQL Server, reporting workflows, and customer-facing requirement discovery.",
      "Handled deployments, production fixes, performance optimization, and feature delivery alongside cross-functional teams."
    ],
    stack: [".NET MVC", "LINQ", "jQuery", "SQL Server", "Reporting"],
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
    stack: ["Azure AI Foundry", "Document Intelligence", "Azure OpenAI", "Python", "Logic Apps", "Functions", "Dynamics CRM"],
    challenges: ["Latency control across multi-step pipelines", "Cost-aware OCR and LLM usage", "Reliable validation for imperfect documents"],
    lessons: ["Treat evaluation as product infrastructure", "Use routing and confidence thresholds before invoking expensive models", "Design agent workflows around clear validation contracts"],
    github: null,
    screenshots: ["Pipeline view", "Validation console", "Agent trace"]
  },
  {
    title: "Crystal RAG + Copilot Platform",
    period: "2024 - Present",
    problem: "Knowledge workers needed grounded answers across Teams, CRM, and Office apps with enterprise controls and low-latency retrieval.",
    solution: "Built an Azure RAG platform with hybrid search, chunking strategies, API optimization, and retrieval tuning.",
    architecture: "Content ingestion, enrichment, Azure AI Search, re-ranking, prompt orchestration, secure API tier, and Teams/Office frontends.",
    stack: ["Azure OpenAI", "Azure AI Search", "Azure AI Foundry", "Python", "Teams", "Office", "React"],
    challenges: ["Permission-aware retrieval", "Prompt drift", "Grounded citation quality", "Feedback visibility across multiple data sources"],
    lessons: ["Retrieval quality beats prompt cleverness", "Caching should be scoped by identity and freshness requirements", "Analytics need to be part of the copilot product loop"],
    github: null,
    screenshots: ["Copilot response", "Search diagnostics", "Feedback dashboard"]
  },
  {
    title: "EPG Taiwan Plant Enablement",
    period: "Applied Materials",
    problem: "A new Taiwan plant needed process-specific functionality, data migration, and regulatory reporting support without disrupting existing plant integrations.",
    solution: "Led backend and data workstreams to extend .NET APIs, SQL Server schemas, and migration flows for Taiwan-specific process rules.",
    architecture: ".NET 6 API extensions, SQL Server schema changes, data validation workflows, migration support, and stakeholder sign-off loops.",
    stack: [".NET 6", "SQL Server", "Web API", "Data Migration", "Process Engineering"],
    challenges: ["Plant-specific rule differences", "Data integrity before go-live", "Maintaining compatibility with existing integrations"],
    lessons: ["Process engineers should validate workflows early", "Schema extensions need explicit consistency standards"],
    github: null,
    screenshots: ["Process workflow", "Migration validation", "Reporting rules"]
  },
  {
    title: "Almanac Process Engineering Analytics",
    period: "Applied Materials",
    problem: "Process engineers needed a single view of operational data across multiple platforms to analyze trends, compare results, and generate charts and reports.",
    solution: "Built and supported an analytics application integrating platform data into Angular, D3.js, and .NET Web API experiences.",
    architecture: "Angular application, .NET 6 API, SQL Server and MongoDB-backed data views, D3.js visualization layer, and client validation workflows.",
    stack: [".NET 6", "Angular", "D3.js", "SQL Server", "MongoDB"],
    challenges: ["Combining data from different systems", "Interactive chart performance", "Client-facing support and validation"],
    lessons: ["Analytics tools need fast feedback from domain users", "Visualization work benefits from clean API boundaries"],
    github: null,
    screenshots: ["Engineer dashboard", "Comparison chart", "Report builder"]
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
    title: "Microsoft 365 Admin Center Feedback Platform",
    period: "Microsoft contract",
    problem: "Product teams needed reliable, non-intrusive feedback capture inside a globally used admin experience for enterprise IT administrators.",
    solution: "Developed feedback elicitation components and R&D prototypes for new feedback modalities in the M365 Admin Center.",
    architecture: "React and .NET feedback components, SQL-backed feedback flows, Azure deployment pipelines, and product analytics handoff.",
    stack: [".NET 5", "React", "Redux", "SQL Server", "Redis", "Azure", "Teams"],
    challenges: ["Global product reliability", "Non-intrusive feedback UX", "Turning submissions into actionable product signals"],
    lessons: ["Feedback capture should respect user context", "R&D spikes are useful when product behavior is still forming"],
    github: null,
    screenshots: ["Feedback component", "Signal flow", "Experiment notes"]
  },
  {
    title: "Tenant Touchpoints",
    period: "Microsoft contract",
    problem: "Sales teams needed a dependable way to track tenants, Microsoft service usage, tasks, comments, and service adoption views.",
    solution: "Designed and delivered React and .NET features across dashboards, task management, production support, and Teams integration feasibility.",
    architecture: "React and Redux frontend, .NET service layer, SQL Server data model, Azure hosting, and Teams notification exploration.",
    stack: [".NET 4", "React", "Redux", "SQL Server", "Azure", "Azure DevOps", "Teams"],
    challenges: ["Daily sales workflow reliability", "Stakeholder triage", "Feature roadmap feasibility"],
    lessons: ["Internal tools need product-level support habits", "Technical feasibility work can shape roadmap decisions"],
    github: null,
    screenshots: ["Tenant dashboard", "Task workflow", "Adoption view"]
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
    title: "Provider Link Healthcare Platform",
    period: "CitiusTech",
    problem: "Home care and hospice providers needed dependable workflows for billing, revenue management, OASIS review, and clinical compliance.",
    solution: "Improved a healthcare full-stack application by fixing functional issues, optimizing performance, and raising code quality in a legacy .NET web stack.",
    architecture: ".NET MVC application with AngularJS and jQuery client workflows, SQL Server persistence, revenue and compliance modules, and shared quality tooling.",
    stack: [".NET MVC", "AngularJS", "JavaScript", "jQuery", "SQL Server", "Code Quality"],
    challenges: ["Legacy code maintainability", "Performance bottlenecks", "Clinical and billing workflow complexity"],
    lessons: ["Healthcare apps need careful regression control", "Code quality work compounds when paired with production bug fixes"],
    github: null,
    screenshots: ["Billing workflow", "Compliance review", "Performance fixes"]
  },
  {
    title: "Department of Industries Digital Portal",
    period: "Rolta India",
    problem: "Small-scale industry processes for Maharashtra Government needed to move from manual submissions to an online registration and certification workflow.",
    solution: "Designed and built front-end workflows for a public-sector portal where users could register, upload information, and request operating certificates digitally.",
    architecture: ".NET MVC portal with jQuery and KnockoutJS views, SQL Server workflows, SharePoint integration, document upload paths, and approval-oriented screens.",
    stack: [".NET MVC", "KnockoutJS", "jQuery", "SQL Server", "SharePoint"],
    challenges: ["Digitizing government workflows", "Document-heavy user journeys", "Coordinating across a large delivery team"],
    lessons: ["Public-sector portals need simple task flows", "Upload and certification steps need clear state models"],
    github: null,
    screenshots: ["Registration flow", "Document upload", "Certification status"]
  },
  {
    title: "Sales Target and Achievements Portal",
    period: "Kotak Mahindra Mutual Fund",
    problem: "Sales teams needed a pan-India system to upload targets and achievements, review performance, and capture manager comments.",
    solution: "Designed and built a custom .NET MVC portal, handled deployment, fixed production issues, and worked directly with customers to refine requirements.",
    architecture: ".NET MVC application with LINQ data access, jQuery interactions, SQL Server storage, target upload workflows, manager review, and reporting views.",
    stack: [".NET MVC", "LINQ", "jQuery", "SQL Server", "Reporting"],
    challenges: ["Requirement discovery with business users", "Upload validation", "Manager review and comment workflows"],
    lessons: ["Operational reporting apps live or die by data validation", "Customer-facing requirement work improves delivery speed"],
    github: null,
    screenshots: ["Target upload", "Achievement dashboard", "Manager comments"]
  },
  {
    title: "Angel Eye Trading Portal",
    period: "Angel Broking",
    problem: "A public single-page trading and portfolio management app needed functional fixes, change requests, and performance optimization.",
    solution: "Delivered fixes and enhancements across a .NET MVC and JavaScript application while improving responsiveness for customer-facing trading workflows.",
    architecture: ".NET MVC backend, LINQ-based data access, jQuery front-end interactions, SQL Server persistence, and SPA-style portfolio and trading screens.",
    stack: [".NET MVC", "LINQ", "jQuery", "SQL Server", "SPA"],
    challenges: ["Customer-facing reliability", "Performance-sensitive interactions", "Frequent change requests"],
    lessons: ["Trading interfaces demand fast feedback loops", "Small performance fixes matter in heavily used workflows"],
    github: null,
    screenshots: ["Portfolio view", "Trading workflow", "Performance tuning"]
  },
  {
    title: "Enterprise Operations Portals",
    period: "Paramatrix Technologies",
    problem: "Multiple businesses needed custom internal systems for training, certification, client records, investment reporting, point-of-sale, inventory, and operational reports.",
    solution: "Built and maintained full-stack .NET MVC applications including Process Tracker, PIE, and Gold POS across finance, certification, CRM-style, and retail operations domains.",
    architecture: ".NET MVC portals with LINQ, jQuery, SQL Server schemas, reporting screens, process workflows, inventory modules, and deployment support.",
    stack: [".NET MVC", "LINQ", "jQuery", "SQL Server", "Inventory", "Reporting"],
    challenges: ["Serving different business domains", "Balancing new features with production fixes", "Keeping reporting and transactional data consistent"],
    lessons: ["Domain modeling transfers across line-of-business apps", "Reliable deployments are part of full-stack ownership"],
    github: null,
    screenshots: ["Certification tracker", "Client reports", "POS inventory"]
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

export const testimonials = [
  {
    quote:
      "Ashutosh led a vendor team of 4 people to work on a challenging web project, reporting directly to me. The project was to build a web SDK in React with both front-end and back-end components. His excellent work not only contributed tremendously to the success of the project, but also helped me offload some of my responsibilities. He would be a great asset in any organization.",
    name: "J.P. Zhang",
    title: "Principal Software Engineer at Microsoft",
    image: "/assets/img/photos/jp.jpeg"
  },
  {
    quote:
      "Ashutosh is a great co worker to work with. Help other people in the team when they are struck. Takes full ownership of work that he is working. Always thinks future before writing code. Always follows best practices.",
    name: "Srinivas Naidu Kondisetty",
    title: "Team Lead at TechMahindra",
    image: "/assets/img/photos/sn.jpeg"
  },
  {
    quote:
      "Ashutosh is an extremely enthusiastic and motivated developer, who is passionate about technology and is always up-to-date with the latest trends. He picks up new technology easily and is very good at training others how to use it. It was always a pleasure to work with him as he is friendly, helpful, charismatic and always wears a smile. I would recommend Ashutosh to anyone and everyone.",
    name: "Ravindarreddy Umentala",
    title: "Tech Lead at CitiusTech",
    image: "/assets/img/photos/testimonial-avatar01.jpg"
  },
  {
    quote:
      "Hardworking and sincere. Extremely reliable and most of the critical tasks in the project were executed by Ashutosh. Technically a strong individual and always helping his team. Would like to work with him again in future.",
    name: "Lalit Singh",
    title: "AVP at CitiusTech",
    image: "/assets/img/photos/testimonial-avatar02.jpg"
  },
  {
    quote:
      "Ashutosh was highly valued team member while I acted as onsite team lead for couple of assignments for a US client. I found him very hard working and technically sound and a great team player. He is a quick learner and at the same time outperforming with his existing skills. Wish him all the best for his future assignments!",
    name: "Zahirabbas Rupani",
    title: "Technical Specialist - CSM",
    image: "/assets/img/photos/testimonial-avatar03.jpg"
  },
  {
    quote:
      "Ashutosh is a focused and committed individual. He ensures that the deadlines are never missed and quality is not compromised. He is an excellent team player, and understands the client business problems quite well.",
    name: "Prasun Datta",
    title: "Executive Manager, Rolta",
    image: "/assets/img/photos/testimonial-avatar05.jpg"
  },
  {
    quote:
      "Ashutosh is very dedicated and hard working person with very good technical skills. He has helped other colleagues in office, showing his sincerity and generosity.",
    name: "Vineet Singh",
    title: "Tech Lead, CitiusTech",
    image: "/assets/img/photos/testimonial-avatar04.jpg"
  },
  {
    quote:
      "Ashutosh has a very good capability of resolving all critical issues faced by the team of 10 developers. He has always kept work on priority and ensured successful completion with dedication. He is technically very sound and an excellent team player. I wish him good luck.",
    name: "Shyam Saraf",
    title: "Tech Lead, L&T Infotech",
    image: null
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
