import { allPosts } from "content-collections";
import { getGT } from "gt-next/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ locale: string; slug: string }> },
) {
  const { locale, slug } = await params;

  // Find the post
  const post = allPosts.find((p) => p.slug === slug && p.locale === locale);

  if (!post) {
    const gt = await getGT();
    return new NextResponse(gt("Post not found"), { status: 404 });
  }

  // Return the raw markdown content
  return new NextResponse(post.content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=604800, immutable", // Cache for 1 week
      "X-Content-Source": "raw-markdown",
    },
  });
}

// Generate static params for all posts to enable static generation
export function generateStaticParams() {
  const seen = new Set<string>();
  const params: { slug: string }[] = [];

  for (const post of allPosts) {
    if (seen.has(post.slug)) continue;
    seen.add(post.slug);
    params.push({ slug: post.slug });
  }

  return params;
}
