import { createFileRoute } from "@tanstack/solid-router";
import { getGT, T, useGT, useMessages } from "gt-fig-tanstack-start";
import { PageTitle } from "@/components/page-title";
import { ProjectList } from "@/components/project-list";
import { getPageMetadata } from "@/lib/metadata";
import { projectsData } from "@/lib/projects";

export const Route = createFileRoute("/{-$locale}/projects")({
  head: async () => {
    const gt = await getGT();
    return {
      meta: getPageMetadata({
        title: gt("Projects - Ben Gubler"),
        description: gt(
          "A collection of Ben Gubler's projects, from featured work to experimental builds.",
        ),
      }),
    };
  },
  component: ProjectsPage,
});

function ProjectsPage() {
  const m = useMessages();
  const gt = useGT();
  return (
    <div class="interior-wireframe projects-wireframe">
      <header class="page-header">
        <T>
          <PageTitle
            subtitle={gt(
              "Libraries, apps, and experiments. Most are open source; a few are still finding their shape.",
            )}
          >
            Projects
          </PageTitle>
        </T>
      </header>

      {projectsData.map((section) => (
        <section key={section.id} class="home-projects projects-section">
          <div class="home-section-head">
            <h2 class="font-serif font-medium text-2xl tracking-tight text-foreground">
              {m(section.category)}
            </h2>
          </div>
          <ProjectList projects={section.projects} />
        </section>
      ))}
    </div>
  );
}
