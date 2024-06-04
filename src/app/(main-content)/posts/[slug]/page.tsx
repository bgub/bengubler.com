import { MDXContent } from "@content-collections/mdx/react";
import { allPosts } from "content-collections";
import { notFound } from "next/navigation";

import { mdxComponents } from "@/components/mdx/mdx-components";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "next-view-transitions";
import { getPostClassName } from "../page";

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
            viewTransitionName: getPostClassName(post._meta.path),
          }}
        >
          {post.title}
        </span>
      </h1>
      <div className="flex flex-row min-w-0">
        <div className="prose dark:prose-invert min-w-0 max-w-none pt-4">
          <MDXContent code={post.mdx} components={mdxComponents} />
        </div>
        {/* Table of contents, only shown on xl+ screens */}
        <div className="hidden xl:flex items-center p-4 max-h-screen sticky top-0">
          <div className="h-full w-full min-w-64 flex flex-col p-4 border rounded-xl shadow bg-card"></div>
        </div>
      </div>
    </div>
  );
}
