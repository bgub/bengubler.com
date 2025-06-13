import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for a post with .md extension
  const postMdMatch = pathname.match(/^\/posts\/([^\/]+)\.md$/);

  if (postMdMatch) {
    const slug = postMdMatch[1];
    // Rewrite to our API route that serves raw markdown
    return NextResponse.rewrite(new URL(`/api/posts/${slug}/raw`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/posts/:path*.md",
};
