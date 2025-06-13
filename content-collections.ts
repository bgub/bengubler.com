import { capitalizationOptions } from "@/lib/capitalization";
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { remark } from "remark";
import remarkCapitalizeHeadings from "remark-capitalize-headings";
import remarkGfm from "remark-gfm";
import { z } from "zod";

import {
  rehypePostprocessPrettyCode,
  rehypePreprocessPrettyCode,
  rehypePrettyCodeOptions,
} from "./src/components/mdx/rehype-pretty-code";
import { TOCNode, tocPlugin } from "./src/components/mdx/remark-toc";

const posts = defineCollection({
  name: "posts",
  directory: "content",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().pipe(z.coerce.date()),
    lastUpdated: z.string().pipe(z.coerce.date()).optional(),
    archived: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [
        [
          remarkCapitalizeHeadings,
          { replaceHeadingRegExp: capitalizationOptions },
        ],
        remarkGfm,
      ],
      rehypePlugins: [
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypePreprocessPrettyCode,
        [rehypePrettyCode, rehypePrettyCodeOptions],
        rehypePostprocessPrettyCode,
      ],
    });

    // Generate TOC separately using remark with capitalization
    const tocRoot = (
      await remark()
        .use(remarkCapitalizeHeadings, {
          replaceHeadingRegExp: capitalizationOptions,
        })
        .use(tocPlugin)
        .process(document.content)
    ).data.toc as TOCNode;

    // Calculate reading time
    const readingTimeStats = readingTime(document.content);

    // Generate clean slug without folder prefixes (posts/, microblog/, etc.)
    const fileName =
      document._meta.path
        .split("/")
        .pop()
        ?.replace(/\.mdx$/, "") || "";

    return {
      ...document,
      mdx,
      toc: JSON.stringify(tocRoot || { children: [] }),
      readingTime: readingTimeStats.text,
      slug: fileName,
      url: `/posts/${fileName}`,
      // Keep folder info for potential categorization
      folder: document._meta.path.includes("/")
        ? document._meta.path.split("/")[0]
        : null,
    };
  },
});

export default defineConfig({
  collections: [posts],
});
