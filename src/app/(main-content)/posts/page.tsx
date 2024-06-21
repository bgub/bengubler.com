import { getPosts } from "@/lib/get-posts";

import { CardGrid, PostCard } from "@/components/CardGrid";

export const metadata = {
  title: "Posts",
  description:
    "Some of my thoughts on programming, language learning, and more.",
};

export default function Posts() {
  const allPosts = getPosts();

  return (
    <>
      <h1 className="mt-8">{metadata.title}</h1>

      <CardGrid>
        {allPosts.map((post, i) => (
          <PostCard key={post.url} post={post} i={i} />
        ))}
      </CardGrid>
    </>
  );
}
