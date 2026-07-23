import { dataResource, readData } from "@bgub/fig";
import { createFileRoute } from "@tanstack/solid-router";
import { getGT, T, Var } from "gt-fig-tanstack-start";
import { Link } from "@/components/link";
import { PageTitle } from "@/components/page-title";
import { PostRow } from "@/components/post-row";
import { getLocalizedPath, type Locale, resolveLocale } from "@/lib/locales";
import { getPageMetadata } from "@/lib/metadata";
import { getPostsForLocale } from "@/lib/post-data";

const postsResource = dataResource({
  key: (locale: Locale) => ["posts", locale],
  load: async (locale: Locale) => ({
    posts: await getPostsForLocale({ data: { locale } }),
  }),
});

export const Route = createFileRoute("/{-$locale}/posts/")({
  validateSearch: (search: Record<string, unknown>) => ({
    tag: typeof search.tag === "string" ? search.tag : undefined,
  }),
  loader: async ({ context }) => {
    const locale = resolveLocale();
    await context.data.ensureData(postsResource, locale);
  },
  head: async () => {
    const gt = await getGT();
    return {
      meta: getPageMetadata({
        title: gt("Posts - Ben Gubler"),
        description: gt(
          "Thoughts on web development, AI, and building things that matter.",
        ),
      }),
    };
  },
  component: PostsPage,
});

function PostsPage() {
  const { tag: selectedTag } = Route.useSearch();
  const { posts } = readData(postsResource, resolveLocale());

  const sortedPosts = posts.toSorted(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  const tagCounts: Record<string, number> = {};
  for (const tag of posts.flatMap((post) => post.tags)) {
    tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
  }

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
    <div class="space-y-10">
      <header class="space-y-3">
        <div class="flex items-center justify-between">
          <PageTitle>
            <T>Posts</T>
          </PageTitle>
          <Link
            href={getLocalizedPath("/rss.xml", resolveLocale())}
            class="inline-flex items-center gap-2 px-2.5 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors border border-border rounded-sm hover:bg-rule-soft"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="icon-[lucide--rss] size-3.5" aria-hidden="true" />
            <T>RSS</T>
          </Link>
        </div>
        <p class="font-serif text-lg text-ink-soft leading-relaxed font-light">
          <T>Notes on software, language, and the overlap between them.</T>
        </p>
      </header>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div class="flex flex-wrap items-baseline gap-2 py-2.5 border-y border-dotted border-border">
          <span class="font-mono text-[11px] tracking-widest uppercase text-muted-foreground mr-1">
            <T>filter</T>
          </span>
          {allTags.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <Link
                key={tag}
                href={
                  isActive ? "/posts" : `/posts?tag=${encodeURIComponent(tag)}`
                }
                class={`font-mono text-[11px] px-2.5 py-0.5 rounded-sm border transition-colors ${
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
              class="font-mono text-[11px] text-muted-foreground underline ml-auto"
            >
              <T>clear</T>
            </Link>
          )}
        </div>
      )}

      {/* Posts - row layout */}
      <section>
        <div>
          {filteredPosts.map((post) => (
            <PostRow key={post.slug} post={post} variant="full" />
          ))}
        </div>
        {filteredPosts.length === 0 && selectedTag && (
          <p class="font-serif text-[15px] text-muted-foreground italic text-center py-10">
            <T>
              No posts match tag{" "}
              <span class="font-medium">
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
          <div class="mb-5">
            <h2 class="font-serif font-medium text-2xl tracking-tight text-foreground mb-2">
              <T>Archived</T>
            </h2>
            <p class="font-serif text-ink-soft font-light">
              <T>
                Older posts that might be outdated but still have some value.
              </T>
            </p>
          </div>
          <div>
            {archivedPosts.map((post) => (
              <PostRow key={post.slug} post={post} variant="archived" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
