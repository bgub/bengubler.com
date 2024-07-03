import { allContents } from "content-collections";
import { cache } from "react";

export type Content = (typeof allContents)[number];

async function _getContent({
  type = "posts",
  tags = [],
}: {
  type?: "posts" | "microblog";
  tags?: string[];
} = {}): Promise<Content[]> {
  return allContents
    .filter((post) => post.type === type)
    .filter(
      (post) => tags.length === 0 || tags.some((tag) => post.tags.includes(tag))
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export const getContent = cache(_getContent);

export type ContentOverview = (typeof externalPosts)[number];

async function _getContentOverviews({
  tags = [],
  type = "posts",
  limit = false,
  localOnly = false,
}: {
  tags?: string[];
  type?: "posts" | "microblog";
  limit?: false | number;
  localOnly?: boolean;
} = {}): Promise<ContentOverview[]> {
  const localPosts = await getContent({ tags, type });

  const allPosts = (
    localOnly ? localPosts : [...localPosts, ...externalPosts]
  ).sort((a, b) => b.date.getTime() - a.date.getTime());

  if (limit) {
    return allPosts.slice(0, limit);
  }

  return allPosts;
}

export const getContentOverviews = cache(_getContentOverviews);

export type Tag = {
  tag: string;
  count: number;
};

async function _getTags({
  type = "posts",
}: {
  type?: "posts" | "microblog";
}): Promise<Tag[]> {
  const posts = await getContentOverviews({
    type,
    localOnly: type === "microblog" ? true : false,
  });

  return posts.reduce((acc, post) => {
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
}

export const getTags = cache(_getTags);

const externalPosts = [
  {
    title: "Adding Deno support to the Eta template engine",
    description: "A guide to adding Deno support to the Eta template engine.",
    date: new Date("2020-09-14"),
    tags: ["typescript", "open-source"],

    url: "https://dev.to/nebrelbug/adding-deno-support-to-the-eta-template-engine-28n7",
    archived: false,
  },
  {
    title: "I built a JS template engine 3x faster than EJS",
    description: "An introduction to the Eta template engine.",
    date: new Date("2020-04-11"),
    tags: ["typescript", "open-source"],

    url: "https://dev.to/nebrelbug/i-built-a-js-template-engine-3x-faster-than-ejs-lj8",
    archived: false,
  },
  {
    title: "TensorFlow.js: An intro and analysis with use cases",
    description: "An overview and evaluation of TensorFlow.js.",
    date: new Date("2019-04-24"),
    tags: ["ml/ai"],
    url: "https://blog.logrocket.com/tensorflow-js-an-intro-and-analysis-with-use-cases-8e1f9a973183/",
    archived: true,
  },
  {
    title:
      "Introducing Squirrelly: a fast, lightweight, and simple JS template engine",
    description: "An introduction to the Squirrelly template engine.",
    date: new Date("2018-09-26"),
    tags: ["typescript", "open-source"],
    url: "https://hackernoon.com/introducing-squirrelly-a-fast-lightweight-and-simple-js-template-engine-70a873d765c9",
    archived: true,
  },
];
