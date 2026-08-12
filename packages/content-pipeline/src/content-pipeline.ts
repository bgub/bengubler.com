import Markdoc, {
  type Config,
  type Node,
  type RenderableTreeNodes,
} from "@markdoc/markdoc";
import GithubSlugger from "github-slugger";
import type { HighlightCode } from "./content-highlighter.ts";
import {
  getReadingTime,
  type ReadingTime,
  type ReadingTimeOptions,
} from "./content-reading-time.ts";

export type {
  HighlightedLine,
  HighlightedToken,
} from "./content-highlighter.ts";
export type { ReadingTime } from "./content-reading-time.ts";

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

export type CompiledContent = {
  body: ContentTree;
  readingTime: ReadingTime;
  toc: TocNode;
};

export const contentComponentNames = {
  blockquote: "Blockquote",
  codeBlock: "CodeBlock",
  heading: "Heading",
  inlineCode: "InlineCode",
  link: "Link",
} as const;

export type ContentComponentName =
  (typeof contentComponentNames)[keyof typeof contentComponentNames];

export type CompileContentInput<Metadata = unknown> = {
  filePath?: string;
  metadata?: Metadata;
  source: string;
};

export type ContentDiagnostic = {
  line?: number;
  message: string;
};

export type ContentValidationContext<Metadata = unknown> = {
  ast: Node;
  input: CompileContentInput<Metadata>;
};

export type ContentCompilerOptions<Metadata = unknown> = {
  highlight?: HighlightCode;
  markdoc?: Config;
  readingTime?: ReadingTimeOptions;
  validate?: (
    context: ContentValidationContext<Metadata>,
  ) => readonly ContentDiagnostic[];
};

const tokenizer = new Markdoc.Tokenizer({ linkify: true });

const defaultNodes: NonNullable<Config["nodes"]> = {
  heading: {
    children: ["inline"],
    attributes: {
      level: { type: Number, required: true, render: true },
    },
    transform(node, config) {
      return new Markdoc.Tag(
        contentComponentNames.heading,
        node.transformAttributes(config),
        node.transformChildren(config),
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
        contentComponentNames.codeBlock,
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
};

export function createContentCompiler<Metadata = unknown>(
  options: ContentCompilerOptions<Metadata> = {},
) {
  const config: Config = {
    ...options.markdoc,
    nodes: {
      ...defaultNodes,
      ...options.markdoc?.nodes,
    },
  };

  return (input: CompileContentInput<Metadata>): CompiledContent => {
    const filePath = input.filePath ?? "content.md";
    const ast = Markdoc.parse(tokenizer.tokenize(input.source), filePath);
    const diagnostics = [...(options.validate?.({ ast, input }) ?? [])];

    for (const { error } of Markdoc.validate(ast, config)) {
      if (error.level !== "error" && error.level !== "critical") continue;
      diagnostics.push({
        line:
          error.location?.start.line === undefined
            ? undefined
            : error.location.start.line + 1,
        message: error.message,
      });
    }

    if (diagnostics.length > 0) {
      const details = diagnostics
        .map(({ line, message }) =>
          line === undefined
            ? `${filePath} ${message}`
            : `${filePath}:${line} ${message}`,
        )
        .join("\n");
      throw new Error(`Invalid content:\n${details}`);
    }

    const { body, toc } = compileTree(
      Markdoc.transform(ast, config),
      options.highlight,
    );

    return {
      body,
      toc,
      readingTime: getReadingTime(input.source, options.readingTime),
    };
  };
}

function compileTree(
  tree: RenderableTreeNodes,
  highlight?: HighlightCode,
): { body: ContentTree; toc: TocNode } {
  const toc: TocNode = { type: "root", children: [] };
  const headings = [toc];
  const slugger = new GithubSlugger();

  function serialize(nodes: RenderableTreeNodes): ContentTree {
    const output: ContentTree = [];
    append(nodes, output);
    return output;
  }

  function append(nodes: RenderableTreeNodes, output: ContentTree): void {
    if (Array.isArray(nodes)) {
      for (const node of nodes) append(node, output);
      return;
    }

    if (typeof nodes === "string" || typeof nodes === "number") {
      output.push(nodes);
      return;
    }

    if (!Markdoc.Tag.isTag(nodes)) {
      throw new Error("Markdoc produced an unsupported content node");
    }

    if (nodes.name === contentComponentNames.codeBlock && highlight) {
      nodes.attributes.highlightedLines = highlight(
        String(nodes.attributes.content ?? ""),
        nodes.attributes.language,
      );
    } else if (nodes.name === contentComponentNames.heading) {
      const depth = nodes.attributes.level;

      if (typeof depth === "number") {
        const title = extractText(nodes.children);
        const heading: TocNode = {
          type: "heading",
          children: [],
          depth,
          id: slugger.slug(title),
          title,
        };
        nodes.attributes.id = heading.id;

        while (
          headings.length > 1 &&
          (headings[headings.length - 1].depth ?? 0) >= depth
        ) {
          headings.pop();
        }

        headings[headings.length - 1].children.push(heading);
        headings.push(heading);
      }
    }

    output.push({
      type: "element",
      name: nodes.name,
      attributes: serializeAttributes(nodes.attributes),
      children: serialize(nodes.children),
    });
  }

  return { body: serialize(tree), toc };
}

function extractText(nodes: RenderableTreeNodes): string {
  if (Array.isArray(nodes)) return nodes.map(extractText).join("");
  if (typeof nodes === "string" || typeof nodes === "number") {
    return String(nodes);
  }
  if (!Markdoc.Tag.isTag(nodes)) return "";

  return nodes.name === contentComponentNames.inlineCode
    ? String(nodes.attributes.content ?? "")
    : extractText(nodes.children);
}

function serializeAttributes(
  attributes: Record<string, unknown>,
): Record<string, ContentValue> {
  return Object.fromEntries(
    Object.entries(attributes).filter(
      (entry): entry is [string, ContentValue] => entry[1] !== undefined,
    ),
  );
}
