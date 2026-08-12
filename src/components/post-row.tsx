import { DateTime } from "gt-fig-tanstack-start";
import { Link } from "@/components/link";
import { PostTag } from "@/components/post-tag";
import { PostViewTransition } from "@/components/post-view-transition";
import type { PostSummary } from "@/lib/post-data";

interface PostRowProps {
  post: PostSummary;
  showTags?: boolean;
}

export function PostRow({ post, showTags = true }: PostRowProps) {
  const archived = post.archived;
  const date = (
    <PostViewTransition disabled={archived} kind="date" postUrl={post.url}>
      <span class="font-mono text-[11px] text-muted-foreground tracking-wide">
        <DateTime options={{ timeZone: "UTC" }}>{post.date}</DateTime>
      </span>
    </PostViewTransition>
  );
  const title = (
    <PostViewTransition disabled={archived} kind="title" postUrl={post.url}>
      <h3 class="font-serif text-xl font-medium text-foreground leading-tight">
        {post.title}
      </h3>
    </PostViewTransition>
  );
  const description = (
    <PostViewTransition
      disabled={archived}
      kind="description"
      postUrl={post.url}
    >
      <p class="font-serif text-[14.5px] leading-relaxed text-ink-soft font-light">
        {post.description}
      </p>
    </PostViewTransition>
  );
  const readingTime = (
    <PostViewTransition
      disabled={archived}
      kind="reading-time"
      postUrl={post.url}
    >
      <span>{post.readingTime}</span>
    </PostViewTransition>
  );
  const tags = showTags && post.tags.length > 0 && (
    <div class="flex shrink-0 flex-wrap gap-1 sm:max-w-72 sm:justify-end">
      {post.tags.map((tag) => (
        <PostViewTransition
          key={tag}
          disabled={archived}
          kind="tag"
          postUrl={post.url}
          suffix={tag}
        >
          <PostTag tag={tag} />
        </PostViewTransition>
      ))}
    </div>
  );

  return (
    <Link
      href={post.url}
      class="block border-b border-dotted border-border py-3 no-underline text-inherit hover:bg-rule-soft/30 transition-colors -mx-2 px-2 rounded-sm"
    >
      <div class="flex flex-col-reverse gap-y-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-5">
        {title}
        <div class="flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
          {date}
          <span aria-hidden="true">·</span>
          {readingTime}
        </div>
      </div>
      <div class="mt-0.5 flex flex-col gap-y-1 sm:flex-row sm:items-start sm:justify-between sm:gap-x-6">
        {description}
        {tags}
      </div>
    </Link>
  );
}
