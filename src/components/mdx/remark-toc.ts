import { toc } from "mdast-util-toc";
import { remark } from "remark";

import type { Root } from "mdast";

export async function getHeadings(markdownText: string) {
  const processedContent = await remark().use(remarkToc).process(markdownText);

  return processedContent.toString();
}

function remarkToc() {
  return function (tree: Root) {
    const result = toc(tree, {});

    if (!result.map) {
      throw new Error("No table of contents found in markdown file.");
    }

    tree.children = [result.map];
  };
}
