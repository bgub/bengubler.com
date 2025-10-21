import { allPosts } from "content-collections";
import { NextRequest, NextResponse } from "next/server";
import { getGT, getLocale } from "gt-next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const locale = (await getLocale()) || "en";

  // Find the post
  const post = allPosts.find((p) => p.slug === slug && (p as any).locale === locale);

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
  return allPosts
    .filter((post) => {
      if (seen.has(post.slug)) return false;
      seen.add(post.slug);
      return true;
    })
    .map((post) => ({ slug: post.slug }));
}
