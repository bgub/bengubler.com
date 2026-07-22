import { createFileRoute, isNotFound, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getGT } from "gt-tanstack-start/server";
import { getRouteMetadata } from "@/lib/metadata";

const getMetadata = createServerFn({ method: "GET" }).handler(async () => {
  const gt = await getGT();
  return {
    title: gt("Page Not Found - Ben Gubler"),
    description: gt("The page you're looking for doesn't exist."),
  };
});

export const Route = createFileRoute("/{-$locale}/$")({
  loader: async () => {
    const metadata = await getMetadata();
    throw notFound({ data: metadata });
  },
  head: ({ match, params }) => ({
    meta: getRouteMetadata(
      isNotFound(match.error) ? match.error.data : undefined,
      params.locale,
    ),
  }),
});
