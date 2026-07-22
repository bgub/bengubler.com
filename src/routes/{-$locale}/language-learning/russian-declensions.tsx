import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getGT } from "gt-tanstack-start/server";
import { RussianCaseCardsPage } from "@/app/[locale]/language-learning/russian-declensions/page";
import { resolveLocale } from "@/lib/locales";
import { getPageMetadata } from "@/lib/metadata";

const getMetadata = createServerFn({ method: "GET" }).handler(async () => {
  const gt = await getGT();
  return {
    title: gt("Russian Case Cards - Ben Gubler"),
    description: gt("I built case cards for Russian so you don't have to."),
  };
});

export const Route = createFileRoute(
  "/{-$locale}/language-learning/russian-declensions",
)({
  loader: () => getMetadata(),
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? getPageMetadata({
          ...loaderData,
          locale: resolveLocale(params.locale),
        })
      : [],
  }),
  component: RussianCaseCardsPage,
});
