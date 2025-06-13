import { allPosts } from "content-collections";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Find the post
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    return new NextResponse("Post not found", { status: 404 });
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
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}
