import type { allPosts } from "content-collections";
import { DateTime, T } from "gt-next/client";
import type { Route } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { getPostColors } from "@/lib/post-colors";

type Post = (typeof allPosts)[0] & {
  color?: string;
  borderColor?: string;
};

interface PostCardProps {
  post: Post;
}

function sanitize(slug: string) {
  return slug.replace(/[^\w\s\-/]/gi, "").replace(/[\s/]/g, "-");
}

export function PostCard({ post }: PostCardProps) {
  const fallbackColors = getPostColors(post.title);
  const bgColor = post.color || fallbackColors.bg;
  const borderColor = post.borderColor || fallbackColors.border;
  const base = sanitize(post.url);

  return (
    <Link href={post.url as Route}>
      <ViewTransition name={`post-card-${base}`}>
        <div
          className={`${bgColor} ${borderColor} border rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer group h-full p-6 space-y-4`}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs text-muted-foreground font-mono">
              <ViewTransition name={`date-${base}`}>
                <time dateTime={post.date.toISOString()}>
                  <DateTime>{post.date}</DateTime>
                </time>
              </ViewTransition>
              <ViewTransition name={`reading-time-${base}`}>
                <span>{post.readingTime || <T>5 min read</T>}</span>
              </ViewTransition>
            </div>
            <ViewTransition name={`title-${base}`}>
              <h3 className="text-lg font-medium leading-tight group-hover:text-foreground/90 transition-colors break-words">
                {post.title}
              </h3>
            </ViewTransition>
          </div>
          <div className="space-y-4">
            <ViewTransition name={`description-${base}`}>
              <p className="text-sm leading-relaxed break-words text-muted-foreground">
                {post.description}
              </p>
            </ViewTransition>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <ViewTransition key={tag} name={`tag-${base}-${tag}`}>
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-0.5 bg-background/60 hover:bg-background/80 transition-colors"
                    >
                      #{tag.toLowerCase()}
                    </Badge>
                  </ViewTransition>
                ))}
              </div>
            )}
          </div>
        </div>
      </ViewTransition>
    </Link>
  );
}
