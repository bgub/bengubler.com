import { createFileRoute, isNotFound, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getGT } from "gt-tanstack-start/server";
import { PostPage } from "@/app/[locale]/posts/[slug]/page";
import { PostNotFound } from "@/components/not-found-page";
import { resolveLocale } from "@/lib/locales";
import { getPageMetadata, getPostMetadata } from "@/lib/metadata";
import { getPost } from "@/lib/post-data";

type NotFoundMetadata = {
  description: string;
  title: string;
};

const getNotFoundMetadata = createServerFn({ method: "GET" }).handler(
  async () => {
    const gt = await getGT();
    return {
      title: gt("Post Not Found - Ben Gubler"),
      description: gt("The post you're looking for doesn't exist."),
    };
  },
);

function getErrorMetadata(error: unknown) {
  if (!isNotFound(error)) return undefined;
  return error.data as NotFoundMetadata | undefined;
}

export const Route = createFileRoute("/{-$locale}/posts/$slug")({
  loader: async ({ params }) => {
    const post = await getPost({
      data: { locale: resolveLocale(params.locale), slug: params.slug },
    });
    if (!post) {
      const metadata = await getNotFoundMetadata();
      throw notFound({ data: metadata });
    }
    return { post };
  },
  head: ({ loaderData, match }) => {
    const post = loaderData?.post;
    if (!post) {
      const metadata = getErrorMetadata(match.error);
      return {
        meta: metadata
          ? getPageMetadata({
              ...metadata,
              locale: resolveLocale(match.params.locale),
            })
          : [],
      };
    }
    return {
      meta: getPostMetadata({
        title: post.title,
        description: post.description,
        locale: resolveLocale(match.params.locale),
        date: post.date,
        lastUpdated: post.lastUpdated,
        tags: post.tags,
      }),
    };
  },
  component: PostRoute,
  notFoundComponent: PostNotFound,
});

function PostRoute() {
  const { post } = Route.useLoaderData();
  return <PostPage post={post} />;
}
