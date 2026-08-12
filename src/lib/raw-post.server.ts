import { posts } from "fig-content:data";
import { getGT } from "gt-fig-tanstack-start";
import type { Locale } from "@/lib/locales";

export async function getRawPostResponse(locale: Locale, slug: string) {
  const post = await posts.load(`${locale}/${slug}`);

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
