import { dataResource, readData, useMemo } from "@bgub/fig";
import { createFileRoute } from "@tanstack/solid-router";
import { notFound } from "@tanstack/solid-router";
import type { TocNode } from "content-pipeline";
import { DateTime, getGT, T, useGT } from "gt-fig-tanstack-start";
import { Comments } from "@/components/comments";
import { Link } from "@/components/link";
import { NotFoundPanel } from "@/components/not-found-panel";
import { PageTitle } from "@/components/page-title";
import { PostTag } from "@/components/post-tag";
import { PostViewTransition } from "@/components/post-view-transition";
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

  const { displayToc, omitHeadingId } = useMemo(() => {
    const toc: TocNode = JSON.parse(post.toc);
    const firstHeading = toc.children[0];
    const isRepeatedTitle =
      firstHeading?.depth === 1 &&
      firstHeading.title?.trim().replace(/\s+/g, " ") ===
        post.title.trim().replace(/\s+/g, " ");

    return {
      displayToc: isRepeatedTitle
        ? {
            ...toc,
            children: [
              ...(firstHeading.children ?? []),
              ...toc.children.slice(1),
            ],
          }
        : toc,
      omitHeadingId: isRepeatedTitle ? firstHeading.id : undefined,
    };
  }, [post.toc, post.title]);
  const hasTOC = displayToc.children.length > 0;
  const { activeSection, onNavigate } = useTOCScrollspy(displayToc);

  return (
    <div class="interior-wireframe post-article">
      <header class="page-header post-article-header">
        {/* Breadcrumb */}
        <nav class="post-article-breadcrumb">
          <Link
            href="/posts"
            class="hover:text-foreground transition-colors no-underline"
          >
            &lsaquo; <T>All Posts</T>
          </Link>
        </nav>

        {/* Date + reading time */}
        <div class="post-article-meta">
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
          <p class="post-article-description">{post.description}</p>
        </PostViewTransition>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div class="post-article-tags flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <PostViewTransition
                key={tag}
                kind="tag"
                postUrl={post.url}
                suffix={tag}
              >
                <Link
                  href={`/posts?tag=${encodeURIComponent(tag)}`}
                  class="no-underline"
                >
                  <PostTag tag={tag} />
                </Link>
              </PostViewTransition>
            ))}
          </div>
        )}
      </header>

      {/* Mobile TOC and Raw Markdown */}
      <div class="post-article-mobile-tools lg:hidden">
        {hasTOC && (
          <details class="post-article-mobile-toc">
            <summary>
              <T>In this entry</T>
              <span class="icon-[lucide--chevron-down]" aria-hidden="true" />
            </summary>
            <ClientTOC
              showHeading={false}
              tree={displayToc}
              activeSection={activeSection}
              onNavigate={onNavigate}
            />
          </details>
        )}
        <div class="post-article-mobile-raw">
          <RawMarkdown slug={post.slug} />
        </div>
      </div>

      {/* Main Content */}
      <div class="post-article-body">
        <main class="post-article-main min-w-0">
          <div class="post-article-content">
            <Typography>
              <PostContent body={post.body} omitHeadingId={omitHeadingId} />
            </Typography>
          </div>

          {/* Mobile Social */}
          <div class="post-article-mobile-social lg:hidden">
            <Social title={post.title} />
          </div>

          {/* Comments */}
          <div class="post-article-comments">
            <Comments />
          </div>
        </main>

        {/* Desktop sidebar */}
        <aside class="post-article-aside hidden lg:block">
          <div class="sticky top-24 space-y-6">
            {hasTOC && (
              <ClientTOC
                tree={displayToc}
                activeSection={activeSection}
                onNavigate={onNavigate}
              />
            )}
            <Social title={post.title} />
            <RawMarkdown slug={post.slug} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function PostNotFound() {
  return (
    <NotFoundPanel
      title={<T>Post Not Found</T>}
      description={
        <T>
          Sorry, the post you're looking for doesn't exist or has been moved.
        </T>
      }
    >
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
    </NotFoundPanel>
  );
}
