import { getPosts } from "@/lib/get-posts";

import { CardGrid, PostCard } from "@/components/CardGrid";
import { TagButton } from "@/components/TagButton";

export const metadata = {
  title: "Posts",
  description:
    "Some of my thoughts on programming, language learning, and more.",
};

type Tag = {
  tag: string;
  count: number;
};

export default function Posts({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const activeTags = searchParams.tag
    ? typeof searchParams.tag === "string"
      ? [searchParams.tag]
      : searchParams.tag
    : [];

  const allPosts = getPosts();

  const tags: Tag[] = allPosts.reduce((acc, post) => {
    post.tags.forEach((tag) => {
      const existingTag = acc.find((t) => t.tag === tag);

      if (existingTag) {
        existingTag.count++;
      } else {
        acc.push({ tag, count: 1 });
      }
    });

    return acc;
  }, [] as Tag[]);

  const posts = allPosts.filter((post) => {
    if (activeTags.length === 0) return true;

    return activeTags.some((tag) => post.tags.includes(tag));
  });

  const archivedPosts = posts.filter((post) => post.archived);
  const nonArchivedPosts = posts.filter((post) => !post.archived);

  return (
    <>
      <h1 className="mt-8">{metadata.title}</h1>

      <div className="flex flex-wrap items-start leading-8 gap-4 mb-12">
        {tags.map((tag) => (
          <TagButton key={tag.tag} name={tag.tag} count={tag.count} />
        ))}
      </div>

      <CardGrid>
        {nonArchivedPosts.map((post, i) => (
          <PostCard key={post.url} post={post} i={i} />
        ))}
      </CardGrid>

      {archivedPosts.length > 0 && (
        <>
          <h2>Archived Posts</h2>
          <CardGrid>
            {archivedPosts.map((post, i) => (
              <PostCard key={post.url} post={post} i={i} />
            ))}
          </CardGrid>
        </>
      )}
    </>
  );
}
