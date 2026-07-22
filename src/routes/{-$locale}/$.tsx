import { createFileRoute, isNotFound, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getGT } from "gt-tanstack-start/server";
import { PageNotFound } from "@/components/not-found-page";
import { resolveLocale } from "@/lib/locales";
import { getPageMetadata } from "@/lib/metadata";

type NotFoundMetadata = {
  description: string;
  title: string;
};

const getMetadata = createServerFn({ method: "GET" }).handler(async () => {
  const gt = await getGT();
  return {
    title: gt("Page Not Found - Ben Gubler"),
    description: gt("The page you're looking for doesn't exist."),
  };
});

function getNotFoundMetadata(error: unknown) {
  if (!isNotFound(error)) return undefined;
  return error.data as NotFoundMetadata | undefined;
}

export const Route = createFileRoute("/{-$locale}/$")({
  loader: async () => {
    const metadata = await getMetadata();
    throw notFound({ data: metadata });
  },
  head: ({ match, params }) => {
    const metadata = getNotFoundMetadata(match.error);
    return {
      meta: metadata
        ? getPageMetadata({
            ...metadata,
            locale: resolveLocale(params.locale),
          })
        : [],
    };
  },
  notFoundComponent: PageNotFound,
});
