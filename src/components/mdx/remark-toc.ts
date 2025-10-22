import GithubSlugger from "github-slugger";
import type { Plugin, Transformer } from "unified";
import type { Node } from "unist";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

interface HeadingNode extends Node {
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
const extractText = (node: Node): string => {
  let text = "";
  visit(node, (child) => {
    if ("value" in child && typeof child.value === "string") {
      text += child.value;
    }
  });
  return text;
};

export const tocPlugin: Plugin = (): Transformer => {
  return (tree: Node, file: VFile): void => {
    const toc: TOCNode = {
      type: "root",
      children: [],
    };

    const slugger = new GithubSlugger();
    const stack: TOCNode[] = [toc]; // Stack to track the hierarchy

    visit(tree, "heading", (node: HeadingNode) => {
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
      while (stack.length > 1 && stack[stack.length - 1].depth! >= depth) {
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
