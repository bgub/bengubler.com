import { createFileRoute, isNotFound, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { TocNode } from "content-pipeline";
import { DateTime, T, useGT } from "gt-tanstack-start";
import { getGT } from "gt-tanstack-start/server";
import { Comments } from "@/components/comments";
import { Link } from "@/components/link";
import { PageTitle } from "@/components/page-title";
import { Squiggle } from "@/components/squiggle";
import { resolveLocale } from "@/lib/locales";
import { getPostMetadata, getRouteMetadata } from "@/lib/metadata";
import { getPost } from "@/lib/post-data";
import { getPostTransitionName } from "@/lib/view-transitions";
import { ClientTOC } from "./-components/client-toc";
import { PostContent } from "./-components/post-content";
import { RawMarkdown } from "./-components/raw-markdown";
import { Social } from "./-components/social";
import { Typography } from "./-components/typography";

const getPostNotFoundMetadata = createServerFn({ method: "GET" }).handler(
  async () => {
    const gt = await getGT();
    return {
      title: gt("Post Not Found - Ben Gubler"),
      description: gt("The post you're looking for doesn't exist."),
    };
  },
);

export const Route = createFileRoute("/{-$locale}/posts/$slug")({
  loader: async ({ params }) => {
    const post = await getPost({
      data: { locale: resolveLocale(params.locale), slug: params.slug },
    });
    if (!post) {
      const metadata = await getPostNotFoundMetadata();
      throw notFound({ data: metadata });
    }
    return { post };
  },
  head: ({ loaderData, match }) => {
    const post = loaderData?.post;
    if (!post) {
      return {
        meta: getRouteMetadata(
          isNotFound(match.error) ? match.error.data : undefined,
          match.params.locale,
        ),
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
          <time
            dateTime={post.date.toISOString()}
            style={{
              viewTransitionName: getPostTransitionName("date", post.url),
            }}
          >
            <DateTime options={{ timeZone: "UTC" }}>{post.date}</DateTime>
          </time>
          <span className="mx-1.5">&middot;</span>
          <span
            style={{
              viewTransitionName: getPostTransitionName(
                "reading-time",
                post.url,
              ),
            }}
          >
            {post.readingTime || gt("5 min read")}
          </span>
        </div>

        {/* Title */}
        <PageTitle
          style={{
            viewTransitionName: getPostTransitionName("title", post.url),
          }}
        >
          {post.title}
          {post.archived && (
            <span className="text-muted-foreground">
              {" "}
              <T>(archived)</T>
            </span>
          )}
        </PageTitle>

        <p
          className="font-serif text-lg leading-relaxed text-ink-soft font-light"
          style={{
            viewTransitionName: getPostTransitionName("description", post.url),
          }}
        >
          {post.description}
        </p>

        <Squiggle className="text-lavender w-24" height={6} />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] text-ink-soft px-2 py-0.5 border border-border rounded-sm bg-card"
                style={{
                  viewTransitionName: getPostTransitionName(
                    "tag",
                    post.url,
                    tag,
                  ),
                }}
              >
                #{tag.toLowerCase()}
              </span>
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
          <Typography>
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
    </div>
  );
}

function PostNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-y-6 text-center">
      <div className="space-y-4">
        <T>
          <h1 className="font-serif text-6xl font-medium text-muted-foreground">
            404
          </h1>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">
            Post Not Found
          </h2>
          <p className="mx-auto max-w-md font-serif text-lg font-light leading-relaxed text-ink-soft">
            Sorry, the post you're looking for doesn't exist or has been moved.
          </p>
        </T>
      </div>
      <div className="flex items-center gap-4 font-mono text-[11.5px]">
        <T>
          <Link
            href="/posts"
            className="border-b border-border pb-px text-ink-soft no-underline transition-colors hover:border-ink-mute hover:text-foreground"
          >
            Browse All Posts
          </Link>
        </T>
        <span className="text-ink-faint">&middot;</span>
        <T>
          <Link
            href="/"
            className="border-b border-border pb-px text-ink-soft no-underline transition-colors hover:border-ink-mute hover:text-foreground"
          >
            Go Home
          </Link>
        </T>
      </div>
    </div>
  );
}
