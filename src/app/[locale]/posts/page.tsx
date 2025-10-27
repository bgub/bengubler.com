import { allPosts } from "content-collections";
import { T, Var } from "gt-next";
import { getGT, getLocale } from "gt-next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { getPostColors } from "@/lib/colors";

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

  // Filter to current locale
  const localePosts = allPosts.filter((p) => p.locale === locale);

  // Get all posts sorted by date
  const sortedPosts = localePosts.sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  // Add consistent colors based on date-determined index
  const postsWithColors = sortedPosts.map((post) => {
    const colors = getPostColors(post.slug);
    return {
      ...post,
      color: colors.bg,
      borderColor: colors.border,
    };
  });

  // Get all unique tags sorted by frequency
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
    // Sort by frequency (descending), then alphabetically for ties
    const countDiff = tagCounts[b] - tagCounts[a];
    return countDiff !== 0 ? countDiff : a.localeCompare(b);
  });

  // Filter posts by tag and archived status
  const filteredPosts = postsWithColors.filter((post) => {
    if (selectedTag && !post.tags.includes(selectedTag)) {
      return false;
    }
    return !post.archived;
  });

  const archivedPosts = postsWithColors.filter((post) => post.archived);

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            <T id="posts_heading">Posts</T>
          </h1>
          <Link
            href="/rss.xml"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md hover:bg-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z" />
            </svg>
            <T id="rss_link">RSS</T>
          </Link>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          <T id="posts_description">
            Thoughts on web development, AI, and building things that matter.
          </T>
        </p>
      </header>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={
                selectedTag === tag
                  ? "/posts"
                  : `/posts?tag=${encodeURIComponent(tag)}`
              }
              className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedTag === tag
                  ? "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border"
              }`}
            >
              #{tag.toLowerCase()} ({tagCounts[tag]})
            </Link>
          ))}
        </div>
      )}

      {/* Regular Posts */}
      <section>
        <div className="@container">
          <div className="grid gap-6 @md:grid-cols-2 @2xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
        {filteredPosts.length === 0 && selectedTag && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              <T id="no_posts_with_tag">
                No posts found with tag{" "}
                <span className="font-medium">
                  #<Var>{selectedTag.toLowerCase()}</Var>
                </span>
                .
              </T>
            </p>
          </div>
        )}
      </section>

      {/* Archived Posts */}
      {archivedPosts.length > 0 && !selectedTag && (
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
              <T id="archived_heading">Archived</T>
            </h2>
            <p className="text-muted-foreground">
              <T id="archived_description">
                Older posts that might be outdated but still have some value.
              </T>
            </p>
          </div>
          <div className="@container">
            <div className="grid gap-6 @md:grid-cols-2 @2xl:grid-cols-3">
              {archivedPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
