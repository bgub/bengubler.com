import { capitalizationOptions } from "@/lib/capitalization";
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeMathJax from "rehype-mathjax";
// TODO: rehype Katex
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkCapitalizeHeadings from "remark-capitalize-headings";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import {
  rehypePostprocessPrettyCode,
  rehypePreprocessPrettyCode,
  rehypePrettyCodeOptions,
} from "@/components/mdx/rehype-pretty-code";
import { getHeadings } from "@/components/mdx/remark-toc";

const posts = defineCollection({
  name: "posts",
  directory: "posts",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    description: z.string(),
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

    const tocMarkdown = await getHeadings(document.content);

    const tocMdx = await compileMDX(context, {
      content: tocMarkdown,
      _meta: document._meta,
    });

    return {
      ...document,
      mdx,
      tocMdx,
    };
  },
});

export default defineConfig({
  collections: [posts],
});
