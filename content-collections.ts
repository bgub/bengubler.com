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

    // Determine locale from path: allow locale segment like `content/ar/...`
    const pathSegments = document._meta.path.split("/");
    const allowedLocales = new Set(["en", "ar", "ru", "cs", "sk"]);
    const firstSegment = pathSegments[0] || "";
    const locale = allowedLocales.has(firstSegment) ? firstSegment : "en";

    // Generate clean slug without folder prefixes
    const fileName =
      pathSegments[pathSegments.length - 1]?.replace(/\.mdx$/, "") || "";

    return {
      ...document,
      mdx,
      toc: JSON.stringify(tocRoot || { children: [] }),
      readingTime: readingTimeStats.text,
      slug: fileName,
      url: `/posts/${fileName}`,
      // Keep folder info for potential categorization; skip leading locale segment
      folder:
        pathSegments.length > 0
          ? allowedLocales.has(firstSegment)
            ? pathSegments[1] || null
            : pathSegments[0] || null
          : null,
      locale,
    };
  },
});

export default defineConfig({
  collections: [posts],
});
