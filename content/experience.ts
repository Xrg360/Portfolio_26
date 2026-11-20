// Mirrors the published résumé, lightly trimmed. Public, role-level facts only:
// no internal names, architecture, code or customer data.

export type ExperienceGroup = { title: string; context: string; bullets: string[] };
export type Role = { title: string; period: string; groups?: ExperienceGroup[]; bullets?: string[] };
export type Company = { company: string; location: string; period: string; roles: Role[] };

export const experience: Company[] = [
  {
    company: "Hexnode (Mitsogo Inc.)",
    location: "Kochi, Kerala",
    period: "May 2025 – Present",
    roles: [
      {
        title: "Software Engineer, Hexnode AI Team",
        period: "Feb 2026 – Present",
        groups: [
          {
            title: "Hexnode Synapse",
            context: "agentic AI orchestration for IT & security, in pilot",
            bullets: [
              "Co-developed Synapse's agent orchestration and guardrail components, turning plain-language requests into human-approved plans, plus agent evals.",
              "Built the event-driven ingestor that keeps the context graph of people, accounts and devices in sync in real time across Hexnode UEM, XDR, IdP and connected systems.",
              "Worked on the governed execution layer that authorizes, deduplicates and audits agent actions.",
            ],
          },
          {
            title: "RLM Knowledge Service",
            context: "grounding Genie & Synapse in Hexnode product docs",
            bullets: [
              "Contributed to a Recursive Language Model (RLM) service over the entire Hexnode UEM and XDR documentation, where the model explores the docs step by step for platform-specific answers.",
              "Helped ensure answers cite only the docs the model actually read; served over FastAPI SSE on AWS Bedrock.",
              "Integrated it into Genie as a documentation tool, with re-indexing on every doc publish and regression testing against a curated QA suite.",
            ],
          },
          {
            title: "MCP Gateways & Hexnode Genie",
            context: "agentic AI across UEM, XDR & IdP",
            bullets: [
              "Built Hexnode's XDR and IdP MCP gateways end to end and contributed to the UEM gateway (FastMCP, FastAPI, Pydantic AI), powering Genie across all three portals.",
              "Generated MCP tools from OpenAPI specs with least-privilege access controls, a read-only mode and secure multi-tenant auth.",
              "Built PII redaction for LLM traffic and a cryptographically verified confirmation step before destructive actions.",
              "Wrote a 40-case guardrail eval suite in pydantic-evals (scope, confirmation, prompt injection).",
              // TODO: metric (e.g. eval pass rate) if you're allowed to share one.
              "Added OpenTelemetry tracing in Jaeger: per-turn, model and tool-call spans with token and cost usage, plus audit spans for destructive actions.",
            ],
          },
        ],
      },
      {
        title: "Software Engineer, UEM",
        period: "May 2025 – Feb 2026",
        bullets: [
          "Shipped Hexnode UEM (Windows, server-side) and MDM app features and fixes in Django, Angular and PostgreSQL.",
        ],
      },
    ],
  },
];

export const education = {
  school: "Muthoot Institute of Technology and Science",
  location: "Kochi, Kerala",
  degree: "B.Tech, Computer Science and Engineering",
  period: "Nov 2021 – May 2025",
  grade: "CGPA 8.61",
  leadership: [
    "Chairperson, IEEE Computer Society (IEEE SB MITS), 10+ events",
    "AI & ML Lead, then App Dev Lead, GDSC MITS",
  ],
};
