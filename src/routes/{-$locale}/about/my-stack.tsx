import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getGT } from "gt-tanstack-start/server";
import { MyStackPage } from "@/app/[locale]/about/my-stack/page";
import { resolveLocale } from "@/lib/locales";
import { getPageMetadata } from "@/lib/metadata";

const getMetadata = createServerFn({ method: "GET" }).handler(async () => {
  const gt = await getGT();
  return {
    title: gt("My Stack - Ben Gubler"),
    description: gt(
      "Technologies, apps, and tools that Ben Gubler uses for development and productivity.",
    ),
  };
});

export const Route = createFileRoute("/{-$locale}/about/my-stack")({
  loader: () => getMetadata(),
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? getPageMetadata({
          ...loaderData,
          locale: resolveLocale(params.locale),
        })
      : [],
  }),
  component: MyStackPage,
});
