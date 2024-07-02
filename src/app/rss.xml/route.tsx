import { Feed } from "feed";

import { baseUrl } from "@/lib/config";

import { getContent } from "@/lib/get-content";
import { MDXContent } from "@content-collections/mdx/react";
import { NextRequest, NextResponse } from "next/server";

const createFeed = (
  renderToString: Function,
  {
    type,
    tags,
  }: {
    type: string | null;
    tags: string[];
  }
) => {
  const feed = new Feed({
    title: "bengubler.com",
    description: "Ben Gubler's personal website",
    id: baseUrl,
    link: baseUrl,
    language: "en",
    favicon: `${baseUrl}/icon.png`,
    copyright: `Copyright ${new Date().getFullYear()} Ben Gubler`,
    author: {
      name: "Ben Gubler",
    },
  });

  const posts = getContent({
    type: "posts",
    tags,
  });

  const microblog = getContent({
    type: "microblog",
    tags,
  });

  const allContent =
    type === "posts"
      ? posts
      : type === "microblog"
      ? microblog
      : [...posts, ...microblog];

  for (const post of allContent) {
    const html = renderToString(<MDXContent code={post.mdx} />);

    feed.addItem({
      title: post.title,
      id: `${baseUrl}/${post.url}`,
      link: `${baseUrl}/${post.url}?utm_campaign=feed&utm_source=rss2`,
      description: post.description,
      content: html,
      date: post.date,
      category: post.tags
        ? post.tags.map((name) => ({ name: name }))
        : undefined,
      // image: createImageUrl(post.image.url, 256, 256, true),
    });
  }

  return feed.rss2();
};

export async function GET(req: NextRequest): Promise<NextResponse> {
  const ReactDOMServer = (await import("react-dom/server")).default;

  const searchParams = new URL(req.url).searchParams;
  const type = searchParams.get("type");
  const tags = searchParams.getAll("tags");

  const feed = createFeed(ReactDOMServer.renderToString, { type, tags });

  return new NextResponse(feed, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
