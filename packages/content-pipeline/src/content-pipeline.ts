import Markdoc, {
  type Config,
  type Node,
  type RenderableTreeNode,
  type RenderableTreeNodes,
  type Tag,
} from "@markdoc/markdoc";
import GithubSlugger from "github-slugger";
import readingTime from "reading-time";
import {
  type BundledLanguage,
  bundledLanguages,
  codeToTokensWithThemes,
} from "shiki";
import {
  lintDocumentCapitalization,
  type TitleCapitalizationOptions,
} from "./content-capitalization.ts";

export type ContentValue =
  | boolean
  | number
  | string
  | null
  | ContentValue[]
  | { [key: string]: ContentValue };

export type ContentElement = {
  attributes: Record<string, ContentValue>;
  children: ContentNode[];
  name: string;
  type: "element";
};

export type ContentNode = ContentElement | number | string;
export type ContentTree = ContentNode[];

export type TocNode = {
  children: TocNode[];
  depth?: number;
  id?: string;
  title?: string;
  type: "heading" | "root";
};

export type HighlightedToken = {
  content: string;
  dark: string;
  fontStyle?: number;
  light: string;
};

export type HighlightedLine = {
  tokens: HighlightedToken[];
};

export type CompiledContent = {
  body: ContentTree;
  readingTime: string;
  toc: TocNode;
};

export const contentComponentNames = {
  blockquote: "Blockquote",
  fence: "Fence",
  heading: "Heading",
  inlineCode: "InlineCode",
  link: "ContentLink",
  tweet: "Tweet",
} as const;

export type ContentComponentName =
  (typeof contentComponentNames)[keyof typeof contentComponentNames];

export type CompileContentInput = {
  filePath: string;
  source: string;
  title: string;
};

export type ContentCompilerOptions = {
  lintCapitalization?: TitleCapitalizationOptions & {
    shouldLint?: (context: { filePath: string }) => boolean;
  };
};

const tokenizer = new Markdoc.Tokenizer({ linkify: true });

const markdocConfig: Config = {
  nodes: {
    heading: {
      children: ["inline"],
      attributes: {
        level: { type: Number, required: true, render: true },
      },
      transform(node, markdocConfig) {
        return new Markdoc.Tag(
          contentComponentNames.heading,
          node.transformAttributes(markdocConfig),
          node.transformChildren(markdocConfig),
        );
      },
    },
    link: {
      ...Markdoc.nodes.link,
      render: contentComponentNames.link,
    },
    fence: {
      ...Markdoc.nodes.fence,
      transform(node) {
        return new Markdoc.Tag(
          contentComponentNames.fence,
          {
            content: node.attributes.content,
            language: node.attributes.language,
          },
          [],
        );
      },
    },
    blockquote: {
      ...Markdoc.nodes.blockquote,
      render: contentComponentNames.blockquote,
    },
    code: {
      ...Markdoc.nodes.code,
      transform(node) {
        return new Markdoc.Tag(
          contentComponentNames.inlineCode,
          { content: node.attributes.content },
          [],
        );
      },
    },
  },
  tags: {
    tweet: {
      render: contentComponentNames.tweet,
      selfClosing: true,
      attributes: {
        id: { type: String, required: true },
      },
    },
  },
};

export function createContentCompiler(options: ContentCompilerOptions = {}) {
  return (input: CompileContentInput) => compileContent(input, options);
}

async function compileContent(
  { filePath, source, title }: CompileContentInput,
  options: ContentCompilerOptions,
): Promise<CompiledContent> {
  const ast = Markdoc.parse(tokenizer.tokenize(source), filePath);
  assertValidCapitalization({ ast, filePath, title }, options);
  const errors = Markdoc.validate(ast, markdocConfig).filter(
    ({ error }) => error.level === "error" || error.level === "critical",
  );

  if (errors.length > 0) {
    const details = errors
      .map(({ error }) => {
        const line = error.location?.start.line;
        const location =
          line === undefined ? filePath : `${filePath}:${line + 1}`;
        return `${location} ${error.message}`;
      })
      .join("\n");
    throw new Error(`Invalid content:\n${details}`);
  }

  const renderable = Markdoc.transform(ast, markdocConfig);
  await highlightCodeFences(renderable);
  const toc = addHeadingIdsAndCollectToc(renderable);

  return {
    body: toContentTree(renderable),
    toc,
    readingTime: readingTime(source).text,
  };
}

