import { createFileRoute, isNotFound, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { TocNode } from "content-pipeline";
import { DateTime, T, useGT } from "gt-react";
import { getGT } from "gt-tanstack-start/server";
import { Comments } from "@/components/comments";
import { ClientTOC } from "@/components/content/client-toc";
import { PostContent } from "@/components/content/post-content";
import { FloatingELI5 } from "@/components/floating-eli5";
import { Link } from "@/components/link";
import { PostNotFound } from "@/components/not-found-page";
import { PageTitle } from "@/components/page-title";
import { RawMarkdown } from "@/components/raw-markdown";
import { Social } from "@/components/social";
import { Squiggle } from "@/components/squiggle";
import { Typography } from "@/components/ui/typography";
import { ViewTransition } from "@/components/view-transition";
import { resolveLocale } from "@/lib/locales";
import { getPageMetadata, getPostMetadata } from "@/lib/metadata";
import { getPost } from "@/lib/post-data";

type NotFoundMetadata = {
  description: string;
  title: string;
};

const getNotFoundMetadata = createServerFn({ method: "GET" }).handler(
  async () => {
    const gt = await getGT();
    return {
      title: gt("Post Not Found - Ben Gubler"),
      description: gt("The post you're looking for doesn't exist."),
    };
  },
);

function getErrorMetadata(error: unknown) {
  if (!isNotFound(error)) return undefined;
  return error.data as NotFoundMetadata | undefined;
}

export const Route = createFileRoute("/{-$locale}/posts/$slug")({
  loader: async ({ params }) => {
    const post = await getPost({
      data: { locale: resolveLocale(params.locale), slug: params.slug },
    });
    if (!post) {
      const metadata = await getNotFoundMetadata();
      throw notFound({ data: metadata });
    }
    return { post };
  },
  head: ({ loaderData, match }) => {
    const post = loaderData?.post;
    if (!post) {
      const metadata = getErrorMetadata(match.error);
      return {
        meta: metadata
          ? getPageMetadata({
              ...metadata,
              locale: resolveLocale(match.params.locale),
            })
          : [],
      };
    }
    return {
      meta: getPostMetadata({
        title: post.title,
        description: post.description,
        locale: resolveLocale(match.params.locale),
        date: post.date,
        lastUpdated: post.lastUpdated,
        tags: post.tags,
      }),
    };
  },
  component: PostPage,
  notFoundComponent: PostNotFound,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  const gt = useGT();

  const toc: TocNode = JSON.parse(post.toc);
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
          <PageTitle>
            {post.title}
            {post.archived && (
              <span className="text-muted-foreground">
                {" "}
                <T>(archived)</T>
              </span>
            )}
          </PageTitle>
        </ViewTransition>

        <ViewTransition name={`description-${base}`}>
          <p className="font-serif text-lg leading-relaxed text-ink-soft font-light">
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
            <PostContent body={post.body} />
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
