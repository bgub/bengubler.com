import { getPosts } from "@/lib/get-posts";

import { CardGrid, PostCard } from "@/components/CardGrid";

export default function Posts() {
  const allPosts = getPosts();

  return (
    <>
      <h1 className="mt-8">Posts</h1>

      <CardGrid>
        {allPosts.map((post, i) => (
          <PostCard key={post.url} post={post} i={i} />
        ))}
      </CardGrid>
    </>
  );
}
