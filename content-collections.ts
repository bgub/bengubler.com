import { capitalizationOptions } from "@/lib/capitalization";
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeMathJax from "rehype-mathjax";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { remark } from "remark";
import remarkCapitalizeHeadings from "remark-capitalize-headings";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import {
  rehypePostprocessPrettyCode,
  rehypePreprocessPrettyCode,
  rehypePrettyCodeOptions,
} from "@/components/mdx/rehype-pretty-code";
import { TOCNode, tocPlugin } from "@/components/mdx/remark-toc";

const tags = [
  "machine-learning",
  "language-learning",
  "typescript",
  "nextjs",
  "tailwind",
];

const posts = defineCollection({
  name: "posts",
  directory: "posts",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    description: z.string(),
    archived: z.string().optional(),
    // TODO add date & updated
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [
        [
          remarkCapitalizeHeadings,
          { replaceHeadingRegExp: capitalizationOptions },
        ],
        remarkGfm,
        remarkMath,
      ],
      rehypePlugins: [
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeMathJax,
        rehypePreprocessPrettyCode,
        [rehypePrettyCode, rehypePrettyCodeOptions],
        rehypePostprocessPrettyCode,
      ],
    });

    const tocRoot = (
      await remark()
        .use(remarkCapitalizeHeadings, {
          replaceHeadingRegExp: capitalizationOptions,
        })
        .use(tocPlugin)
        .process(document.content)
    ).data.toc as TOCNode;

    const toc = tocRoot;

    return {
      ...document,
      mdx,
      toc,
    };
  },
});

export default defineConfig({
  // @ts-ignore (it doesn't think the TOC is serializable)
  collections: [posts],
});
