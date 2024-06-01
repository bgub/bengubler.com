import { MDXContent } from "@content-collections/mdx/react";
import { allPosts } from "content-collections";
import { notFound } from "next/navigation";

export default function Post({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const post = allPosts.find((post) => post._meta.path === slug);

  if (!post) return notFound();

  return (
    <>
      <h1 className="text-4xl lg:text-5xl font-bold py-8">{post.title}</h1>
      <div className="prose dark:prose-invert max-w-full">
        <MDXContent code={post.mdx} />
      </div>
    </>
  );
}
