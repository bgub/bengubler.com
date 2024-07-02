import { CardTag, TagButton } from "@/components/TagButton";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getContent, getTags } from "@/lib/get-content";
import {
  buildSearchParams,
  getTransitionStyle,
  modifySearchParams,
} from "@/lib/utils";
import { MDXContent } from "@content-collections/mdx/react";
import { RssIcon } from "lucide-react";
import { Link } from "next-view-transitions";
import { Fragment } from "react";

import type { Content } from "@/lib/get-content";

export const metadata = {
  title: "Microblog",
  description:
    "Short-form thoughts about programming, language learning, and more.",
};

export default function Posts({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params = buildSearchParams(searchParams);

  const tagsParam = params.getAll("tag");
  const pageParam = params.get("page");

  const pageNumber =
    pageParam && typeof pageParam === "string" ? parseInt(pageParam) : 1;
  const itemsPerPage = 5;

  const posts = getContent({ type: "microblog", tags: tagsParam });
  const tags = getTags({ type: "microblog" });

  const nonArchivedPosts = posts.filter((post) => !post.archived);

  const totalPages = Math.ceil(nonArchivedPosts.length / itemsPerPage);
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPagePosts = nonArchivedPosts.slice(startIndex, endIndex);

  const pageNumbersToShow = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  ).filter(
    (page) =>
      page === 1 || page === totalPages || Math.abs(page - pageNumber) <= 1
  );

  return (
    <>
      <h1 className="mt-8">
        {metadata.title}
        <Button size="icon" variant="ghost" className="ml-2" asChild>
          <Link
            href={`/rss.xml?${modifySearchParams(params, {
              type: "microblog",
            }).toString()}`}
          >
            <RssIcon className="inline-block" />
          </Link>
        </Button>
      </h1>

      <div className="flex flex-wrap items-start leading-8 gap-4 mb-12">
        {tags.map((tag) => (
          <TagButton key={tag.tag} name={tag.tag} count={tag.count} />
        ))}
      </div>

      {currentPagePosts.map((post) => (
        <PostPreview key={post.url} post={post} />
      ))}
      <hr className="my-10" />

      <Pagination className="not-prose">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={
                pageNumber > 1
                  ? `?${modifySearchParams(params, {
                      page: (pageNumber - 1).toString(),
                    })}`
                  : "#"
              }
              className={
                pageNumber <= 1 ? "pointer-events-none opacity-50" : ""
              }
              aria-disabled={pageNumber <= 1}
            />
          </PaginationItem>
          {pageNumbersToShow.map((page, i) => (
            <Fragment key={page}>
              {i > 0 && page - pageNumbersToShow[i - 1] > 1 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    className="pointer-events-none"
                    aria-disabled={true}
                  >
                    ...
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href={`?${modifySearchParams(params, {
                    page: page.toString(),
                  })}`}
                  isActive={page === pageNumber}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            </Fragment>
          ))}
          <PaginationItem>
            <PaginationNext
              href={
                pageNumber < totalPages
                  ? `?${modifySearchParams(params, {
                      page: (pageNumber + 1).toString(),
                    })}`
                  : "#"
              }
              className={
                pageNumber >= totalPages ? "pointer-events-none opacity-50" : ""
              }
              aria-disabled={pageNumber >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}

function PostPreview({ post }: { post: Content }) {
  return (
    <>
      <hr className="mb-4" />

      <p className="text-sm text-muted-foreground">
        <span style={getTransitionStyle(post.url, "date-")}>
          {post.date.toLocaleDateString()}
        </span>
      </p>

      <Link href={post.url}>
        <p className="text-xl font-semibold mt-2 mb-2">
          <span style={getTransitionStyle(post.url, "title-")}>
            {post.title}
          </span>
        </p>
      </Link>

      <div className="align-bottom flex flex-row flex-wrap gap-2">
        {post.tags.map((tag) => (
          <CardTag key={tag} name={tag} />
        ))}
      </div>
      <MDXContent code={post.mdx} components={mdxComponents} />
    </>
  );
}