function assertValidCapitalization(
  { ast, filePath, title }: { ast: Node; filePath: string; title: string },
  { lintCapitalization }: ContentCompilerOptions,
): void {
  if (!lintCapitalization) return;
  if (
    lintCapitalization.shouldLint &&
    !lintCapitalization.shouldLint({ filePath })
  ) {
    return;
  }

  const issues = lintDocumentCapitalization(
    { ast, title },
    { specialCases: lintCapitalization.specialCases },
  );
  if (issues.length === 0) return;

  const details = issues
    .map(({ actual, expected, kind }) => {
      const label = kind === "heading" ? "Heading" : "Frontmatter title";
      return [
        `${filePath} ${label} should use title case`,
        `  Actual:   ${actual}`,
        `  Expected: ${expected}`,
      ].join("\n");
    })
    .join("\n");

  throw new Error(`Invalid content:\n${details}`);
}

async function highlightCodeFences(
  content: RenderableTreeNodes,
): Promise<void> {
  const fences: Tag[] = [];

  visitTags(content, (tag) => {
    if (tag.name === "Fence") fences.push(tag);
  });

  await Promise.all(
    fences.map(async (fence) => {
      const source = String(fence.attributes.content ?? "");
      const language = normalizeLanguage(fence.attributes.language);
      const lines = await codeToTokensWithThemes(source, {
        lang: language,
        themes: {
          light: "github-light",
          dark: "github-dark-dimmed",
        },
      });

      fence.attributes.highlightedLines = lines.map(
        (line): HighlightedLine => ({
          tokens: line.map((token) => {
            const fontStyle = token.variants.light.fontStyle;

            return {
              content: token.content,
              light: token.variants.light.color ?? "#24292e",
              dark: token.variants.dark.color ?? "#adbac7",
              ...(fontStyle ? { fontStyle } : {}),
            };
          }),
        }),
      );
    }),
  );
}

function normalizeLanguage(language: unknown): BundledLanguage | "text" {
  const normalized = String(language ?? "text").toLowerCase();

  if (["text", "txt", "plaintext", "plain"].includes(normalized)) {
    return "text";
  }

  if (normalized === "eta") return "html";

  return normalized in bundledLanguages
    ? (normalized as BundledLanguage)
    : "text";
}

function addHeadingIdsAndCollectToc(content: RenderableTreeNodes): TocNode {
  const root: TocNode = { type: "root", children: [] };
  const stack = [root];
  const slugger = new GithubSlugger();

  visitTags(content, (tag) => {
    if (tag.name !== "Heading") return;

    const level = tag.attributes.level;
    if (typeof level !== "number") return;

    const title = extractText(tag.children);
    const id = slugger.slug(title);
    tag.attributes.id = id;

    const heading: TocNode = {
      type: "heading",
      depth: level,
      title,
      id,
      children: [],
    };

    while (stack.length > 1 && (stack[stack.length - 1].depth ?? 0) >= level) {
      stack.pop();
    }

    stack[stack.length - 1].children.push(heading);
    stack.push(heading);
  });

  return root;
}

function visitTags(
  node: RenderableTreeNodes,
  visitor: (tag: Tag) => void,
): void {
  if (Array.isArray(node)) {
    for (const child of node) visitTags(child, visitor);
    return;
  }

  if (!Markdoc.Tag.isTag(node)) return;
  visitor(node);
  visitTags(node.children, visitor);
}

function extractText(nodes: RenderableTreeNode[]): string {
  let text = "";

  for (const node of nodes) {
    if (typeof node === "string" || typeof node === "number") {
      text += String(node);
    } else if (Array.isArray(node)) {
      text += extractText(node);
    } else if (Markdoc.Tag.isTag(node)) {
      text +=
        node.name === "InlineCode"
          ? String(node.attributes.content ?? "")
          : extractText(node.children);
    }
  }

  return text;
}

function toContentTree(nodes: RenderableTreeNodes): ContentTree {
  const list = Array.isArray(nodes) ? nodes : [nodes];
  return list.flatMap((node) =>
    Array.isArray(node) ? toContentTree(node) : [toContentNode(node)],
  );
}

function toContentNode(node: RenderableTreeNode): ContentNode {
  if (typeof node === "string" || typeof node === "number") return node;

  if (Array.isArray(node)) throw new Error("Unexpected nested content array");

  if (!Markdoc.Tag.isTag(node)) {
    throw new Error("Markdoc produced an unsupported content node");
  }

  return {
    type: "element",
    name: node.name,
    attributes: toContentAttributes(node.attributes),
    children: toContentTree(node.children),
  };
}

function toContentAttributes(
  attributes: Record<string, unknown>,
): Record<string, ContentValue> {
  return Object.fromEntries(
    Object.entries(attributes).filter(
      (entry): entry is [string, ContentValue] => {
        return entry[1] !== undefined;
      },
    ),
  );
}
