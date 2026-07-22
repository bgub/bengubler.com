import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getGT } from "gt-tanstack-start/server";
import { LanguageLearningPage } from "@/app/[locale]/language-learning/page";
import { resolveLocale } from "@/lib/locales";
import { getPageMetadata } from "@/lib/metadata";

const getMetadata = createServerFn({ method: "GET" }).handler(async () => {
  const gt = await getGT();
  return {
    title: gt("Language Learning - Ben Gubler"),
    description: gt(
      "Tools and resources for learning languages, including declension practice apps and more.",
    ),
  };
});

export const Route = createFileRoute("/{-$locale}/language-learning/")({
  loader: () => getMetadata(),
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? getPageMetadata({
          ...loaderData,
          locale: resolveLocale(params.locale),
        })
      : [],
  }),
  component: LanguageLearningPage,
});
