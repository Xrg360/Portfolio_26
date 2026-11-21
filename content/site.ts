// All site-wide copy and links live here. Components never hard-code copy.

export const site = {
  name: "Rohit Babu George",
  shortName: "Rohit",
  title: "AI Engineer",
  location: "Kochi, India",
  availability: "open to remote and hybrid",
  oneLiner: "I build AI agents that are safe to give real admin powers.",
  supportingLine:
    "Software engineer on Hexnode's AI team, working on MCP gateways, agent orchestration, guardrails and evals for IT and security automation.",
  email: "rohitbabugeorge@gmail.com",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rohit.simplewebsite.in").replace(/\/$/, ""),
  resumePath: "/resume",
  resumeFile: "/Rohit_Babu_George_Resume.pdf?v=2", // bump ?v= whenever the PDF changes (busts browser caches)
  links: {
    github: "https://github.com/xrg360",
    linkedin: "https://www.linkedin.com/in/rohit-babu-george",
  },
  employer: "Hexnode",
  alumniOf: "Muthoot Institute of Technology and Science",
  seo: {
    title: "Rohit Babu George · AI Engineer (MCP, Agents, Guardrails)",
    description:
      "AI engineer in Kochi building safe, production AI agents: MCP gateways, agent orchestration, guardrails, evals and tracing. Python, Go, FastAPI, AWS Bedrock.",
  },
  // Phase 2 hook: "Ask about my work" chat. Off unless explicitly enabled.
  features: {
    askChat: process.env.NEXT_PUBLIC_ENABLE_ASK_CHAT === "true",
  },
} as const;

export const hero = {
  eyebrow: "AI ENGINEER · KOCHI, INDIA",
  primaryCta: "Download résumé",
  secondaryCta: "Email me",
  traceDisclaimer: "Illustrative demo. Not real Hexnode data or code.",
} as const;

export const proofChips = [
  "MCP gateways in production portals",
  "Agent guardrails & evals",
  "OpenTelemetry tracing",
  "IEEE ICSCC 2025 co-author",
  "Python · Go · FastAPI · AWS Bedrock",
] as const;

export const capabilities = [
  {
    title: "MCP & tool infrastructure",
    body: "Gateways that expose product APIs to agents as tools, with least-privilege access, multi-tenant auth and PII redaction.",
    icon: "plug",
  },
  {
    title: "Agent orchestration & guardrails",
    body: "Turning plain-language requests into human-approved plans, with policy checks, confirmation before destructive actions, and audit trails.",
    icon: "shield",
  },
  {
    title: "Evals & observability",
    body: "Guardrail eval suites and end-to-end tracing, so agent behaviour is measurable, debuggable and safe to ship.",
    icon: "activity",
  },
] as const;

export const sections = {
  build: { id: "build", eyebrow: "What I build", title: "Agents with guardrails, not just prompts." },
  experience: { id: "experience", eyebrow: "Experience", title: "Where I've been building." },
  projects: { id: "projects", eyebrow: "Projects & research", title: "Things I've shipped on my own time." },
  writing: { id: "writing", eyebrow: "Writing", title: "Notes from building agents." },
  skills: { id: "skills", eyebrow: "Skills", title: "Tools I reach for." },
  contact: { id: "contact", eyebrow: "Contact" },
} as const;

export const contact = {
  title: "Building agents that need to be trusted? Let's talk.",
  body: "I'm open to AI engineer and backend roles, remote or hybrid.",
  copyLabel: "Copy email",
  copiedLabel: "Copied",
} as const;

// Live typing stat (components/TypingStat.tsx). Hidden until MONKEYTYPE_APE_KEY is set.
export const typingCopy = {
  live: "Live",
  source: "monkeytype",
  lastTest: "last test",
  best: "PB",
  newPb: "new PB",
  acc: "acc",
  ago: "ago",
  note: "Refreshes every couple of minutes.",
} as const;

export const footer = {
  builtWith: "Built with Next.js",
} as const;

export const writingCopy = {
  emptyTitle: "First posts are on the way.",
  emptyBody: "I'm writing up patterns from building agents. Until then, my GitHub is the best place to see how I work.",
  discuss: "Discuss on LinkedIn",
} as const;

export const notFoundCopy = {
  code: "404",
  title: "This route isn't in the plan.",
  body: "The page you asked for doesn't exist. The agent refused to make one up.",
  back: "Back to home",
} as const;
