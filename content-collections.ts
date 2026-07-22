import { defineCollection, defineConfig } from "@content-collections/core";
import { createContentCompiler } from "content-pipeline";
import { z } from "zod";
import { specialCases } from "@/lib/capitalization";

const compiler = createContentCompiler({
  lintCapitalization: {
    specialCases,
    shouldLint: ({ filePath }) => filePath.startsWith("en/"),
  },
});

const posts = defineCollection({
  name: "posts",
  directory: "content",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().pipe(z.coerce.date()),
    lastUpdated: z.string().pipe(z.coerce.date()).optional(),
    archived: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    content: z.string(),
  }),
  transform: async (document) => {
    const compiled = await compiler({
      source: document.content,
      title: document.title,
      filePath: document._meta.path,
    });

    // Generate clean slug without folder prefixes
    const fileName =
      document._meta.path.split("/").pop()?.replace(/\.md$/, "") || "";

    const [locale] = document._meta.path.split("/");

    return {
      ...document,
      ...compiled,
      body: JSON.stringify(compiled.body),
      toc: JSON.stringify(compiled.toc),
      slug: fileName,
      url: `/posts/${fileName}`,
      locale,
    };
  },
});

export default defineConfig({
  content: [posts],
});
