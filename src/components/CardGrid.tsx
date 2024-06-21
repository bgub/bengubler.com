import { cn, getTransitionStyle } from "@/lib/utils";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostOverview } from "@/lib/get-posts";
import { Link } from "next-view-transitions";
import Image from "next/image";

type Item = {
  title: string;
  description: string;
  image: string;
  href: string;
};

export function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 @[500px]:grid-cols-2 @[800px]:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}

function CardBase({
  href,
  header,
  content,
}: {
  href: string;
  header: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : "_self"}
      className="not-prose"
    >
      <Card className="hover:shadow-lg h-full border-2 border-black dark:border-gray-500">
        <CardHeader className="p-0">
          <AspectRatio ratio={16 / 9}>{header}</AspectRatio>
        </CardHeader>
        <CardContent className="p-4">{content}</CardContent>
      </Card>
    </Link>
  );
}

export function ProjectCard({ project }: { project: Item }) {
  return (
    <CardBase
      href={project.href}
      header={
        <>
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover rounded-t-lg border-b border-black dark:border-gray-500"
          />
          <div className="absolute bottom-2 left-2 right-2 px-2 rounded-sm text-sm opacity-70 bg-black text-white truncate">
            {project.href}
          </div>
        </>
      }
      content={
        <>
          <CardTitle className="mb-4">{project.title}</CardTitle>
          <p>{project.description}</p>
        </>
      }
    />
  );
}

export function PostCard({ post, i }: { post: PostOverview; i: number }) {
  return (
    <CardBase
      href={post.url}
      header={
        <div
          className={cn(
            "flex flex-col justify-between h-full w-full p-4 rounded-t-lg @container",
            "border-b border-black dark:border-gray-500",
            "bg-gradient-to-br dark:bg-opacity-50",
            randomColors[i % randomColors.length]
          )}
        >
          <p className="text-sm @[250px]:text-lg @[320px]:text-xl @[400px]:text-2xl font-semibold max-h-full">
            <span style={getTransitionStyle(post.url, "post-title-")}>
              {post.title}
            </span>
            {!post.url.startsWith("/posts/") && " ↗"}
          </p>
          <p className="text-sm @[300px]:text-lg @[340px]:text-xl @[400px]:text-2xl text-muted-foreground">
            <span>{post.date}</span>
          </p>
        </div>
      }
      content={
        <p className="text-primary">
          <span style={getTransitionStyle(post.url, "post-description-")}>
            {post.description}
          </span>
        </p>
      }
    />
  );
}

const randomColors = [
  "from-red-200 to-purple-200 dark:from-red-800 dark:to-purple-800",
  "from-green-200 to-yellow-200 dark:from-green-800 dark:to-yellow-800",
  "from-blue-200 to-green-200 dark:from-blue-800 dark:to-green-800",
  "from-yellow-200 to-red-200 dark:from-yellow-800 dark:to-red-800",
  "from-pink-200 to-blue-200 dark:from-pink-800 dark:to-blue-800",
];
