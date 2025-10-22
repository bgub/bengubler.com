import GithubSlugger from "github-slugger";
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

// Minimal local types to avoid external type-only deps
type UnifiedPlugin = () => (
  tree: unknown,
  file: { data: Record<string, unknown> },
) => void;
type UnistNode = { [key: string]: unknown };

interface HeadingNode extends UnistNode {
  depth: number;
  children: { value: string }[];
}

export interface TOCNode {
  type?: string;
  depth?: number;
  title?: string;
  id?: string;
  children: TOCNode[];
}

// Helper function to extract text from a node and its children
const extractText = (node: UnistNode): string => {
  let text = "";
  callVisit(node as unknown as { [key: string]: unknown }, (child: unknown) => {
    const c = child as { value?: unknown };
    if (typeof c.value === "string") {
      text += c.value;
    }
  });
  return text;
};

export const tocPlugin: UnifiedPlugin = () => {
  return (tree: unknown, file: { data: Record<string, unknown> }): void => {
    const toc: TOCNode = {
      type: "root",
      children: [],
    };

    const slugger = new GithubSlugger();
    const stack: TOCNode[] = [toc]; // Stack to track the hierarchy

    callVisit(tree as unknown, "heading", (node: HeadingNode) => {
      const { depth } = node;
      const title = extractText(node);

      const newItem: TOCNode = {
        type: "heading",
        depth,
        title,
        id: slugger.slug(title),
        children: [],
      };

      // Pop from stack until we find the appropriate parent level
      while (
        stack.length > 1 &&
        (stack[stack.length - 1].depth ?? 0) >= depth
      ) {
        stack.pop();
      }

      // Add to the current parent (last item in stack)
      const parent = stack[stack.length - 1];
      parent.children.push(newItem);

      // Push this item to the stack for potential children
      stack.push(newItem);
    });

    // Attach the TOC to the file's data property
    file.data.toc = toc;
  };
};
