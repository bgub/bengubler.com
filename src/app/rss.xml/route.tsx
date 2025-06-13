import { MDXContent } from "@content-collections/mdx/react";
import { allPosts } from "content-collections";
import { Feed } from "feed";
import { NextRequest, NextResponse } from "next/server";

const baseUrl = "https://bengubler.com";

const createFeed = async (renderToString: Function) => {
  const feed = new Feed({
    title: "Ben Gubler",
    description:
      "Ben Gubler's personal website. Thoughts on web development, AI, and building things that matter.",
    id: baseUrl,
    link: baseUrl,
    language: "en",
    favicon: `${baseUrl}/icon.png`,
    copyright: `Copyright ${new Date().getFullYear()} Ben Gubler`,
    author: {
      name: "Ben Gubler",
      email: "hello@bengubler.com",
      link: baseUrl,
    },
    feedLinks: {
      rss2: `${baseUrl}/rss.xml`,
    },
    generator: "Next.js",
  });

  // Get all published posts, sorted by date
  const posts = allPosts
    .filter((post) => !post.archived)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  for (const post of posts) {
    try {
      const html = renderToString(<MDXContent code={post.mdx} />);

      feed.addItem({
        title: post.title,
        id: `${baseUrl}/posts/${post.slug}`,
        link: `${baseUrl}/posts/${post.slug}?utm_campaign=feed&utm_source=rss`,
        description: post.description,
        content: html,
        date: post.date,
        category: post.tags.map((tag) => ({ name: tag })),
        author: [
          {
            name: "Ben Gubler",
            email: "hello@bengubler.com",
            link: baseUrl,
          },
        ],
      });
    } catch (error) {
      console.error(`Error processing post ${post.slug}:`, error);
    }
  }

  return feed.rss2();
};

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const ReactDOMServer = (await import("react-dom/server")).default;

    const feed = await createFeed(ReactDOMServer.renderToString);

    // Add XML stylesheet reference for better styling
    const updatedFeed = feed.replace(
      '<?xml version="1.0" encoding="utf-8"?>',
      '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>'
    );

    return new NextResponse(updatedFeed, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new NextResponse("Error generating RSS feed", { status: 500 });
  }
}
