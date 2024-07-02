import { getContentOverviews, getTags } from "@/lib/get-content";

import { CardGrid, PostCard } from "@/components/CardGrid";
import { TagButton } from "@/components/TagButton";
import { buildSearchParams } from "@/lib/utils";

export const metadata = {
  title: "Posts",
  description:
    "Some of my thoughts on programming, language learning, and more.",
};

export default function Posts({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params = buildSearchParams(searchParams);

  const activeTags = params.getAll("tag");

  const posts = getContentOverviews({
    tags: activeTags,
  });

  const tags = getTags({});

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
