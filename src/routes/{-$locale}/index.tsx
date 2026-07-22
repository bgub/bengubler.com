import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getGT } from "gt-tanstack-start/server";
import { HomePage } from "@/app/[locale]/page";
import { resolveLocale } from "@/lib/locales";
import { getPageMetadata } from "@/lib/metadata";
import { getPostsForLocale } from "@/lib/post-data";

const getMetadata = createServerFn({ method: "GET" }).handler(async () => {
  const gt = await getGT();
  return {
    title: "Ben Gubler",
    description: gt(
      "Ben Gubler's personal website. Working at General Translation, previously interned at Vercel. Studying AI and human languages at BYU.",
    ),
  };
});

export const Route = createFileRoute("/{-$locale}/")({
  loader: async ({ params }) => {
    const locale = resolveLocale(params.locale);
    const [posts, metadata] = await Promise.all([
      getPostsForLocale({ data: { locale } }),
      getMetadata(),
    ]);
    return { posts, metadata };
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? getPageMetadata({
          ...loaderData.metadata,
          locale: resolveLocale(params.locale),
        })
      : [],
  }),
  component: HomeRoute,
});

function HomeRoute() {
  const { posts } = Route.useLoaderData();
  return <HomePage posts={posts} />;
}
