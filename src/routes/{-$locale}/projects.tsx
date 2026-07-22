import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { T, useGT, useMessages } from "gt-react";
import { getGT } from "gt-tanstack-start/server";
import { PageTitle } from "@/components/page-title";
import { ProjectList } from "@/components/project-list";
import { resolveLocale } from "@/lib/locales";
import { getPageMetadata } from "@/lib/metadata";
import { projectsData } from "@/lib/projects";

const getMetadata = createServerFn({ method: "GET" }).handler(async () => {
  const gt = await getGT();
  return {
    title: gt("Projects - Ben Gubler"),
    description: gt(
      "A collection of Ben Gubler's projects, from featured work to experimental builds.",
    ),
  };
});

export const Route = createFileRoute("/{-$locale}/projects")({
  loader: () => getMetadata(),
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? getPageMetadata({
          ...loaderData,
          locale: resolveLocale(params.locale),
        })
      : [],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const m = useMessages();
  const gt = useGT();
  return (
    <div className="space-y-12">
      <header className="space-y-3">
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
