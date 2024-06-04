import { MDXContent } from "@content-collections/mdx/react";
import { allPosts } from "content-collections";
import { notFound } from "next/navigation";

import { mdxComponents } from "@/components/mdx/mdx-components";
import { TOCNode } from "@/components/mdx/remark-toc";
import { TOCLink } from "@/components/mdx/TOCLink";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "next-view-transitions";
import { getTransitionName } from "../page";

export default function Post({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const post = allPosts.find((post) => post._meta.path === slug);

  if (!post) return notFound();

  return (
    <div className="min-w-0">
      <Breadcrumb>
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
      <h1 className="text-4xl lg:text-5xl font-bold py-8">
        <span
          style={{
            viewTransitionName: getTransitionName(
              post._meta.path,
              "post-title-"
            ),
          }}
        >
          {post.title}
        </span>
      </h1>
      <p className="text-lg text-muted-foreground pb-4">
        <span
          style={{
            viewTransitionName: getTransitionName(
              post._meta.path,
              "post-description-"
            ),
          }}
        >
          {post.description}
        </span>
      </p>
      <div className="flex flex-row min-w-0">
        <div className="prose dark:prose-invert min-w-0 max-w-none pt-4 pr-4">
          <MDXContent code={post.mdx} components={mdxComponents} />
        </div>
        {/* Table of contents, only shown on lg+ screens */}
        <div className="hidden lg:flex flex-col min-w-64 max-h-screen sticky top-0 p-4">
          <div className="w-full border-l">
            <TOC tree={post.toc} />
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
