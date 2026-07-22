import { DateTime } from "gt-tanstack-start";
import { Link } from "@/components/link";
import type { PostSummary } from "@/lib/post-data";
import { getPostTransitionName } from "@/lib/view-transitions";

type PostRowVariant = "archived" | "compact" | "full";

interface PostRowProps {
  post: PostSummary;
  variant: PostRowVariant;
}

export function PostRow({ post, variant }: PostRowProps) {
  const archived = variant === "archived";
  const compact = variant === "compact";
  const date = (
    <div
      className="font-mono text-[11px] text-muted-foreground tracking-wide"
      style={
        archived
          ? undefined
          : { viewTransitionName: getPostTransitionName("date", post.url) }
      }
    >
      <DateTime options={{ timeZone: "UTC" }}>{post.date}</DateTime>
    </div>
  );
  const title = compact ? (
    <div
      className="font-serif text-xl font-medium text-foreground leading-tight mb-1"
      style={{
        viewTransitionName: getPostTransitionName("title", post.url),
      }}
    >
      {post.title}
    </div>
  ) : (
    <h3
      className="font-serif text-[22px] font-medium text-foreground leading-tight mb-1"
      style={
        archived
          ? undefined
          : { viewTransitionName: getPostTransitionName("title", post.url) }
      }
    >
      {post.title}
    </h3>
  );
  const description = compact ? (
    <div
      className="font-serif text-sm leading-relaxed text-ink-soft font-light"
      style={{
        viewTransitionName: getPostTransitionName("description", post.url),
      }}
    >
      {post.description}
    </div>
  ) : (
    <p
      className="font-serif text-[14.5px] leading-relaxed text-ink-soft font-light"
      style={
        archived
          ? undefined
          : {
              viewTransitionName: getPostTransitionName(
                "description",
                post.url,
              ),
            }
      }
    >
      {post.description}
    </p>
  );

  return (
    <Link
      href={post.url}
      className="grid grid-cols-1 sm:grid-cols-[100px_1fr_auto] gap-x-5 gap-y-1 py-4 border-b border-dotted border-border items-baseline no-underline text-inherit hover:bg-rule-soft/30 transition-colors -mx-2 px-2 rounded-sm"
    >
      {date}
      <div>
        {title}
        {description}
        {variant === "full" && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
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
      </div>
      <div className="hidden sm:block font-mono text-[11px] text-muted-foreground text-right whitespace-nowrap">
        {archived ? (
          <>
            {post.readingTime}
            <br />
            <span className="text-muted-foreground text-[11px]">
              {post.tags.map((tag) => `#${tag}`).join(" ")}
            </span>
          </>
        ) : (
          <span
            style={{
              viewTransitionName: getPostTransitionName(
                "reading-time",
                post.url,
              ),
            }}
          >
            {post.readingTime}
          </span>
        )}
      </div>
    </Link>
  );
}
