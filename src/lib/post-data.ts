import { createServerFn } from "@tanstack/react-start";
import { allPosts } from "content-collections";

export const getPostsForLocale = createServerFn({ method: "GET" })
  .validator((data: { locale: string }) => data)
  .handler(({ data }) =>
    allPosts
      .filter((post) => post.locale === data.locale)
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
      ),
  );

export const getPost = createServerFn({ method: "GET" })
  .validator((data: { locale: string; slug: string }) => data)
  .handler(({ data }) =>
    allPosts.find(
      (post) => post.locale === data.locale && post.slug === data.slug,
    ),
  );
