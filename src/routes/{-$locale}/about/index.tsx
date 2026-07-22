import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getGT } from "gt-tanstack-start/server";
import { AboutPage } from "@/app/[locale]/about/page";
import { resolveLocale } from "@/lib/locales";
import { getPageMetadata } from "@/lib/metadata";

const getMetadata = createServerFn({ method: "GET" }).handler(async () => {
  const gt = await getGT();
  return {
    title: gt("About Ben Gubler"),
    description: gt(
      "Learn more about Ben Gubler, his studies in AI, languages, and his work as a web developer.",
    ),
  };
});

export const Route = createFileRoute("/{-$locale}/about/")({
  loader: () => getMetadata(),
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? getPageMetadata({
          ...loaderData,
          locale: resolveLocale(params.locale),
        })
      : [],
  }),
  component: AboutPage,
});
