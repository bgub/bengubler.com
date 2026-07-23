import { DateTime } from "gt-fig-tanstack-start";
import { Link } from "@/components/link";
import { PostViewTransition } from "@/components/post-view-transition";
import type { PostSummary } from "@/lib/post-data";

type PostRowVariant = "archived" | "compact" | "full";

interface PostRowProps {
  post: PostSummary;
  variant: PostRowVariant;
}

export function PostRow({ post, variant }: PostRowProps) {
  const archived = variant === "archived";
  const compact = variant === "compact";
  const dateContent = (
    <div class="font-mono text-[11px] text-muted-foreground tracking-wide">
      <DateTime options={{ timeZone: "UTC" }}>{post.date}</DateTime>
    </div>
  );
  const date = archived ? (
    dateContent
  ) : (
    <PostViewTransition kind="date" postUrl={post.url}>
      {dateContent}
    </PostViewTransition>
  );
  const titleContent = compact ? (
    <div class="font-serif text-xl font-medium text-foreground leading-tight mb-1">
      {post.title}
    </div>
  ) : (
    <h3 class="font-serif text-[22px] font-medium text-foreground leading-tight mb-1">
      {post.title}
    </h3>
  );
  const title = archived ? (
    titleContent
  ) : (
    <PostViewTransition kind="title" postUrl={post.url}>
      {titleContent}
    </PostViewTransition>
  );
  const descriptionContent = compact ? (
    <div class="font-serif text-sm leading-relaxed text-ink-soft font-light">
      {post.description}
    </div>
  ) : (
    <p class="font-serif text-[14.5px] leading-relaxed text-ink-soft font-light">
      {post.description}
    </p>
  );
  const description = archived ? (
    descriptionContent
  ) : (
    <PostViewTransition kind="description" postUrl={post.url}>
      {descriptionContent}
    </PostViewTransition>
  );

  return (
    <Link
      href={post.url}
      class="grid grid-cols-1 sm:grid-cols-[100px_1fr_auto] gap-x-5 gap-y-1 py-4 border-b border-dotted border-border items-baseline no-underline text-inherit hover:bg-rule-soft/30 transition-colors -mx-2 px-2 rounded-sm"
    >
      {date}
      <div>
        {title}
        {description}
        {variant === "full" && post.tags.length > 0 && (
          <div class="flex flex-wrap gap-1.5 mt-2">
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
      </div>
      <div class="hidden sm:block font-mono text-[11px] text-muted-foreground text-right whitespace-nowrap">
        {archived ? (
          <>
            {post.readingTime}
            <br />
            <span class="text-muted-foreground text-[11px]">
              {post.tags.map((tag) => `#${tag}`).join(" ")}
            </span>
          </>
        ) : (
          <PostViewTransition kind="reading-time" postUrl={post.url}>
            <span>{post.readingTime}</span>
          </PostViewTransition>
        )}
      </div>
    </Link>
  );
}
