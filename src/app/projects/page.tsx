import { T, useMessages } from "gt-next";
import { getGT } from "gt-next/server";
import type { Metadata } from "next";
import { PageTitle } from "@/components/page-title";
import { ProjectList } from "@/components/project-list";
import { projectsData } from "@/lib/projects";

export async function generateMetadata(): Promise<Metadata> {
  const gt = await getGT();
  return {
    title: `${gt("Projects")} - Ben Gubler`,
    description: gt(
      "A collection of Ben Gubler's projects, from featured work to experimental builds.",
    ),
  };
}

export default function ProjectsPage() {
  const m = useMessages();
  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <T>
          <PageTitle
            subtitle="Libraries, apps, and experiments. Most are open source; a few are still finding their shape."
          >
            Projects
          </PageTitle>
        </T>
      </header>

      {projectsData.map((section) => (
        <section key={section.category} className="space-y-3">
          <div className="flex items-baseline gap-3.5">
            <h2 className="font-serif font-medium text-2xl tracking-tight text-foreground">
              {m(section.category)}
            </h2>
            <div className="flex-1 border-t border-dotted border-ink-faint mt-1.5" />
          </div>
          <ProjectList projects={section.projects} />
        </section>
      ))}
    </div>
  );
}
