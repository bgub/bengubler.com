import { createServerFn } from "@bgub/fig-tanstack-start";
import { posts } from "fig-content:data";

export type PostSummary = Omit<
  (typeof posts.summaries)[number],
  "lastUpdated" | "locale"
>;

function getPostSummaries(locale: string): PostSummary[] {
  return posts.summaries
    .filter((post) => post.locale === locale)
    .map(
      ({ lastUpdated: _lastUpdated, locale: _locale, ...summary }) => summary,
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
  .handler(async ({ data }) => {
    const post = await posts.load(`${data.locale}/${data.slug}`);
    if (!post) return undefined;
    const { content: _content, ...pageData } = post;
    return pageData;
  });
