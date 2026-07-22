import { allPosts } from "content-collections";
import { getGT } from "gt-tanstack-start/server";
import type { Locale } from "@/lib/locales";

export async function getRawPostResponse(locale: Locale, slug: string) {
  const post = allPosts.find(
    (item) => item.slug === slug && item.locale === locale,
  );

  if (!post) {
    const gt = await getGT();
    return new Response(gt("Post not found"), {
      status: 404,
    });
  }

  return new Response(post.content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=604800, immutable",
      "X-Content-Source": "raw-markdown",
    },
  });
}
