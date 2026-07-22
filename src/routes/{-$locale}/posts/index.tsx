import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getGT } from "gt-tanstack-start/server";
import { PostsPage } from "@/app/[locale]/posts/page";
import { resolveLocale } from "@/lib/locales";
import { getPageMetadata } from "@/lib/metadata";
import { getPostsForLocale } from "@/lib/post-data";

const getMetadata = createServerFn({ method: "GET" }).handler(async () => {
  const gt = await getGT();
  return {
    title: gt("Posts - Ben Gubler"),
    description: gt(
      "Thoughts on web development, AI, and building things that matter.",
    ),
  };
});

export const Route = createFileRoute("/{-$locale}/posts/")({
  validateSearch: (search: Record<string, unknown>) => ({
    tag: typeof search.tag === "string" ? search.tag : undefined,
  }),
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
  component: PostsRoute,
});

function PostsRoute() {
  const { tag } = Route.useSearch();
  const { posts } = Route.useLoaderData();
  return <PostsPage posts={posts} selectedTag={tag} />;
}
