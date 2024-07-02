import { allContents } from "content-collections";

type Post = (typeof allContents)[number];

export function getContent({
  type = "post",
  tags = [],
}: {
  type?: "post" | "microblog";
  tags?: string[];
} = {}): Post[] {
  return allContents
    .filter((post) => post.type === type)
    .filter(
      (post) => tags.length === 0 || tags.some((tag) => post.tags.includes(tag))
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export type ContentOverview = (typeof externalPosts)[number];

export function getContentOverviews({
  tags = [],
  type = "post",
  limit = false,
  localOnly = false,
}: {
  tags?: string[];
  type?: "post" | "microblog";
  limit?: false | number;
  localOnly?: boolean;
} = {}): ContentOverview[] {
  const localPosts = getContent({ tags, type });

  const allPosts = (
    localOnly ? localPosts : [...localPosts, ...externalPosts]
  ).sort((a, b) => b.date.getTime() - a.date.getTime());

  if (limit) {
    return allPosts.slice(0, limit);
  }

  return allPosts;
}

export type Tag = {
  tag: string;
  count: number;
};

export function getTags({
  type = "post",
}: {
  type?: "post" | "microblog";
}): Tag[] {
  const posts = getContentOverviews({ type });

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
