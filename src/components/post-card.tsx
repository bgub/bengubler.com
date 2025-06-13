import { Badge } from "@/components/ui/badge";
import { getPostColors } from "@/lib/post-colors";
import { allPosts } from "content-collections";
import { Link } from "next-view-transitions";

type Post = (typeof allPosts)[0] & {
  color?: string;
  borderColor?: string;
};

interface PostCardProps {
  post: Post;
}

// View transition style function (same as post page)
function getTransitionStyle(slug: string, prefix: string = "") {
  const transitionName =
    prefix + slug.replace(/[^\w\s\-\/]/gi, "").replace(/[\s\/]/g, "-");
  return {
    viewTransitionName: transitionName,
  };
}

export function PostCard({ post }: PostCardProps) {
  // Format date to readable string
  const formattedDate = post.date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Use passed colors or fallback to generated colors
  const fallbackColors = getPostColors(post.title);
  const bgColor = post.color || fallbackColors.bg;
  const borderColor = post.borderColor || fallbackColors.border;

  return (
    <Link href={post.url}>
      <div
        className={`${bgColor} ${borderColor} border rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer group h-full p-6 space-y-4`}
        style={getTransitionStyle(post.url, "post-card-")}
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs text-muted-foreground font-mono">
            <time
              dateTime={post.date.toISOString()}
              style={getTransitionStyle(post.url, "date-")}
            >
              {formattedDate}
            </time>
            <span style={getTransitionStyle(post.url, "reading-time-")}>
              {(post as any).readingTime || "5 min read"}
            </span>
          </div>
          <h3
            className="text-lg font-medium leading-tight group-hover:text-foreground/90 transition-colors break-words"
            style={getTransitionStyle(post.url, "title-")}
          >
            {post.title}
          </h3>
        </div>
        <div className="space-y-4">
          <p
            className="text-sm leading-relaxed break-words text-muted-foreground"
            style={getTransitionStyle(post.url, "description-")}
          >
            {post.description}
          </p>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs px-2 py-0.5 bg-background/60 hover:bg-background/80 transition-colors"
                  style={getTransitionStyle(`${post.url}-${tag}`, `tag-`)}
                >
                  #{tag.toLowerCase()}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
