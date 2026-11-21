import { site } from "@/content/site";
import { education, experience } from "@/content/experience";
import { skills } from "@/content/skills";

/** Search-engine extras. Verification codes come from env so nothing secret-ish is hard-coded. */
export const verification = {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || undefined,
};

export const keywords = [
  site.name,
  "Rohit George",
  "AI Engineer",
  "AI agents",
  "agentic AI",
  "MCP",
  "Model Context Protocol",
  "MCP gateway",
  "LLM guardrails",
  "LLM evals",
  "agent orchestration",
  "OpenTelemetry",
  "Python",
  "Go",
  "FastAPI",
  "AWS Bedrock",
  "Kochi",
  "Kerala",
];

const personId = `${site.url}/#person`;

/** schema.org graph: ProfilePage → Person, plus WebSite. */
export function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${site.url}/#profile`,
        url: site.url,
        name: site.seo.title,
        description: site.seo.description,
        inLanguage: "en",
        mainEntity: { "@id": personId },
        isPartOf: { "@id": `${site.url}/#website` },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        alternateName: ["Rohit George", "xrg360"],
        givenName: "Rohit",
        familyName: "George",
        jobTitle: site.title,
        description: site.supportingLine,
        url: site.url,
        image: `${site.url}/opengraph-image`,
        email: `mailto:${site.email}`,
        worksFor: { "@type": "Organization", name: site.employer },
        alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
        address: { "@type": "PostalAddress", addressLocality: "Kochi", addressRegion: "Kerala", addressCountry: "IN" },
        knowsAbout: skills.flatMap((g) => g.items).slice(0, 25),
        sameAs: [site.links.github, site.links.linkedin],
      },
    ],
  };
}

/** Plain-text profile for AI search tools (https://llmstxt.org). Public facts only. */
export async function llmsTxt() {
  const { projects } = await import("@/content/projects");
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.title} in ${site.location}. ${site.oneLiner}`,
    "",
    site.supportingLine,
    "",
    "## Links",
    `- [Portfolio](${site.url}/)`,
    `- [Résumé (PDF)](${site.url}${site.resumePath})`,
    `- [GitHub](${site.links.github})`,
    `- [LinkedIn](${site.links.linkedin})`,
    `- Email: ${site.email}`,
    "",
    "## Experience",
    ...experience.flatMap((c) => [
      `- ${c.company}, ${c.location} (${c.period})`,
      ...c.roles.flatMap((r) => [
        `  - ${r.title} (${r.period})`,
        ...(r.groups ?? []).map((g) => `    - ${g.title}: ${g.context}`),
      ]),
    ]),
    "",
    "## Education",
    `- ${education.school}: ${education.degree} (${education.period})`,
    "",
    "## Projects",
    ...projects.map((p) => `- ${p.title}: ${p.summary}${p.links[0] ? ` (${p.links[0].href})` : ""}`),
    "",
    "## Skills",
    ...skills.map((g) => `- ${g.group}: ${g.items.join(", ")}`),
    "",
  ];
  return lines.join("\n");
}
