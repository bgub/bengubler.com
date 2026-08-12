import { defineCollection, defineContent } from "@bgub/fig-content";
import {
  createContentCompiler,
  type ContentValidationContext,
} from "content-pipeline";
import { createHighlighter, githubTheme } from "content-pipeline/highlight";
import { lintDocumentCapitalization } from "content-pipeline/title-case";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import { z } from "zod";
import { specialCases } from "./src/lib/capitalization.ts";

const frontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string().pipe(z.coerce.date()),
  lastUpdated: z.string().pipe(z.coerce.date()).optional(),
  archived: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

type PostFrontmatter = z.infer<typeof frontmatterSchema>;

const highlight = createHighlighter({
  languages: {
    bash,
    css,
    dockerfile,
    html,
    javascript,
    json,
    python,
    sql,
    typescript,
    yaml,
  },
  aliases: {
    eta: "html",
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
  },
  theme: githubTheme,
});

const compileContent = createContentCompiler<PostFrontmatter>({
  highlight,
  markdoc: {
    tags: {
      tweet: {
        render: "Tweet",
        selfClosing: true,
        attributes: {
          id: { type: String, required: true },
        },
      },
    },
  },
  readingTime: { wordsPerMinute: 200 },
  validate: validateCapitalization,
});

function validateCapitalization({
  ast,
  input,
}: ContentValidationContext<PostFrontmatter>) {
  if (!input.filePath?.startsWith("en/") || !input.metadata) return [];

  return lintDocumentCapitalization(
    { ast, title: input.metadata.title },
    { specialCases },
  ).map(({ actual, expected, kind }) => {
    const label = kind === "heading" ? "Heading" : "Frontmatter title";
    return {
      message: [
        `${label} should use title case`,
        `  Actual:   ${actual}`,
        `  Expected: ${expected}`,
      ].join("\n"),
    };
  });
}

const posts = defineCollection({
  directory: "content",
  schema: frontmatterSchema,
  async compile(file) {
    const frontmatter = file.frontmatter;
    const compiled = await compileContent({
      filePath: file.path,
      metadata: frontmatter,
      source: file.source,
    });
    const slug = file.path.split("/").pop()?.replace(/\.md$/, "") ?? "";
    const [locale] = file.path.split("/");

    return {
      ...frontmatter,
      body: JSON.stringify(compiled.body),
      content: file.source,
      locale,
      readingTime: `${compiled.readingTime.minutes} min read`,
      slug,
      toc: JSON.stringify(compiled.toc),
      url: `/posts/${slug}`,
    };
  },
  id: (post) => `${post.locale}/${post.slug}`,
  summary: ({ body: _body, content: _content, toc: _toc, ...summary }) =>
    summary,
});

export const content = defineContent({ collections: { posts } });
