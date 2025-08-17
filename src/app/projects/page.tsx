import { projectsData } from "@/lib/projects";
import { ProjectList } from "@/components/project-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Ben Gubler",
  description:
    "A collection of Ben Gubler's projects, from featured work to experimental builds.",
};

export default function ProjectsPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Projects
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A collection of things I've built over the years, from open-source
          libraries to web applications and browser extensions.
        </p>
      </header>

      {projectsData.map((section) => (
        <section key={section.category} className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {section.category}
          </h2>
          <ProjectList projects={section.projects} />
        </section>
      ))}
    </div>
  );
}
