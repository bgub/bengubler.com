import { allPosts as localPosts } from "content-collections";

type Post = (typeof localPosts)[number];

export type PostOverview = Omit<
  Post,
  "mdx" | "toc" | "_meta" | "content" | "date"
> & {
  url: string;
  date: string;
};

export function getPosts(limit: false | number = false): PostOverview[] {
  const processedLocalPosts = localPosts.map(
    ({ title, description, date, _meta: { path } }) => ({
      title,
      description,
      date,
      url: `/posts/${path}`,
    })
  );

  const allPosts = [...externalPosts, ...processedLocalPosts]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((post) => ({
      ...post,
      date: post.date.toLocaleDateString(),
    }));

  if (limit !== false) {
    return allPosts.slice(0, limit);
  }

  return allPosts;
}

const externalPosts = [
  {
    title: "Adding Deno support to the Eta template engine",
    description: "A guide to adding Deno support to the Eta template engine.",
    date: new Date("2020-09-14"),
    url: "https://dev.to/nebrelbug/adding-deno-support-to-the-eta-template-engine-28n7",
  },
  {
    title: "I built a JS template engine 3x faster than EJS",
    description: "An introduction to the Eta template engine.",
    date: new Date("2020-04-11"),
    url: "https://dev.to/nebrelbug/i-built-a-js-template-engine-3x-faster-than-ejs-lj8",
  },
  {
    title: "TensorFlow.js: An intro and analysis with use cases",
    description: "An overview and evaluation of TensorFlow.js.",
    date: new Date("2019-04-24"),
    url: "https://blog.logrocket.com/tensorflow-js-an-intro-and-analysis-with-use-cases-8e1f9a973183/",
  },
  {
    title:
      "Introducing Squirrelly: a fast, lightweight, and simple JS template engine",
    description: "An introduction to the Squirrelly template engine.",
    date: new Date("2018-09-26"),
    url: "https://hackernoon.com/introducing-squirrelly-a-fast-lightweight-and-simple-js-template-engine-70a873d765c9",
  },
];
