import { visit } from "unist-util-visit";

// Helper to call unist-util-visit without importing its types
function callVisit(
  tree: unknown,
  testOrVisitor?: unknown,
  maybeVisitor?: unknown,
): void {
  (
    visit as unknown as (
      tree: unknown,
      test?: unknown,
      visitor?: unknown,
    ) => void
  )(tree, testOrVisitor, maybeVisitor);
}

type HastElementNode = {
  type: "element";
  tagName: string;
  properties?: Record<string, unknown>;
  children?: Array<unknown>;
};

function isElement(node: unknown): node is HastElementNode {
  return (
    !!node &&
    typeof node === "object" &&
    (node as { type?: unknown }).type === "element" &&
    typeof (node as { tagName?: unknown }).tagName === "string"
  );
}

export const rehypePreprocessPrettyCode = () => (tree: unknown) => {
  callVisit(tree, (node: unknown) => {
    if (!isElement(node) || node.tagName !== "pre") return;

    const firstChild = (node.children?.[0] ?? undefined) as unknown;
    if (!isElement(firstChild) || firstChild.tagName !== "code") return;

    const textNode = (firstChild.children?.[0] ?? undefined) as
      | { value?: string }
      | undefined;

    node.properties = node.properties ?? {};
    (node.properties as Record<string, unknown>).__raw_string__ =
      textNode?.value ?? "";
  });
};

export const rehypePrettyCodeOptions = {
  theme: {
    dark: "github-dark-dimmed",
    light: "github-light",
  },
  keepBackground: false,
};

export const rehypePostprocessPrettyCode = () => (tree: unknown) => {
  callVisit(tree, (node: unknown) => {
    if (!isElement(node) || node.tagName !== "figure") return;
    const isPrettyCodeFigure =
      node.properties?.["data-rehype-pretty-code-figure"] === "";
    if (!isPrettyCodeFigure) return;

    for (const child of node.children ?? []) {
      if (isElement(child) && child.tagName === "pre") {
        child.properties = child.properties ?? {};
        (child.properties as Record<string, unknown>).__raw_string__ = node
          .properties?.__raw_string__ as string | undefined;

        if (node.properties) {
          delete (node.properties as Record<string, unknown>).__raw_string__;
        }
        break;
      }
    }
  });
};
