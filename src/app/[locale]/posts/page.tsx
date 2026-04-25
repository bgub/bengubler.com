import { allPosts } from "content-collections";
import { DateTime, T, Var } from "gt-next";
import { getGT, getLocale } from "gt-next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { PageTitle } from "@/components/page-title";

function sanitize(slug: string) {
  return slug.replace(/[^\w\s\-/]/gi, "").replace(/[\s/]/g, "-");
}

export async function generateMetadata(): Promise<Metadata> {
  const gt = await getGT();
  return {
    title: gt("Posts - Ben Gubler"),
    description: gt(
      "Thoughts on web development, AI, and building things that matter.",
    ),
  };
}

interface PostsPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { tag: selectedTag } = await searchParams;
  const locale = (await getLocale()) || "en";

  const localePosts = allPosts.filter((p) => p.locale === locale);

  const sortedPosts = localePosts.sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  const tagCounts = localePosts
    .flatMap((post) => post.tags)
    .reduce(
      (counts, tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
        return counts;
      },
      {} as Record<string, number>,
    );

  const allTags = Object.keys(tagCounts).sort((a, b) => {
    const countDiff = tagCounts[b] - tagCounts[a];
    return countDiff !== 0 ? countDiff : a.localeCompare(b);
  });

  const filteredPosts = sortedPosts.filter((post) => {
    if (selectedTag && !post.tags.includes(selectedTag)) {
      return false;
    }
    return !post.archived;
  });

  const archivedPosts = sortedPosts.filter((post) => post.archived);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <div className="flex items-center justify-between">
          <PageTitle>
            <T id="posts_heading">Posts</T>
          </PageTitle>
          <Link
            href="/rss.xml"
            className="inline-flex items-center gap-2 px-2.5 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors border border-border rounded-sm hover:bg-rule-soft"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z" />
            </svg>
            <T id="rss_link">RSS</T>
          </Link>
        </div>
        <p className="font-serif text-lg text-ink-soft leading-relaxed font-light">
          <T id="posts_description">
            Notes on software, language, and the overlap between them.
          </T>
        </p>
      </header>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-baseline gap-2 py-2.5 border-y border-dotted border-border">
          <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground mr-1">
            <T id="filter_label">filter</T>
          </span>
          {allTags.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <Link
                key={tag}
                href={
                  isActive ? "/posts" : `/posts?tag=${encodeURIComponent(tag)}`
                }
                className={`font-mono text-[11px] px-2.5 py-0.5 rounded-sm border transition-colors ${
                  isActive
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-ink-soft border-border hover:border-ink-mute"
                }`}
              >
                #{tag.toLowerCase()}
              </Link>
            );
          })}
          {selectedTag && (
            <Link
              href="/posts"
              className="font-mono text-[11px] text-muted-foreground underline ml-auto"
            >
              <T id="clear_filter">clear</T>
            </Link>
          )}
        </div>
      )}

      {/* Posts — row layout */}
      <section>
        <div>
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={post.url}
              className="grid grid-cols-[1fr] sm:grid-cols-[100px_1fr_auto] gap-x-5 gap-y-1 py-4 border-b border-dotted border-border items-baseline no-underline text-inherit hover:bg-rule-soft/30 transition-colors -mx-2 px-2 rounded-sm"
            >
              <ViewTransition name={`date-${sanitize(post.url)}`}>
                <div className="font-mono text-[11px] text-muted-foreground tracking-wide">
                  <DateTime>{post.date}</DateTime>
                </div>
              </ViewTransition>
              <div>
                <ViewTransition name={`title-${sanitize(post.url)}`}>
                  <h3 className="font-serif text-[22px] font-medium text-foreground leading-tight mb-1">
                    {post.title}
                  </h3>
                </ViewTransition>
                <ViewTransition name={`description-${sanitize(post.url)}`}>
                  <p className="font-serif text-[14.5px] leading-relaxed text-ink-soft font-light">
                    {post.description}
                  </p>
                </ViewTransition>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {post.tags.map((tag) => (
                      <ViewTransition
                        key={tag}
                        name={`tag-${sanitize(post.url)}-${tag}`}
                      >
                        <span className="font-mono text-[11px] text-ink-soft px-2 py-0.5 border border-border rounded-sm bg-card">
                          #{tag.toLowerCase()}
                        </span>
                      </ViewTransition>
                    ))}
                  </div>
                )}
              </div>
              <div className="hidden sm:block font-mono text-[11px] text-muted-foreground text-right whitespace-nowrap">
                <ViewTransition name={`reading-time-${sanitize(post.url)}`}>
                  <span>{post.readingTime}</span>
                </ViewTransition>
              </div>
            </Link>
          ))}
        </div>
        {filteredPosts.length === 0 && selectedTag && (
          <p className="font-serif text-[15px] text-muted-foreground italic text-center py-10">
            <T id="no_posts_with_tag">
              No posts match tag{" "}
              <span className="font-medium">
                #<Var>{selectedTag.toLowerCase()}</Var>
              </span>
              .
            </T>
          </p>
        )}
      </section>

      {/* Archived Posts */}
      {archivedPosts.length > 0 && !selectedTag && (
        <section>
          <div className="mb-5">
            <h2 className="font-serif font-medium text-2xl tracking-tight text-foreground mb-2">
              <T id="archived_heading">Archived</T>
            </h2>
            <p className="font-serif text-ink-soft font-light">
              <T id="archived_description">
                Older posts that might be outdated but still have some value.
              </T>
            </p>
          </div>
          <div>
            {archivedPosts.map((post) => (
              <Link
                key={post.slug}
                href={post.url}
                className="grid grid-cols-[1fr] sm:grid-cols-[100px_1fr_auto] gap-x-5 gap-y-1 py-4 border-b border-dotted border-border items-baseline no-underline text-inherit hover:bg-rule-soft/30 transition-colors -mx-2 px-2 rounded-sm"
              >
                <div className="font-mono text-[11px] text-muted-foreground tracking-wide">
                  <DateTime>{post.date}</DateTime>
                </div>
                <div>
                  <h3 className="font-serif text-[22px] font-medium text-foreground leading-tight mb-1">
                    {post.title}
                  </h3>
                  <p className="font-serif text-[14.5px] leading-relaxed text-ink-soft font-light">
                    {post.description}
                  </p>
                </div>
                <div className="hidden sm:block font-mono text-[11px] text-muted-foreground text-right whitespace-nowrap">
                  {post.readingTime}
                  <br />
                  <span className="text-muted-foreground text-[11px]">
                    {post.tags.map((t) => `#${t}`).join(" ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
