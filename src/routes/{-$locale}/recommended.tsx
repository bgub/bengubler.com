import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getGT } from "gt-tanstack-start/server";
import { RecommendedPage } from "@/app/[locale]/recommended/page";
import { resolveLocale } from "@/lib/locales";
import { getPageMetadata } from "@/lib/metadata";

const getMetadata = createServerFn({ method: "GET" }).handler(async () => {
  const gt = await getGT();
  return {
    title: gt("Recommended - Ben Gubler"),
    description: gt(
      "A curated collection of useful links and resources that Ben Gubler has found valuable.",
    ),
  };
});

export const Route = createFileRoute("/{-$locale}/recommended")({
  loader: () => getMetadata(),
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? getPageMetadata({
          ...loaderData,
          locale: resolveLocale(params.locale),
        })
      : [],
  }),
  component: RecommendedPage,
});
