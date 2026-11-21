import { projects } from "@/content/projects";
import { sections } from "@/content/site";
import { getPosts } from "@/lib/posts";
import { Hero } from "@/components/Hero";
import { ProofStrip } from "@/components/ProofStrip";
import { Section } from "@/components/Section";
import { CapabilityCards } from "@/components/CapabilityCards";
import { Timeline } from "@/components/Timeline";
import { ProjectCard } from "@/components/ProjectCard";
import { WritingList } from "@/components/WritingList";
import { SkillGroups } from "@/components/SkillGroups";
import { TypingStat } from "@/components/TypingStat";
import { Contact } from "@/components/Contact";

export default async function Home() {
  const posts = (await getPosts()).slice(0, 3);
  const order = ["build", "experience", "projects", ...(posts.length ? ["writing"] : []), "skills", "contact"];
  const idx = (k: string) => String(order.indexOf(k) + 1).padStart(2, "0");

  return (
    <>
      <Hero />
      <ProofStrip />
      <Section id={sections.build.id} index={idx("build")} eyebrow={sections.build.eyebrow} title={sections.build.title}>
        <CapabilityCards />
      </Section>
      <Section
        id={sections.experience.id}
        index={idx("experience")}
        eyebrow={sections.experience.eyebrow}
        title={sections.experience.title}
        className="border-t-2 border-ink bg-surface/60"
      >
        <Timeline />
      </Section>
      <Section id={sections.projects.id} index={idx("projects")} eyebrow={sections.projects.eyebrow} title={sections.projects.title} className="border-t-2 border-ink">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li key={p.title}>
              <ProjectCard p={p} />
            </li>
          ))}
        </ul>
      </Section>
      {posts.length ? (
        <Section id={sections.writing.id} index={idx("writing")} eyebrow={sections.writing.eyebrow} title={sections.writing.title} className="border-t-2 border-ink">
          <WritingList posts={posts} />
        </Section>
      ) : null}
      <Section id={sections.skills.id} index={idx("skills")} eyebrow={sections.skills.eyebrow} title={sections.skills.title} className="border-t-2 border-ink bg-surface/60">
        <SkillGroups />
        <TypingStat />
      </Section>
      <div className="border-t-2 border-ink">
        <Contact index={idx("contact")} />
      </div>
    </>
  );
}
