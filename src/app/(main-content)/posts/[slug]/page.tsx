import { MDXContent } from "@content-collections/mdx/react";
import { allPosts } from "content-collections";
import { notFound } from "next/navigation";

import { Comments } from "@/components/Comments";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { TOCNode } from "@/components/mdx/remark-toc";
import { TOCLink } from "@/components/mdx/TOCLink";
import { Social } from "@/components/Social";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "next-view-transitions";

import { InlineTagButton } from "@/components/TagButton";
import { baseUrl } from "@/lib/config";
import { cn, getTransitionStyle } from "@/lib/utils";
import { ResolvingMetadata } from "next";

export async function generateMetadata(
  {
    params: { slug },
  }: {
    params: {
      slug: string;
    };
  },
  parent: ResolvingMetadata
) {
  // Find the post for the current page.
  const post = allPosts.find((post) => post._meta.path === slug);

  if (!post) notFound();

  const { title, description } = post;

  const previousOG = (await parent).openGraph;
  const previousTwitter = (await parent).twitter;

  return {
    title: title,
    description: description || "Post by Ben Gubler",
    openGraph: {
      ...previousOG,
      title: title,
      description: description,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(
            title
          )}&description=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630,
          alt: "",
        },
      ],
    },
    twitter: {
      ...previousTwitter,
      title: title,
      description: description,
      card: "summary_large_image",
    },
  };
}

export function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post._meta.path,
  }));
}

export default function Post({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const post = allPosts.find((post) => post._meta.path === slug);

  if (!post) return notFound();

  return (
    <div className="min-w-0">
      <Breadcrumb className="not-prose">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/posts">Posts</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* TODO add updated time */}
      <p className="text-muted-foreground mt-4 not-prose">
        Published{" "}
        <span
          style={getTransitionStyle(`/posts/${post._meta.path}`, "post-date-")}
        >
          {post.date.toLocaleDateString()}
        </span>
      </p>
      <h1 className="mt-4">
        <span
          style={getTransitionStyle(`/posts/${post._meta.path}`, "post-title-")}
        >
          {post.title}
        </span>
      </h1>
      <p className="text-lg text-muted-foreground">
        <span
          style={getTransitionStyle(
            `/posts/${post._meta.path}`,
            "post-description-"
          )}
        >
          {post.description}
        </span>
      </p>
      {post.tags.length > 0 && (
        <div className="flex flex-row flex-wrap mt-4 gap-2">
          {post.tags.map((tag) => (
            <InlineTagButton key={tag} name={tag} />
          ))}
        </div>
      )}
      <div className="flex flex-row min-w-0 pt-4">
        <div className="min-w-0">
          <div className={cn("min-w-0 max-w-none pt-4 pr-4 *:first:mt-0")}>
            <MDXContent code={post.mdx} components={mdxComponents} />
            <p className="italic">
              If you liked this article, don't forget to share it and follow me
              at <a href="https://x.com/nebrelbug">@nebrelbug</a> on X!
            </p>
          </div>
          <Social
            title={post.title + "\n--\n" + post.description}
            className="my-8"
          />
          <Comments />
        </div>

        {/* Table of contents, only shown on xl+ screens */}
        <div className="hidden xl:flex flex-col min-w-64 max-h-screen sticky top-0 p-4 not-prose">
          <div className="w-full border-l">
            <TOC tree={JSON.parse(post.toc)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TOC({ tree }: { tree: TOCNode }) {
  return (
    <ul className="list-outside ml-6">
      {tree.children.map((node) => (
        <li key={node.id}>
          <TOCLink node={node} />
          {node.children.length > 0 && <TOC tree={node} />}
        </li>
      ))}
    </ul>
  );
}
