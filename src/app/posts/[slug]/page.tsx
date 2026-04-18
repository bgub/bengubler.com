import { MDXContent } from "@content-collections/mdx/react";
import { allPosts } from "content-collections";
import { DateTime, T } from "gt-next";
import { getGT, getLocale } from "gt-next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { ViewTransition } from "react";
import { Comments } from "@/components/comments";
import { FloatingELI5 } from "@/components/floating-eli5";
import type { TOCNode } from "@/components/mdx/remark-toc";
import { mdxComponents } from "@/components/mdx-components";
import { RawMarkdown } from "@/components/raw-markdown";
import { Social } from "@/components/social";
import { Squiggle } from "@/components/squiggle";
import { Typography } from "@/components/ui/typography";
import { getPostColors } from "@/lib/colors";

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
  const post = allPosts.find((p) => p.slug === slug && p.locale === locale);
  const gt = await getGT();

  if (!post) {
    return {
      title: gt("Post Not Found"),
    };
  }

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

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) || "en";
  const post = allPosts.find((p) => p.slug === slug && p.locale === locale);
  const gt = await getGT();

  if (!post) {
    notFound();
  }

  const colors = getPostColors(post.slug);
  const toc: TOCNode = JSON.parse(post.toc);
  const hasTOC = toc.children.length > 0;
  const base = post.url.replace(/[^\w\s\-/]/gi, "").replace(/[\s/]/g, "-");

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        {/* Breadcrumb */}
        <nav className="font-mono text-[11px] text-muted-foreground tracking-wide">
          <Link
            href="/posts"
            className="hover:text-foreground transition-colors no-underline"
          >
            &lsaquo; <T>All Posts</T>
          </Link>
        </nav>

        {/* Date + reading time */}
        <div className="font-mono text-[11px] text-muted-foreground tracking-wide">
          <ViewTransition name={`date-${base}`}>
            <time dateTime={post.date.toISOString()}>
              <DateTime>{post.date}</DateTime>
            </time>
          </ViewTransition>
          <span className="mx-1.5">&middot;</span>
          <ViewTransition name={`reading-time-${base}`}>
            <span>{post.readingTime || gt("5 min read")}</span>
          </ViewTransition>
        </div>

        {/* Title */}
        <ViewTransition name={`title-${base}`}>
          <h1 className="font-serif font-medium text-4xl sm:text-5xl tracking-tight text-foreground leading-[1.02]">
            {post.title}
            {post.archived && (
              <span className="text-muted-foreground">
                {" "}
                <T>(archived)</T>
              </span>
            )}
            <span className="text-peach-deep">.</span>
          </h1>
        </ViewTransition>

        <ViewTransition name={`description-${base}`}>
          <p className="font-serif text-lg leading-relaxed text-ink-soft font-light max-w-2xl">
            {post.description}
          </p>
        </ViewTransition>

        <Squiggle className="text-lavender w-24" height={6} />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <ViewTransition key={tag} name={`tag-${base}-${tag}`}>
                <span className="font-mono text-[11px] text-ink-soft px-2 py-0.5 border border-border rounded-sm bg-card">
                  #{tag.toLowerCase()}
                </span>
              </ViewTransition>
            ))}
          </div>
        )}
      </header>

      {/* Mobile TOC and Raw Markdown */}
      <div className="lg:hidden space-y-4">
        {hasTOC && (
          <div className="border border-border rounded-sm p-4 bg-card">
            <ClientTOC tree={toc} />
          </div>
        )}
        <div className="border border-border rounded-sm p-4 bg-card">
          <RawMarkdown slug={post.slug} content={post.content} />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-[1fr_180px] gap-8">
        <main className="min-w-0">
          <Typography className="text-lg">
            <MDXContent code={post.mdx} components={mdxComponents} />
          </Typography>

          {/* Mobile Social */}
          <div className="lg:hidden mt-8">
            <div className="border border-border rounded-sm p-4 bg-card">
              <Social title={post.title} />
            </div>
          </div>

          {/* Comments */}
          <div className="mt-12 pt-8 border-t border-border">
            <Comments />
          </div>
        </main>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6 border-l border-dotted border-border pl-4">
            {hasTOC && <ClientTOC tree={toc} />}
            <Social title={post.title} />
            <RawMarkdown slug={post.slug} content={post.content} />
          </div>
        </aside>
      </div>

      {/* Floating ELI5 Button */}
      <FloatingELI5 content={post.content} title={post.title} />
    </div>
  );
}
