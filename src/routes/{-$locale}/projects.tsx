import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getGT } from "gt-tanstack-start/server";
import { ProjectsPage } from "@/app/[locale]/projects/page";
import { resolveLocale } from "@/lib/locales";
import { getPageMetadata } from "@/lib/metadata";

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
