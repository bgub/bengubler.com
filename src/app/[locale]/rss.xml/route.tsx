import { allPosts } from "content-collections";
import { Feed } from "feed";
import { getGT, registerLocale } from "gt-next/server";
import { NextResponse } from "next/server";
import { createElement, type ReactNode } from "react";
import type ReactDOMServer from "react-dom/server";
import {
  type ContentComponents,
  ContentRenderer,
} from "@/components/content/render-content";
import { getBaseUrl } from "@/lib/utils";

const baseUrl = getBaseUrl();

function RssTweet({ id }: { id?: string }) {
  if (!id) return null;

  return (
    <p>
      <a href={`https://x.com/i/status/${id}`}>View tweet</a>
    </p>
  );
}

function RssHeading({
  id,
  level,
  children,
}: {
  id?: string;
  level: number;
  children?: ReactNode;
}) {
  return createElement(`h${level}`, { id }, children);
}

function RssFence({ content }: { content: string }) {
  return (
    <pre>
      <code>{content}</code>
    </pre>
  );
}

function RssInlineCode({ content }: { content: string }) {
  return <code>{content}</code>;
}

const rssContentComponents = {
  Blockquote: "blockquote",
  ContentLink: "a",
  Fence: RssFence,
  Heading: RssHeading,
  InlineCode: RssInlineCode,
  Tweet: RssTweet,
} satisfies ContentComponents;

const createFeed = async (
  renderToString: typeof ReactDOMServer.renderToString,
  locale: string,
) => {
  const localeBaseUrl = `${baseUrl}/${locale}`;
  const gt = await getGT();
  const feed = new Feed({
    title: "Ben Gubler",
    description: gt(
      "Ben Gubler's personal website. Thoughts on web development, AI, and building things that matter.",
    ),
    id: localeBaseUrl,
    link: localeBaseUrl,
    language: locale,
    favicon: `${baseUrl}/icon.png`,
    copyright: gt("Copyright {year} Ben Gubler", {
      year: new Date().getFullYear(),
    }),
    author: {
      name: "Ben Gubler",
      email: "hello@bengubler.com",
      link: baseUrl,
    },
    feedLinks: {
      rss2: `${localeBaseUrl}/rss.xml`,
    },
    generator: "Next.js",
  });

  // Get all published posts for current locale, sorted by date
  const posts = allPosts
    .filter((post) => post.locale === locale && !post.archived)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  for (const post of posts) {
    try {
      const html = renderToString(
        <ContentRenderer body={post.body} components={rssContentComponents} />,
      );

      feed.addItem({
        title: post.title,
        id: `${localeBaseUrl}/posts/${post.slug}`,
        link: `${localeBaseUrl}/posts/${post.slug}?utm_campaign=feed&utm_source=rss`,
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
): Promise<NextResponse> {
  try {
    const { locale } = await params;
    registerLocale(locale);

    const ReactDOMServer = (await import("react-dom/server")).default;

    const feed = await createFeed(ReactDOMServer.renderToString, locale);

    // Add XML stylesheet reference for better styling
    const updatedFeed = feed.replace(
      '<?xml version="1.0" encoding="utf-8"?>',
      '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>',
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
