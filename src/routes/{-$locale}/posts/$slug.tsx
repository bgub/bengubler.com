import { dataResource, readData, useMemo } from "@bgub/fig";
import { createFileRoute } from "@tanstack/solid-router";
import { notFound } from "@tanstack/solid-router";
import type { TocNode } from "content-pipeline";
import { DateTime, getGT, T, useGT } from "gt-fig-tanstack-start";
import { Comments } from "@/components/comments";
import { Link } from "@/components/link";
import { PageTitle } from "@/components/page-title";
import { PostViewTransition } from "@/components/post-view-transition";
import { Squiggle } from "@/components/squiggle";
import { type Locale, resolveLocale } from "@/lib/locales";
import { getPageMetadata, getPostMetadata } from "@/lib/metadata";
import { getPost } from "@/lib/post-data";
import { ClientTOC, useTOCScrollspy } from "./-components/client-toc";
import { PostContent } from "./-components/post-content";
import { RawMarkdown } from "./-components/raw-markdown";
import { Social } from "./-components/social";
import { Typography } from "./-components/typography";

const postResource = dataResource({
  key: (locale: Locale, slug: string) => ["post", locale, slug],
  load: (locale: Locale, slug: string) => getPost({ data: { locale, slug } }),
});

export const Route = createFileRoute("/{-$locale}/posts/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.data.ensureData(
      postResource,
      resolveLocale(),
      params.slug,
    );
    if (!post) {
      throw notFound();
    }
  },
  head: async ({ match, params }) => {
    const post = await match.context.data.ensureData(
      postResource,
      resolveLocale(),
      params.slug,
    );
    if (!post) {
      const gt = await getGT();
      return {
        meta: getPageMetadata({
          title: gt("Post Not Found - Ben Gubler"),
          description: gt("The post you're looking for doesn't exist."),
        }),
      };
    }
    return {
      meta: getPostMetadata({
        title: post.title,
        description: post.description,
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
  const { slug } = Route.useParams();
  const post = readData(postResource, resolveLocale(), slug);
  if (!post) throw notFound();
  const gt = useGT();

  const toc = useMemo<TocNode>(() => JSON.parse(post.toc), [post.toc]);
  const hasTOC = toc.children.length > 0;
  const { activeSection, onNavigate } = useTOCScrollspy(toc);

  return (
    <div class="space-y-8">
      <header class="space-y-4">
        {/* Breadcrumb */}
        <nav class="font-mono text-[11px] text-muted-foreground tracking-wide">
          <Link
            href="/posts"
            class="hover:text-foreground transition-colors no-underline"
          >
            &lsaquo; <T>All Posts</T>
          </Link>
        </nav>

        {/* Date + reading time */}
        <div class="font-mono text-[11px] text-muted-foreground tracking-wide">
          <PostViewTransition kind="date" postUrl={post.url}>
            <time datetime={post.date.toISOString()}>
              <DateTime options={{ timeZone: "UTC" }}>{post.date}</DateTime>
            </time>
          </PostViewTransition>
          <span class="mx-1.5">&middot;</span>
          <PostViewTransition kind="reading-time" postUrl={post.url}>
            <span>{post.readingTime || gt("5 min read")}</span>
          </PostViewTransition>
        </div>

        {/* Title */}
        <PostViewTransition kind="title" postUrl={post.url}>
          <PageTitle>
            {post.title}
            {post.archived && (
              <span class="text-muted-foreground">
                {" "}
                <T>(archived)</T>
              </span>
            )}
          </PageTitle>
        </PostViewTransition>

        <PostViewTransition kind="description" postUrl={post.url}>
          <p class="font-serif text-lg leading-relaxed text-ink-soft font-light">
            {post.description}
          </p>
        </PostViewTransition>

        <Squiggle class="text-lavender w-24" height={6} />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div class="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <PostViewTransition
                key={tag}
                kind="tag"
                postUrl={post.url}
                suffix={tag}
              >
                <span class="font-mono text-[11px] text-ink-soft px-2 py-0.5 border border-border rounded-sm bg-card">
                  #{tag.toLowerCase()}
                </span>
              </PostViewTransition>
            ))}
          </div>
        )}
      </header>

      {/* Mobile TOC and Raw Markdown */}
      <div class="lg:hidden space-y-4">
        {hasTOC && (
          <div class="border border-border rounded-sm p-4 bg-card">
            <ClientTOC
              tree={toc}
              activeSection={activeSection}
              onNavigate={onNavigate}
            />
          </div>
        )}
        <div class="border border-border rounded-sm p-4 bg-card">
          <RawMarkdown slug={post.slug} content={post.content} />
        </div>
      </div>

      {/* Main Content */}
      <div class="grid lg:grid-cols-[1fr_180px] gap-8">
        <main class="min-w-0">
          <Typography>
            <PostContent body={post.body} />
          </Typography>

          {/* Mobile Social */}
          <div class="lg:hidden mt-8">
            <div class="border border-border rounded-sm p-4 bg-card">
              <Social title={post.title} />
            </div>
          </div>

          {/* Comments */}
          <div class="mt-12 pt-8 border-t border-border">
            <Comments />
          </div>
        </main>

        {/* Desktop sidebar */}
        <aside class="hidden lg:block">
          <div class="sticky top-24 space-y-6 border-l border-dotted border-border pl-4">
            {hasTOC && (
              <ClientTOC
                tree={toc}
                activeSection={activeSection}
                onNavigate={onNavigate}
              />
            )}
            <Social title={post.title} />
            <RawMarkdown slug={post.slug} content={post.content} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function PostNotFound() {
  return (
    <div class="flex min-h-[60vh] flex-col items-center justify-center gap-y-6 text-center">
      <div class="space-y-4">
        <T>
          <h1 class="font-serif text-6xl font-medium text-muted-foreground">
            404
          </h1>
          <h2 class="font-serif text-3xl font-medium tracking-tight text-foreground">
            Post Not Found
          </h2>
          <p class="mx-auto max-w-md font-serif text-lg font-light leading-relaxed text-ink-soft">
            Sorry, the post you're looking for doesn't exist or has been moved.
          </p>
        </T>
      </div>
      <div class="flex items-center gap-4 font-mono text-[11.5px]">
        <T>
          <Link
            href="/posts"
            class="border-b border-border pb-px text-ink-soft no-underline transition-colors hover:border-ink-mute hover:text-foreground"
          >
            Browse All Posts
          </Link>
        </T>
        <span class="text-ink-faint">&middot;</span>
        <T>
          <Link
            href="/"
            class="border-b border-border pb-px text-ink-soft no-underline transition-colors hover:border-ink-mute hover:text-foreground"
          >
            Go Home
          </Link>
        </T>
      </div>
    </div>
  );
}
