export type ProjectLink = { label: string; href: string };
export type Project = {
  title: string;
  badge?: string;
  year?: string;
  summary: string;
  points: string[];
  stack: string[];
  links: ProjectLink[];
  privateNote?: string;
};

export const projects: Project[] = [
  {
    title: "AI-Driven Smart Fire Evacuation System",
    badge: "IEEE ICSCC 2025 · co-author",
    year: "2025",
    summary: "Published research on real-time evacuation routing.",
    points: ["Real-time A* evacuation routing over live sensor and indoor-positioning data, re-planning around fire."],
    stack: ["A* search", "Sensor data", "Indoor positioning"],
    links: [
      { label: "Paper (DOI)", href: "https://doi.org/10.1109/ICSCC66177.2025.11233739" },
      { label: "GitHub", href: "https://github.com/Xrg360/FireEvacSystem" },
    ],
  },
  {
    title: "Sheltie",
    badge: "Open source · Apache-2.0",
    summary: "Open-source homelab monitoring with safe auto-remediation and confirm-before-destructive actions.",
    points: [
      "Watches websites, containers, network failover and host health, with quiet Telegram alerts.",
      "Restarts crashed containers but leaves ones you stopped on purpose alone; disruptive actions ask first.",
    ],
    stack: ["Python", "Docker", "Next.js", "Prometheus"],
    links: [
      { label: "GitHub", href: "https://github.com/Xrg360/Sheltie" },
      { label: "Live demo", href: "https://sheltie.simplewebsite.in/demo/" },
    ],
  },
  {
    title: "Studio Billing App",
    badge: "Client work",
    summary: "Mobile-first invoicing for a wedding content studio, built to be safe with money.",
    points: [
      "GST-ready invoices, PDF sharing on WhatsApp and payment tracking.",
      "Idempotent, ledger-safe billing: integer paise, an append-only payment ledger and an audit entry for every write.",
    ],
    stack: ["Next.js", "Firebase", "TypeScript", "Tailwind CSS"],
    links: [],
    privateNote: "Private · demo on request",
  },
];
