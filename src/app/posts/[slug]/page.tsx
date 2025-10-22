import { Comments } from "@/components/comments";
import { FloatingELI5 } from "@/components/floating-eli5";
import { mdxComponents } from "@/components/mdx-components";
import { TOCNode } from "@/components/mdx/remark-toc";
import { RawMarkdown } from "@/components/raw-markdown";
import { Social } from "@/components/social";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { getPostColors } from "@/lib/colors";
import { MDXContent } from "@content-collections/mdx/react";
import { allPosts } from "content-collections";
import type { Metadata } from "next/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGT, getLocale } from "gt-next/server";
import { T, DateTime } from "gt-next";
import { ViewTransition } from "react";

import { ClientTOC } from "./client-toc";

// Generate static params with unique slugs (dedup across locales)
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

// Generate metadata for each post
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) || "en";
  const post = allPosts.find((p) => p.slug === slug && (p as any).locale === locale);
  const gt = await getGT();

  if (!post) {
    return {
      title: gt("Post Not Found"),
    };
  }

  // Clean URL construction using URLSearchParams
  const ogParams = new URLSearchParams({
    title: post.title,
    description: post.description,
    type: "post",
  });
  const ogImageUrl = `/og?${ogParams.toString()}`;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: "Ben Gubler", url: "https://bengubler.com" }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date.toISOString(),
      modifiedTime: post.lastUpdated?.toISOString() || post.date.toISOString(),
      authors: ["Ben Gubler"],
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      creator: "@bgub_",
      images: [ogImageUrl],
    },
  };
}

function sanitize(slug: string, prefix: string = "") {
  return prefix + slug.replace(/[^\w\s\-\/]/gi, "").replace(/[\s\/]/g, "-");
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) || "en";
  const post = allPosts.find((p) => p.slug === slug && (p as any).locale === locale);
  const gt = await getGT();

  if (!post) {
    notFound();
  }

  const colors = getPostColors(post.slug);
  const toc: TOCNode = JSON.parse(post.toc);
  const hasTOC = toc.children.length > 0;
  const base = post.url.replace(/[^\w\s\-\/]/gi, "").replace(/[\s\/]/g, "-");

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <nav className="text-sm text-muted-foreground">
          <Link href="/posts" className="hover:text-foreground transition-colors">
            <T>Posts</T>
          </Link>
          <span className="mx-2">›</span>
          <span>{post.title}</span>
        </nav>

        {/* Styled Post Header */}
        <ViewTransition name={`post-card-${base}`}>
          <div className={`${colors.bg} ${colors.border} border rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg`}>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                <ViewTransition name={`date-${base}`}>
                  <time dateTime={post.date.toISOString()}>
                    <DateTime>{post.date}</DateTime>
                  </time>
                </ViewTransition>
                <span>•</span>
                <ViewTransition name={`reading-time-${base}`}>
                  <span>{(post as any).readingTime || gt("5 min read")}</span>
                </ViewTransition>
              </div>
              <ViewTransition name={`title-${base}`}>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight group-hover:text-foreground/90 transition-colors break-words">
                  {post.title}
                  {post.archived && (
                    <span className="text-muted-foreground"> <T>(archived)</T></span>
                  )}
                </h1>
              </ViewTransition>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <ViewTransition name={`description-${base}`}>
                <p className="text-lg leading-relaxed text-muted-foreground max-w-3xl break-words">{post.description}</p>
              </ViewTransition>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <ViewTransition key={tag} name={`tag-${base}-${tag}`}>
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5 bg-background/60 hover:bg-background/80 transition-colors"
                      >
                        #{tag.toLowerCase()}
                      </Badge>
                    </ViewTransition>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ViewTransition>
      </header>

      {/* Mobile TOC and Raw Markdown - Show before content on mobile */}
      <div className="lg:hidden space-y-4">
        {hasTOC && (
          <div className="bg-card border rounded-lg p-4">
            <ClientTOC tree={toc} />
          </div>
        )}
        <div className="bg-card border rounded-lg p-4">
          <RawMarkdown slug={post.slug} content={post.content} />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-[1fr_250px] gap-8">
        <main className="min-w-0">
          <Typography className="text-lg">
            <MDXContent code={post.mdx} components={mdxComponents} />
          </Typography>

          {/* Mobile Social - Show after content on mobile */}
          <div className="lg:hidden mt-8">
            <div className="bg-card border rounded-lg p-4">
              <Social title={post.title} />
            </div>
          </div>

          {/* Comments */}
          <div className="mt-12 pt-8 border-t">
            <Comments />
          </div>
        </main>

        {/* Desktop TOC, Social, and Raw Markdown - Show on desktop only */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {hasTOC && (
              <div className="bg-card border rounded-lg p-4">
                <ClientTOC tree={toc} />
              </div>
            )}
            <div className="bg-card border rounded-lg p-4">
              <Social title={post.title} />
            </div>
            <div className="bg-card border rounded-lg p-4">
              <RawMarkdown slug={post.slug} content={post.content} />
            </div>
          </div>
        </aside>
      </div>

      {/* Floating ELI5 Button */}
      <FloatingELI5 content={post.content} title={post.title} />
    </div>
  );
}
