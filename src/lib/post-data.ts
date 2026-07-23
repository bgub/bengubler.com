import { createServerFn } from "@bgub/fig-tanstack-start";
import { allPosts } from "content-collections";

export type PostSummary = Pick<
  (typeof allPosts)[number],
  | "archived"
  | "date"
  | "description"
  | "readingTime"
  | "slug"
  | "tags"
  | "title"
  | "url"
>;

function getPostSummaries(locale: string): PostSummary[] {
  return allPosts
    .filter((post) => post.locale === locale)
    .map(
      ({
        archived,
        date,
        description,
        readingTime,
        slug,
        tags,
        title,
        url,
      }) => ({
        archived,
        date,
        description,
        readingTime,
        slug,
        tags,
        title,
        url,
      }),
    );
}

export const getPostsForLocale = createServerFn({ method: "GET" })
  .validator((data: { locale: string }) => data)
  .handler(({ data }) => getPostSummaries(data.locale));

export const getRecentPostsForLocale = createServerFn({ method: "GET" })
  .validator((data: { locale: string }) => data)
  .handler(({ data }) => {
    const posts = getPostSummaries(data.locale)
      .filter((post) => !post.archived)
      .toSorted((a, b) => b.date.getTime() - a.date.getTime());

    return {
      hasMorePosts: posts.length > 4,
      recentPosts: posts.slice(0, 4),
    };
  });

export const getPost = createServerFn({ method: "GET" })
  .validator((data: { locale: string; slug: string }) => data)
  .handler(({ data }) =>
    allPosts.find(
      (post) => post.locale === data.locale && post.slug === data.slug,
    ),
  );
