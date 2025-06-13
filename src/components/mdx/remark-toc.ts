import GithubSlugger from "github-slugger";
import { Plugin, Transformer } from "unified";
import { Node } from "unist";
import { visit } from "unist-util-visit";
import { VFile } from "vfile";

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

      if (depth === 1) {
        toc.children.push(newItem);
      } else {
        let parent = findParent(toc, depth - 1);
        if (parent) {
          parent.children.push(newItem);
        } else {
          toc.children.push(newItem); // Fallback in case no parent is found
        }
      }
    });

    // Attach the TOC to the file's data property
    file.data.toc = toc;
  };
};

function findParent(node: TOCNode, depth: number): TOCNode | null {
  if (node.depth === depth) {
    return node;
  }
  for (let child of node.children) {
    const found = findParent(child, depth);
    if (found) {
      return found;
    }
  }

  return null;
}
