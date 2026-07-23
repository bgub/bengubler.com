import type { FigNode } from "@bgub/fig";
import { prerender } from "@bgub/fig-server";
import { createFileRoute } from "@tanstack/solid-router";
import { allPosts } from "content-collections";
import { Feed } from "feed";
import { getGT } from "gt-fig-tanstack-start";
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
  level: keyof typeof headingTags;
  children?: FigNode;
}) {
  const HeadingTag = headingTags[level];
  return <HeadingTag id={id}>{children}</HeadingTag>;
}

const headingTags = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
} as const;

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
      GET: async () => {
        const baseUrl = getBaseUrl();
        const locale = resolveLocale();
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
          const content = await prerender(
            <ContentRenderer body={post.body} components={rssComponents} />,
          );
          feed.addItem({
            title: post.title,
            id: `${localeBaseUrl}/posts/${post.slug}`,
            link: `${localeBaseUrl}/posts/${post.slug}?utm_campaign=feed&utm_source=rss`,
            description: post.description,
            content: content.html,
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
