import { createFileRoute } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { Feed } from "feed";
import { getGT } from "gt-tanstack-start/server";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  type ContentComponents,
  ContentRenderer,
} from "@/components/content/render-content";
import { getLocalizedPath, resolveLocale } from "@/lib/locales";
import { getBaseUrl } from "@/lib/utils";

function RssTweet({ id }: { id?: string }) {
  return id ? <a href={`https://x.com/i/status/${id}`}>View tweet</a> : null;
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

const rssComponents = {
  Blockquote: "blockquote",
  ContentLink: "a",
  Fence: ({ content }: { content: string }) => (
    <pre>
      <code>{content}</code>
    </pre>
  ),
  Heading: RssHeading,
  InlineCode: ({ content }: { content: string }) => <code>{content}</code>,
  Tweet: RssTweet,
} satisfies ContentComponents;

export const Route = createFileRoute("/{-$locale}/rss.xml")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const baseUrl = getBaseUrl();
        const locale = resolveLocale(params.locale);
        const gt = await getGT();
        const localePath = getLocalizedPath("/", locale);
        const localeBaseUrl = `${baseUrl}${localePath === "/" ? "" : localePath}`;
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
          feedLinks: { rss2: `${localeBaseUrl}/rss.xml` },
          generator: "TanStack Start",
        });

        const posts = allPosts
          .filter((post) => post.locale === locale && !post.archived)
          .sort((a, b) => b.date.getTime() - a.date.getTime());

        for (const post of posts) {
          feed.addItem({
            title: post.title,
            id: `${localeBaseUrl}/posts/${post.slug}`,
            link: `${localeBaseUrl}/posts/${post.slug}?utm_campaign=feed&utm_source=rss`,
            description: post.description,
            content: renderToStaticMarkup(
              <ContentRenderer body={post.body} components={rssComponents} />,
            ),
            date: post.date,
            category: post.tags.map((tag) => ({ name: tag })),
            author: [{ name: "Ben Gubler", link: baseUrl }],
          });
        }

        const body = feed
          .rss2()
          .replace(
            '<?xml version="1.0" encoding="utf-8"?>',
            '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>',
          );

        return new Response(body, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "s-maxage=3600, stale-while-revalidate",
          },
        });
      },
    },
  },
});
