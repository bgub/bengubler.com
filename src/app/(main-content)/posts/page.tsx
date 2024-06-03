import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "next-view-transitions";

import { cn } from "@/lib/utils";
import { allPosts } from "content-collections";

export default function Posts() {
  return (
    <>
      <h1 className="text-4xl lg:text-5xl font-bold py-8">Posts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 mb-8">
        {allPosts.map((post, i) => (
          <Post key={post._meta.path} i={i} post={post} />
        ))}
      </div>
    </>
  );
}

export function getPostClassName(slug: string) {
  return "post-title-" + slug.replace(/[^\w\S]/gi, "").replace(/\s/g, "-");
}

const randomColors = [
  "from-red-200 to-purple-200 dark:from-red-800 dark:to-purple-800",
  "from-green-200 to-yellow-200 dark:from-green-800 dark:to-yellow-800",
  "from-blue-200 to-green-200 dark:from-blue-800 dark:to-green-800",
  "from-yellow-200 to-red-200 dark:from-yellow-800 dark:to-red-800",
  "from-pink-200 to-blue-200 dark:from-pink-800 dark:to-blue-800",
];

function Post({ post, i }: { post: (typeof allPosts)[number]; i: number }) {
  return (
    <Link href={`/posts/${post._meta.path}`}>
      <Card className="hover:shadow-lg h-full">
        <AspectRatio ratio={2 / 1}>
          <CardHeader
            className={cn(
              "h-full items-center justify-center p-6",
              "border-b bg-gradient-to-br dark:bg-opacity-50 rounded-t-xl rounded-b-none",
              randomColors[i % randomColors.length]
            )}
          >
            <CardTitle>
              <span
                style={{
                  viewTransitionName: getPostClassName(post._meta.path),
                }}
                className="text-2xl font-bold"
              >
                {post.title}
              </span>
            </CardTitle>
          </CardHeader>
        </AspectRatio>

        <CardContent className="grow p-6">
          <CardDescription>{post.title}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
